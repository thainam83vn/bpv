import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Http, Headers} from "@angular/http";
import * as $ from 'jquery';
import { HeatMap } from "../models/data-common";
import { DataCommon, HeatMapItem } from "../models/data-common";
@Component({
  selector: "[heatmap]",
  templateUrl:"./heat-map-template.html",
  styleUrls:["./heat-map-styles.css"]
})
export class HeatMapComponent {
    @Output("initControl") initControl: EventEmitter<any> = new EventEmitter();
    @Output("cellClicked") cellClicked: EventEmitter<any> = new EventEmitter();
    @Input("datasource") datasource: Array<Object>;
    @Input("heatmap") heatmap: HeatMap;

    HeatMapWidth: number = 400;
    HeatMapHeight:  number = 400;

    public constructor(){
        setTimeout(()=>{
            this.initControl.emit(this);
        }, 500);
        
    }

    public refresh(){
        this.createHeatMap(this.heatmap, this.datasource);
    }

    public createHeatMap(meta: HeatMap, dataset: any[]){
        for(var i = 0; i < meta.Items.length; i++){
            var cell = meta.Items[i];
            var ls = DataCommon.where(dataset, (e1: any)=>{
                return e1[meta.XFieldName] >= cell.X.From && e1[meta.XFieldName] < cell.X.To
                    && e1[meta.YFieldName] >= cell.Y.From && e1[meta.YFieldName] < cell.Y.To;
            });
            cell.Result = ls;
        }
    }

    public cellClickedLocal(cell: HeatMapItem):any{
        this.cellClicked.emit(cell);
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
    

    public onDetailChanged(item: any){
        console.log("onDetailChanged", item);
        this.refresh();
    }
    public onXAxisChanged(item: any){
        console.log("onXAxisChanged", item);
        this.heatmap.XFieldName = item;
        this.heatmap.XDesc = item;
        this.refresh();
    }
    public onYAxisChanged(item: any){
        console.log("onYAxisChanged", item);
        this.heatmap.YFieldName = item;
        this.heatmap.YDesc = item;
        this.refresh();
    }
}