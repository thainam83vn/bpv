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
var data_common_1 = require("../models/data-common");
var HeatMapComponent = (function () {
    function HeatMapComponent() {
        var _this = this;
        this.initControl = new core_1.EventEmitter();
        this.cellClicked = new core_1.EventEmitter();
        this.HeatMapWidth = 400;
        this.HeatMapHeight = 400;
        setTimeout(function () {
            _this.initControl.emit(_this);
        }, 500);
    }
    HeatMapComponent.prototype.refresh = function () {
        this.createHeatMap(this.heatmap, this.datasource);
    };
    HeatMapComponent.prototype.createHeatMap = function (meta, dataset) {
        for (var i = 0; i < meta.Items.length; i++) {
            var cell = meta.Items[i];
            var ls = data_common_1.DataCommon.where(dataset, function (e1) {
                return e1[meta.XFieldName] >= cell.X.From && e1[meta.XFieldName] < cell.X.To
                    && e1[meta.YFieldName] >= cell.Y.From && e1[meta.YFieldName] < cell.Y.To;
            });
            cell.Result = ls;
        }
    };
    HeatMapComponent.prototype.cellClickedLocal = function (cell) {
        this.cellClicked.emit(cell);
    };
    HeatMapComponent.prototype.cellWidth = function (cell) {
        var r = Math.round(Math.abs(cell.X.From - cell.X.To) * this.HeatMapWidth);
        // console.log("cellWidth", r);
        return r + "px";
    };
    HeatMapComponent.prototype.cellHeight = function (cell) {
        var r = Math.round(Math.abs(cell.Y.From - cell.Y.To) * this.HeatMapHeight);
        // console.log("cellHeight", r);
        return r + "px";
    };
    HeatMapComponent.prototype.cellLeft = function (cell) {
        var r = Math.round(cell.X.From * this.HeatMapWidth);
        // console.log("cellLeft", r);
        return r + "px";
    };
    HeatMapComponent.prototype.cellTop = function (cell) {
        var h = Math.round(Math.abs(cell.Y.From - cell.Y.To) * this.HeatMapHeight);
        var r = this.HeatMapHeight - Math.round(cell.Y.From * this.HeatMapHeight) - h;
        // console.log("cellTop", r);
        return r + "px";
    };
    HeatMapComponent.prototype.onDetailChanged = function (item) {
        console.log("onDetailChanged", item);
        this.refresh();
    };
    HeatMapComponent.prototype.onXAxisChanged = function (item) {
        console.log("onXAxisChanged", item);
        this.heatmap.XFieldName = item;
        this.heatmap.XDesc = item;
        this.refresh();
    };
    HeatMapComponent.prototype.onYAxisChanged = function (item) {
        console.log("onYAxisChanged", item);
        this.heatmap.YFieldName = item;
        this.heatmap.YDesc = item;
        this.refresh();
    };
    return HeatMapComponent;
}());
__decorate([
    core_1.Output("initControl"),
    __metadata("design:type", core_1.EventEmitter)
], HeatMapComponent.prototype, "initControl", void 0);
__decorate([
    core_1.Output("cellClicked"),
    __metadata("design:type", core_1.EventEmitter)
], HeatMapComponent.prototype, "cellClicked", void 0);
__decorate([
    core_1.Input("datasource"),
    __metadata("design:type", Array)
], HeatMapComponent.prototype, "datasource", void 0);
__decorate([
    core_1.Input("heatmap"),
    __metadata("design:type", Object)
], HeatMapComponent.prototype, "heatmap", void 0);
HeatMapComponent = __decorate([
    core_1.Component({
        selector: "[heatmap]",
        templateUrl: "./heat-map-template.html",
        styleUrls: ["./heat-map-styles.css"]
    }),
    __metadata("design:paramtypes", [])
], HeatMapComponent);
exports.HeatMapComponent = HeatMapComponent;
//# sourceMappingURL=heat-map-component.js.map