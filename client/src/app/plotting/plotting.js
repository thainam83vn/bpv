"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var $ = require("jquery");
var data_common_1 = require("../models/data-common");
var data_common_2 = require("../models/data-common");
var PlottingComponent = (function () {
    function PlottingComponent() {
        var _this = this;
        this.IconGroup = "<i class=\"fa fa-indent\" aria-hidden=\"true\"></i>";
        this.initControl = new core_1.EventEmitter();
        this.selectItem = new core_1.EventEmitter();
        this.selectedGroupableFields = [];
        this.selectedGroupableFieldsRange = [];
        this.regions = [];
        this.regionsPos = [];
        this.regionMain = null;
        this.isLoading = false;
        this.HeatMapWidth = 400;
        this.HeatMapHeight = 400;
        this.xdash = "";
        this.ydash = "";
        this.isShowConfiguration = false;
        this.isShowGroup = false;
        this.isShowRegions = false;
        this.mouseDragging = false;
        this.mouseRect = [-1, -1, 0, 0];
        this.currentDS = this.datasource;
        setTimeout(function () {
            _this.initControl.emit(_this);
            _this.refresh();
        }, 500);
    }
    PlottingComponent.prototype.initDataGridControl = function (control) {
        this.datagridControl = control;
    };
    PlottingComponent.prototype.refresh = function () {
        if (this.datagridControl)
            this.datagridControl.createMeta();
        if (this.currentDS == null)
            this.currentDS = this.datasource;
        this.createHeatMap(this.meta, this.currentDS);
    };
    PlottingComponent.prototype.createHeatMap = function (meta, dataset) {
        var maxValue = data_common_2.DataCommon.lookupValue(dataset, function (item) { return parseInt(item[meta.ValueFieldName]); }, function (a, b) { return a > b; });
        var minValue = data_common_2.DataCommon.lookupValue(dataset, function (item) { return parseInt(item[meta.ValueFieldName]); }, function (a, b) { return a < b; });
        var maxX = data_common_2.DataCommon.lookupValue(dataset, function (item) { return item[meta.XFieldName]; }, function (a, b) { return a > b; });
        var minX = data_common_2.DataCommon.lookupValue(dataset, function (item) { return item[meta.XFieldName]; }, function (a, b) { return a < b; });
        var maxY = data_common_2.DataCommon.lookupValue(dataset, function (item) { return item[meta.YFieldName]; }, function (a, b) { return a > b; });
        var minY = data_common_2.DataCommon.lookupValue(dataset, function (item) { return item[meta.YFieldName]; }, function (a, b) { return a < b; });
        if (minX + "" == "")
            minX = 0;
        if (maxX + "" == "")
            maxX = 1;
        if (minY + "" == "")
            minY = 0;
        if (maxY + "" == "")
            maxY = 1;
        minX = parseFloat(minX + "");
        maxX = parseFloat(maxX + "");
        minY = parseFloat(minY + "");
        maxY = parseFloat(maxY + "");
        if (maxX == minX) {
            minX = maxX - maxX / 2;
            maxX = maxX + maxX / 2;
        }
        if (maxY == minY) {
            minY = maxY - maxY / 2;
            maxY = maxY + maxY / 2;
        }
        meta.XMax = maxX;
        meta.YMax = maxY;
        meta.XMin = minX;
        meta.YMin = minY;
        // minX = 0;
        // minY = 0;
        var delX = maxX - minX;
        var gapX = delX / 5;
        meta.XRanges = [];
        for (var i = 0; i <= maxX; i += gapX) {
            var v = Math.round(i * 100) / 100;
            var desc = v + "";
            if (v == 0)
                desc = "";
            //var value = v/delX*100;
            var value = this.percentageX(v);
            meta.XRanges.push({ Name: desc, Value: value });
        }
        var delY = maxY - minY;
        var gapY = delY / 5;
        meta.YRanges = [];
        for (var i = 0; i <= maxY; i += gapY) {
            var v = Math.round(i * 100) / 100;
            var desc = v + "";
            if (v == 0)
                desc = "";
            //var value = v/delY*100;
            var value = this.percentageY(v);
            meta.YRanges.push({ Name: desc, Value: value });
        }
        meta.Items = [];
        for (var _i = 0, dataset_1 = dataset; _i < dataset_1.length; _i++) {
            var item = dataset_1[_i];
            var name = item[meta.DetailFieldName];
            var x = item[meta.XFieldName];
            var xPos = this.percentageX(x);
            var y = item[meta.YFieldName];
            var yPos = this.percentageY(y);
            var v = (parseInt(item[meta.ValueFieldName]) - minValue) * 100 / (maxValue - minValue);
            var r = Math.floor(Math.random() * 1000);
            //console.log("Rand",r);
            var color = data_common_1.CSS.COLORS[r % data_common_1.CSS.COLORS.length];
            // console.log("Value",minValue,"-",maxValue," ", parseInt(item[meta.ValueFieldName]));
            var itemDisplay = {
                Name: name,
                X: x,
                Y: y,
                XPercentage: xPos,
                YPercentage: yPos,
                Data: item,
                Value: v,
                Color: color
            };
            meta.Items.push(itemDisplay);
        }
        this.regions = [];
        this.regionsPos = [];
        var H = 600;
        var W = $(".pointmap .content").width();
        var w = maxX - minX;
        var h = maxY - minY;
        var xdp = meta.XMin;
        var ydp = meta.YMin;
        var xdashesEx = [];
        for (var _a = 0, _b = this.meta.XDashes; _a < _b.length; _a++) {
            var xp = _b[_a];
            xdashesEx.push(xp);
        }
        xdashesEx.push(maxX);
        var ydashesEx = [];
        for (var _c = 0, _d = this.meta.YDashes; _c < _d.length; _c++) {
            var yp = _d[_c];
            ydashesEx.push(yp);
        }
        ydashesEx.push(maxY);
        for (var _e = 0, ydashesEx_1 = ydashesEx; _e < ydashesEx_1.length; _e++) {
            var yd = ydashesEx_1[_e];
            var xdp = meta.XMin;
            for (var _f = 0, xdashesEx_1 = xdashesEx; _f < xdashesEx_1.length; _f++) {
                var xd = xdashesEx_1[_f];
                this.regions.push([xdp, ydp, xd - xdp, yd - ydp]);
                var xp1 = (xdp - meta.XMin) / w * W;
                var xp2 = (xd - meta.XMin) / w * W;
                var yp1 = (ydp - meta.YMin) / h * H;
                var yp2 = (yd - meta.YMin) / h * H;
                this.regionsPos.push({ Active: false, Value: [xdp, ydp, xd - xdp, yd - ydp], Pos: [xp1, H - yp1 - (yp2 - yp1), xp2 - xp1, yp2 - yp1] });
                xdp = xd;
            }
            ydp = yd;
        }
        console.log("createHeatMap", minX, maxX, minY, maxY, this.regions, this.regionsPos, meta);
    };
    PlottingComponent.prototype.cellWidth = function (cell) {
        var r = Math.round(Math.abs(cell.X.From - cell.X.To) * this.HeatMapWidth);
        // console.log("cellWidth", r);
        return r + "px";
    };
    PlottingComponent.prototype.cellHeight = function (cell) {
        var r = Math.round(Math.abs(cell.Y.From - cell.Y.To) * this.HeatMapHeight);
        // console.log("cellHeight", r);
        return r + "px";
    };
    PlottingComponent.prototype.cellLeft = function (cell) {
        var r = Math.round(cell.X.From * this.HeatMapWidth);
        // console.log("cellLeft", r);
        return r + "px";
    };
    PlottingComponent.prototype.cellTop = function (cell) {
        var h = Math.round(Math.abs(cell.Y.From - cell.Y.To) * this.HeatMapHeight);
        var r = this.HeatMapHeight - Math.round(cell.Y.From * this.HeatMapHeight) - h;
        // console.log("cellTop", r);
        return r + "px";
    };
    PlottingComponent.prototype.onDetailChanged = function (item) {
        console.log("onDetailChanged", item);
        this.meta.DetailFieldName = item;
        this.refresh();
    };
    PlottingComponent.prototype.onDisplayChanged = function (items) {
        console.log("onDisplayChanged", items);
    };
    PlottingComponent.prototype.updateSelectedGroupableFieldsRange = function () {
        this.selectedGroupableFieldsRange = [];
        if (this.selectedGroupableFields.length > 0) {
            var lastField = this.selectedGroupableFields[this.selectedGroupableFields.length - 1];
            for (var _i = 0, _a = this.meta.GroupableFields; _i < _a.length; _i++) {
                var f = _a[_i];
                this.selectedGroupableFieldsRange.push(f);
                if (lastField.Name == f.Name) {
                    break;
                }
            }
        }
        console.log("selectedGroupableFieldsRange", this.selectedGroupableFieldsRange);
    };
    PlottingComponent.prototype.removeGroup = function (group) {
        var _this = this;
        this.isLoading = true;
        setTimeout(function () {
            var current = _this.selectedGroupableFields[_this.selectedGroupableFields.length - 1];
            if (current.Value == "") {
                _this.selectedGroupableFields.splice(_this.selectedGroupableFields.length - 1, 1);
                if (_this.selectedGroupableFields.length > 0) {
                    current = _this.selectedGroupableFields[_this.selectedGroupableFields.length - 1];
                    current.Value = "";
                }
                _this.updateGroupData();
            }
            else {
                current.Value = "";
                _this.updateGroupData();
            }
            _this.updateSelectedGroupableFieldsRange();
            _this.isLoading = false;
        }, 50);
    };
    PlottingComponent.prototype.updateGroupData = function () {
        var parentDS = null;
        if (this.selectedGroupableFields.length > 0) {
            var parentGroup = null;
            for (var i = this.selectedGroupableFields.length - 1; i >= 0; i--) {
                if (this.selectedGroupableFields[i].Value != "") {
                    parentDS = this.selectedGroupableFields[i].Value.Items;
                    break;
                }
            }
            if (parentDS == null)
                parentDS = this.datasource;
            var group = this.selectedGroupableFields[this.selectedGroupableFields.length - 1];
            if (group.Value == "") {
                var valueFieldName = "RevenueTotal";
                group.DataSet = data_common_2.DataCommon.groupBy(parentDS, function (e) { return e[group.Name]; }, function (item, e) {
                    var total = item.Total;
                    if (total == null)
                        total = 0;
                    total += parseFloat(e[valueFieldName]);
                    item.Total = total;
                });
                for (var _i = 0, _a = group.DataSet; _i < _a.length; _i++) {
                    var it_1 = _a[_i];
                    it_1.Avg = Math.floor(it_1.Total / it_1.Items.length);
                }
                var max = data_common_2.DataCommon.lookupValue(group.DataSet, function (item) { return item.Avg; }, function (a, b) { return a > b; });
                for (var _b = 0, _c = group.DataSet; _b < _c.length; _b++) {
                    var it_2 = _c[_b];
                    it_2.Percentage = (it_2.Avg / max) * 100;
                }
            }
        }
        else {
            parentDS = this.datasource;
        }
        this.currentDS = parentDS;
        this.refresh();
    };
    PlottingComponent.prototype.onSelectLastGroup = function (itGroup) {
        var _this = this;
        this.isLoading = true;
        setTimeout(function () {
            var current = _this.selectedGroupableFields[_this.selectedGroupableFields.length - 1];
            current.Value = itGroup;
            _this.updateGroupData();
            // this.refresh();
            console.log("selectedGroupableFields", _this.selectedGroupableFields);
            _this.isLoading = false;
        }, 50);
    };
    PlottingComponent.prototype.onGroupChanged = function (group, itGroup) {
        var _this = this;
        console.log("onGroupChanged", group);
        this.isLoading = true;
        setTimeout(function () {
            // var current = this.selectedGroupableFields[this.selectedGroupableFields.length - 1];
            // var parentDS = this.datasource;
            // if (this.selectedGroupableFields.length > 0 && itGroup != null){
            //     this.selectedGroupableFields[this.selectedGroupableFields.length - 1].Value = itGroup;
            //     parentDS = itGroup.Items;
            // }
            // this.currentDS = parentDS;
            // this.refresh();
            // var valueFieldName = "RevenueTotal";
            // group.DataSet = DataCommon.groupBy(parentDS, (e: any)=>{return e[group.Name];}, (item: any, e: any)=>{
            //     var total = item.Total;
            //     if (total == null) total = 0;
            //     total += parseFloat(e[valueFieldName]);
            //     item.Total = total;
            // });
            // for (let it of group.DataSet){
            //     it.Avg = Math.floor(it.Total/it.Items.length);
            // }
            // var max = DataCommon.lookupValue(group.DataSet, 
            //         (item: any)=>{return item.Avg;},
            //         (a:number,b:number)=>{return a>b;});
            // for (let it of group.DataSet){
            //     it.Percentage = (it.Avg/max)*100;
            // }
            // group.Items = [];
            if (_this.selectedGroupableFields.length > 0 && itGroup != null) {
                _this.selectedGroupableFields[_this.selectedGroupableFields.length - 1].Value = itGroup;
            }
            _this.selectedGroupableFields.push(group);
            _this.updateGroupData();
            _this.updateSelectedGroupableFieldsRange();
            // console.log("selectedGroupableFields", this.selectedGroupableFields);
            _this.isLoading = false;
        }, 50);
    };
    PlottingComponent.prototype.group = function (source, f) {
        if (f.Checked) {
            var ds = data_common_2.DataCommon.groupBy(this.currentDS, function (e) {
                return e[f.Name];
            }, null);
        }
    };
    PlottingComponent.prototype.onValueChanged = function (item) {
        console.log("onValueChanged", item);
        this.meta.ValueFieldName = item;
        this.refresh();
    };
    PlottingComponent.prototype.onXAxisChanged = function (item) {
        console.log("onXAxisChanged", item);
        this.meta.XFieldName = item;
        this.meta.XDesc = item;
        this.refresh();
    };
    PlottingComponent.prototype.onYAxisChanged = function (item) {
        console.log("onYAxisChanged", item);
        this.meta.YFieldName = item;
        this.meta.YDesc = item;
        this.refresh();
    };
    PlottingComponent.prototype.addXDash = function () {
        var v = parseFloat(this.xdash);
        if (this.meta.XDashes.indexOf(v) < 0)
            this.meta.XDashes.push(v);
        this.xdash = "";
    };
    PlottingComponent.prototype.removeXDash = function (v) {
        var i = this.meta.XDashes.indexOf(v);
        if (i >= 0) {
            this.meta.XDashes.splice(i, 1);
        }
    };
    PlottingComponent.prototype.addYDash = function () {
        var v = parseFloat(this.ydash);
        if (this.meta.YDashes.indexOf(v) < 0)
            this.meta.YDashes.push(v);
        this.ydash = "";
    };
    PlottingComponent.prototype.removeYDash = function (v) {
        var i = this.meta.YDashes.indexOf(v);
        if (i >= 0) {
            this.meta.YDashes.splice(i, 1);
        }
    };
    PlottingComponent.prototype.percentageX = function (xd) {
        var delX = this.meta.XMax - this.meta.XMin;
        var value = (xd - this.meta.XMin) / delX * 100;
        return value;
    };
    PlottingComponent.prototype.percentageY = function (yd) {
        var delY = this.meta.YMax - this.meta.YMin;
        var value = (yd - this.meta.YMin) / delY * 100;
        //console.log("percentageY",value);
        return value;
    };
    PlottingComponent.prototype.mouseFilterStart = function () {
        this.mouseDragging = !this.mouseDragging;
        this.mouseRect = [-1, -1, 0, 0];
        for (var _i = 0, _a = this.regionsPos; _i < _a.length; _i++) {
            var r = _a[_i];
            r.Active = false;
        }
    };
    PlottingComponent.prototype.mouseFilterDown = function (event) {
        // console.log(event);
        var xbase = $(".pointmap .content").offset().left;
        var ybase = $(".pointmap .content").offset().top;
        if (this.mouseDragging) {
            var x = this.mouseRect[0];
            var y = this.mouseRect[1];
            if (x == -1 && y == -1) {
                x = event.x - xbase;
                y = event.y - ybase;
                this.mouseRect = [x, y, 0, 0];
            }
            else {
                var w = event.x - x;
                var h = event.y - y;
                this.mouseRect = [x, y, w, h];
            }
        }
    };
    PlottingComponent.prototype.rectContains = function (rect1, x, y) {
        return rect1[0] <= x && x <= rect1[0] + rect1[2]
            && rect1[1] <= y && y <= rect1[1] + rect1[3];
    };
    PlottingComponent.prototype.rectIntersect = function (r1, r2) {
        return !(r2[0] > r1[0] + r1[2] ||
            r2[0] + r2[2] < r1[0] ||
            r2[1] > r1[1] + r1[3] ||
            r2[1] + r2[3] < r1[1]);
        // return this.rectContains(rect1, rect2[0],rect2[1])
        // || this.rectContains(rect1, rect2[0],rect2[1] + rect2[3])
        // || this.rectContains(rect1, rect2[0],rect2[1])
        // || this.rectContains(rect1, rect2[0] + rect2[2],rect2[1])
        // || this.rectContains(rect2, rect1[0],rect1[1])
        // || this.rectContains(rect2, rect1[0],rect1[1] + rect1[3])
        // || this.rectContains(rect2, rect1[0],rect1[1])
        // || this.rectContains(rect2, rect1[0] + rect1[2],rect1[1]);
    };
    PlottingComponent.prototype.mouseFilterMove = function (event) {
        var xbase = $(".pointmap .content").offset().left;
        var ybase = $(".pointmap .content").offset().top;
        var x = this.mouseRect[0];
        var y = this.mouseRect[1];
        if (x >= 0 && y >= 0 && this.mouseDragging) {
            var x = this.mouseRect[0];
            var y = this.mouseRect[1];
            var w = (event.x - xbase) - x;
            var h = (event.y - ybase) - y;
            this.mouseRect = [x, y, w, h];
            for (var _i = 0, _a = this.regionsPos; _i < _a.length; _i++) {
                var r = _a[_i];
                r.Active = this.rectIntersect(r.Pos, this.mouseRect);
            }
        }
    };
    PlottingComponent.prototype.mouseFilterUp = function () {
        var W = 1400; //$(".pointmap .content").width();
        var H = 600; //$(".pointmap .content").height();
        if (this.mouseDragging) {
            this.mouseDragging = false;
            // console.log("mouseFilterUp", this.mouseRect);
            var xv = (this.mouseRect[0] / W) * (this.meta.XMax - this.meta.XMin);
            var yv = (this.mouseRect[1] / H) * (this.meta.YMax - this.meta.YMin);
            var wv = (this.mouseRect[2] / W) * (this.meta.YMax - this.meta.YMin);
            var hv = (this.mouseRect[3] / H) * (this.meta.YMax - this.meta.YMin);
            this.filterData(xv, yv, xv + wv, yv + hv);
            this.mouseRect = [-1, -1, 0, 0];
        }
    };
    PlottingComponent.prototype.filterData = function (from1, to1, from2, to2) {
        var newDS = [];
        var rx1 = this.meta.XMax, rx2 = this.meta.XMin, ry1 = this.meta.YMax, ry2 = this.meta.YMin;
        for (var _i = 0, _a = this.regionsPos; _i < _a.length; _i++) {
            var r = _a[_i];
            if (r.Active) {
                var values = r.Value;
                if (values[0] < rx1)
                    rx1 = values[0];
                if (values[0] + values[2] > rx2)
                    rx2 = values[0] + values[2];
                if (values[1] < ry1)
                    ry1 = values[1];
                if (values[1] + values[3] > ry2)
                    ry2 = values[1] + values[3];
            }
        }
        this.regionMain = [rx1, ry1, rx2, ry2];
        console.log("regions", this.regionsPos, this.regionMain);
        for (var _b = 0, _c = this.regionsPos; _b < _c.length; _b++) {
            var r = _c[_b];
            if (r.Active) {
                var values = r.Value;
                var xr1 = values[0];
                var yr1 = values[1];
                var xr2 = xr1 + values[2];
                var yr2 = yr1 + values[3];
                for (var _d = 0, _e = this.currentDS; _d < _e.length; _d++) {
                    var item = _e[_d];
                    var x = parseFloat(item[this.meta.XFieldName]);
                    var y = parseFloat(item[this.meta.YFieldName]);
                    var check = (x >= xr1 && x <= xr2 && y >= yr1 && y <= yr2);
                    //console.log("checking: ",xr1,yr1,xr2,yr2,x,y,check);
                    if (check) {
                        newDS.push(item);
                    }
                }
            }
        }
        this.currentDS = newDS;
        this.refresh();
        // for(let item of this.currentDS){
        //     var x = parseFloat(item[this.meta.XFieldName]);
        //     var y = parseFloat(item[this.meta.YFieldName]);
        //     for(let r of this.regionsPos){
        //         if (r.Active){
        //             var values = r.Value;
        //             if (x>=values[0] && x<=values[0]+values[2] && y >= values[1] && y <= values[1]+values[2]){
        //                 newDS.push(item);                    
        //             }
        //         }
        //     }
        //     // if (x >= from1 && x<=to1 && y>=from2 && y<=to2){
        //     //     newDS.push(item);
        //     // }
        // }
        // this.currentDS=newDS;
        console.log("filterData", newDS);
    };
    PlottingComponent.prototype.removeCurrentRegion = function () {
        this.regionMain = null;
        this.currentDS = this.datasource;
        this.refresh();
    };
    PlottingComponent.prototype.selectItemLocal = function (cell) {
        this.selectItem.emit(cell.Data);
        console.log(cell);
    };
    return PlottingComponent;
}());
__decorate([
    core_1.Output("initControl"),
    __metadata("design:type", core_1.EventEmitter)
], PlottingComponent.prototype, "initControl", void 0);
__decorate([
    core_1.Output("selectItem"),
    __metadata("design:type", core_1.EventEmitter)
], PlottingComponent.prototype, "selectItem", void 0);
__decorate([
    core_1.Input("datasource"),
    __metadata("design:type", Array)
], PlottingComponent.prototype, "datasource", void 0);
__decorate([
    core_1.Input("meta"),
    __metadata("design:type", Object)
], PlottingComponent.prototype, "meta", void 0);
PlottingComponent = __decorate([
    core_1.Component({
        selector: "[point-map]",
        templateUrl: "./plotting-template.html",
        styleUrls: ["./plotting-styles.css"]
    }),
    __metadata("design:paramtypes", [])
], PlottingComponent);
exports.PlottingComponent = PlottingComponent;
//# sourceMappingURL=plotting.js.map