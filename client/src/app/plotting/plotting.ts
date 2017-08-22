import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from "@angular/http";
import * as $ from 'jquery';
import { HeatMap, CSS } from "../models/data-common";
import { DataCommon, HeatMapItem, PointMap, PointMapItem, CheckItem } from "../models/data-common";
import { DataGridComponent } from "../data-grid/data-grid";
@Component({
    selector: "[point-map]",
    templateUrl: "./plotting-template.html",
    styleUrls: ["./plotting-styles.css"]
})
export class PlottingComponent {
    IconGroup = "<i class=\"fa fa-indent\" aria-hidden=\"true\"></i>";

    @Output("initControl") initControl: EventEmitter<any> = new EventEmitter();
    @Output("selectItem") selectItem: EventEmitter<any> = new EventEmitter();
    datasource: Array<Object>;
    meta: PointMap;

    currentDS: any[];
    selectedGroupableFields: CheckItem[] = [];
    selectedGroupableFieldsRange: CheckItem[] = [];

    regions: number[][] = [];
    regionsPos: any[] = [];
    regionMain: number[] = null;

    isLoading: boolean = false;

    datagridControl: DataGridComponent;

    HeatMapWidth: number = 400;
    HeatMapHeight: number = 400;

    xdash: string = "";
    ydash: string = "";

    RightTab: string = "";


    public constructor() {
        this.currentDS = this.datasource;
        setTimeout(() => {
            this.initControl.emit(this);
        }, 500);
    }

    public loadData(ds, meta) {
        this.datasource = ds;
        this.meta = meta;
        this.refresh();
        setTimeout(() => {
            this.updateGroupData();
            this.updateSelectedGroupableFieldsRange();
        }, 1000);
    }

    initDataGridControl(control: any) {
        this.datagridControl = control;
    }

    public refresh() {
        if (this.meta && this.currentDS){
            if (this.datagridControl) this.datagridControl.createMeta();
            if (this.currentDS == null) this.currentDS = this.datasource;
            this.createHeatMap(this.meta, this.currentDS);
        } else {
            setTimeout(()=>{
                this.refresh();
            }, 500);
        }
        
    }

    public createHeatMap(meta: PointMap, dataset: any) {
        var maxValue = DataCommon.lookupValue(dataset,
            (item: any) => {
                if (item)
                    return parseInt(item[meta.ValueFieldName]);
                return 0;
            },
            (a: number, b: number) => { return a > b; });
        var minValue = DataCommon.lookupValue(dataset,
            (item: any) => {
                if (item)
                    return parseInt(item[meta.ValueFieldName]);
                return 1000000;
            },
            (a: number, b: number) => { return a < b; });


        var maxX = DataCommon.lookupValue(dataset,
            (item: any) => { 
                return item[meta.XFieldName];                 
            },
            (a: number, b: number) => { return a > b; });
        var minX = DataCommon.lookupValue(dataset,
            (item: any) => { return item[meta.XFieldName]; },
            (a: number, b: number) => { return a < b; });
        var maxY = DataCommon.lookupValue(dataset,
            (item: any) => { return item[meta.YFieldName]; },
            (a: number, b: number) => { return a > b; });
        var minY = DataCommon.lookupValue(dataset,
            (item: any) => { return item[meta.YFieldName]; },
            (a: number, b: number) => { return a < b; });
        if (minX + "" == "") minX = 0;
        if (maxX + "" == "") maxX = 1;
        if (minY + "" == "") minY = 0;
        if (maxY + "" == "") maxY = 1;
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
        for (let item of dataset) {
            if (item) {
                var name = item[meta.DetailFieldName];
                var x = item[meta.XFieldName];
                var xPos = this.percentageX(x);
                var y = item[meta.YFieldName];
                var yPos = this.percentageY(y);
                var v: number = (parseInt(item[meta.ValueFieldName]) - minValue) * 100 / (maxValue - minValue);

                var r = Math.floor(Math.random() * 1000)
                //console.log("Rand",r);
                var color: string = CSS.COLORS[r % CSS.COLORS.length];
                // console.log("Value",minValue,"-",maxValue," ", parseInt(item[meta.ValueFieldName]));

                var itemDisplay: PointMapItem = {
                    Name: name,
                    X: x,
                    Y: y,
                    XPercentage: xPos,
                    YPercentage: yPos,
                    Data: item,
                    Value: v,
                    Color: color
                }
                meta.Items.push(itemDisplay);
            }
        }

        this.regions = [];
        this.regionsPos = [];

        var H = 600;
        var W = $(".pointmap .content").width();
        var w = maxX - minX;
        var h = maxY - minY;
        var xdp = meta.XMin;
        var ydp = meta.YMin;
        var xdashesEx: number[] = [];
        for (let xp of this.meta.XDashes) xdashesEx.push(xp);
        xdashesEx.push(maxX);
        var ydashesEx: number[] = [];
        for (let yp of this.meta.YDashes) ydashesEx.push(yp);
        ydashesEx.push(maxY);
        for (let yd of ydashesEx) {
            var xdp = meta.XMin;
            for (let xd of xdashesEx) {
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

        //console.log("createHeatMap", minX, maxX, minY, maxY, this.regions, this.regionsPos, meta);
    }

    public cellWidth(cell: HeatMapItem): string {
        var r = Math.round(Math.abs(cell.X.From - cell.X.To) * this.HeatMapWidth);
        // console.log("cellWidth", r);
        return r + "px";
    }
    public cellHeight(cell: HeatMapItem): string {
        var r = Math.round(Math.abs(cell.Y.From - cell.Y.To) * this.HeatMapHeight);
        // console.log("cellHeight", r);
        return r + "px";
    }
    public cellLeft(cell: HeatMapItem): string {
        var r = Math.round(cell.X.From * this.HeatMapWidth);
        // console.log("cellLeft", r);
        return r + "px";
    }
    public cellTop(cell: HeatMapItem): string {
        var h = Math.round(Math.abs(cell.Y.From - cell.Y.To) * this.HeatMapHeight);
        var r = this.HeatMapHeight - Math.round(cell.Y.From * this.HeatMapHeight) - h;
        // console.log("cellTop", r);
        return r + "px";
    }


    public onDetailChanged(item: any) {
        console.log("onDetailChanged", item);
        this.meta.DetailFieldName = item;
        this.refresh();
    }

    public onDisplayChanged(items: any) {
        console.log("onDisplayChanged", items);
    }

    public updateSelectedGroupableFieldsRange() {
        this.selectedGroupableFieldsRange = [];
        if (this.selectedGroupableFields.length > 0) {
            var lastField = this.selectedGroupableFields[this.selectedGroupableFields.length - 1];
            for (let f of this.meta.GroupableFields) {
                this.selectedGroupableFieldsRange.push(f);
                if (lastField.Name == f.Name) {
                    break;
                }
            }

        }
        console.log("selectedGroupableFieldsRange", this.selectedGroupableFieldsRange);
    }

    public removeGroup(group: CheckItem) {
        this.isLoading = true;
        setTimeout(() => {
            var current = this.selectedGroupableFields[this.selectedGroupableFields.length - 1];
            if (current.Value == "") {
                this.selectedGroupableFields.splice(this.selectedGroupableFields.length - 1, 1);
                if (this.selectedGroupableFields.length > 0) {
                    current = this.selectedGroupableFields[this.selectedGroupableFields.length - 1];
                    current.Value = "";
                }
                this.updateGroupData();
            } else {
                current.Value = "";
                this.updateGroupData();
            }
            this.updateSelectedGroupableFieldsRange();
            this.isLoading = false;
        }, 50);
    }

    private updateGroupData() {
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
                var valueFieldName = this.meta.ValueFieldName;
                group.DataSet = DataCommon.groupBy(parentDS, (e: any) => { return e[group.Name]; }, (item: any, e: any) => {
                    var total = item.Total;
                    if (total == null) total = 0;
                    total += parseFloat(e[valueFieldName]);
                    item.Total = total;
                });
                for (let it of group.DataSet) {
                    it.Avg = Math.floor(it.Total / it.Items.length);
                }
                var max = DataCommon.lookupValue(group.DataSet,
                    (item: any) => { return item.Avg; },
                    (a: number, b: number) => { return a > b; });
                for (let it of group.DataSet) {
                    it.Percentage = (it.Avg / max) * 100;
                }
            }
        } else {
            parentDS = this.datasource;
        }

        this.currentDS = parentDS;
        this.refresh();
    }
    public onSelectLastGroup(itGroup: any) {
        this.isLoading = true;
        setTimeout(() => {
            var current = this.selectedGroupableFields[this.selectedGroupableFields.length - 1];
            current.Value = itGroup;
            this.updateGroupData();
            // this.refresh();
            console.log("selectedGroupableFields", this.selectedGroupableFields);
            this.isLoading = false;
        }, 50);
    }
    public onGroupChanged(group: CheckItem, itGroup: any) {
        console.log("onGroupChanged", group);
        this.isLoading = true;
        setTimeout(() => {
            if (this.selectedGroupableFields.length > 0 && itGroup != null) {
                this.selectedGroupableFields[this.selectedGroupableFields.length - 1].Value = itGroup;
            }
            this.selectedGroupableFields.push(group);
            this.updateGroupData();
            this.updateSelectedGroupableFieldsRange();
            // console.log("selectedGroupableFields", this.selectedGroupableFields);
            this.isLoading = false;
        }, 50);

    }

    public group(source: any[], f: CheckItem) {
        if (f.Checked) {
            var ds = DataCommon.groupBy(this.currentDS, (e: any) => {
                return e[f.Name];
            }, null);
        }
    }

    public onValueChanged(item: any) {
        console.log("onValueChanged", item);
        this.meta.ValueFieldName = item;
        this.refresh();
    }
    public onXAxisChanged(item: any) {
        console.log("onXAxisChanged", item);
        this.meta.XFieldName = item;
        this.meta.XDesc = item;
        this.refresh();
    }
    public onYAxisChanged(item: any) {
        console.log("onYAxisChanged", item);
        this.meta.YFieldName = item;
        this.meta.YDesc = item;
        this.refresh();
    }

    public addXDash() {
        var v = parseFloat(this.xdash);
        if (this.meta.XDashes.indexOf(v) < 0)
            this.meta.XDashes.push(v);
        this.xdash = "";
    }
    public removeXDash(v: number) {
        var i = this.meta.XDashes.indexOf(v);
        if (i >= 0) {
            this.meta.XDashes.splice(i, 1);
        }
    }
    public addYDash() {
        var v = parseFloat(this.ydash);
        if (this.meta.YDashes.indexOf(v) < 0)
            this.meta.YDashes.push(v);
        this.ydash = "";
    }
    public removeYDash(v: number) {
        var i = this.meta.YDashes.indexOf(v);
        if (i >= 0) {
            this.meta.YDashes.splice(i, 1);
        }
    }
    public percentageX(xd: number): number {
        var delX = this.meta.XMax - this.meta.XMin;
        var value = (xd - this.meta.XMin) / delX * 100;
        return value;
    }
    public percentageY(yd: number): number {
        var delY = this.meta.YMax - this.meta.YMin;
        var value = (yd - this.meta.YMin) / delY * 100;
        //console.log("percentageY",value);
        return value;
    }

    mouseDragging: boolean = false;
    mouseRect: number[] = [-1, -1, 0, 0];
    public mouseFilterStart() {
        this.mouseDragging = !this.mouseDragging;
        this.mouseRect = [-1, -1, 0, 0];
        for (let r of this.regionsPos)
            r.Active = false;
    }
    public mouseFilterDown(event: any) {
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
            } else {
                var w = event.x - x;
                var h = event.y - y;
                this.mouseRect = [x, y, w, h];
            }
            // console.log("mouseFilterDown", this.mouseRect);
        }
    }
    private rectContains(rect1: number[], x: number, y: number): boolean {
        return rect1[0] <= x && x <= rect1[0] + rect1[2]
            && rect1[1] <= y && y <= rect1[1] + rect1[3];
    }
    private rectIntersect(r1: number[], r2: number[]): boolean {
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

    }
    public mouseFilterMove(event: any) {
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
            for (let r of this.regionsPos) {
                r.Active = this.rectIntersect(r.Pos, this.mouseRect);
                // if (this.rectIntersect(r, this.mouseRect)){
                //     r.Active = true;
                // }
            }
            // console.log("mouseFilterMove", this.mouseRect);
        }
    }
    public mouseFilterUp() {
        var W = 1400;//$(".pointmap .content").width();
        var H = 600;//$(".pointmap .content").height();

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
    }

    public filterData(from1: number, to1: number, from2: number, to2: number) {
        var newDS = [];
        var rx1 = this.meta.XMax, rx2 = this.meta.XMin, ry1 = this.meta.YMax, ry2 = this.meta.YMin;
        for (let r of this.regionsPos) {
            if (r.Active) {
                var values = r.Value;
                if (values[0] < rx1) rx1 = values[0];
                if (values[0] + values[2] > rx2) rx2 = values[0] + values[2];
                if (values[1] < ry1) ry1 = values[1];
                if (values[1] + values[3] > ry2) ry2 = values[1] + values[3];
            }
        }
        this.regionMain = [rx1, ry1, rx2, ry2];
        console.log("regions", this.regionsPos, this.regionMain);
        for (let r of this.regionsPos) {
            if (r.Active) {
                var values = r.Value;
                var xr1 = values[0];
                var yr1 = values[1];
                var xr2 = xr1 + values[2];
                var yr2 = yr1 + values[3];
                for (let item of this.currentDS) {
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
    }

    removeCurrentRegion() {
        this.regionMain = null;
        this.currentDS = this.datasource;
        this.refresh();
    }


    public selectItemLocal(cell: PointMapItem) {
        this.selectItem.emit(cell.Data);
        console.log(cell);
    }
}