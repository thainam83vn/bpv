import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Http, Headers} from "@angular/http";
import * as $ from 'jquery';
import { HeatMap,CSS } from "../models/data-common";
import { DataCommon, HeatMapItem, PointMap, PointMapItem, DataTable } from "../models/data-common";

@Component({
  selector: "[data-grid]",
    templateUrl:"./data-grid.html",
  styleUrls:["./data-grid.css"]
})
export class DataGridComponent {
    @Output("initControl") initControl: EventEmitter<any> = new EventEmitter();
    @Input("datasource") datasource: any[];
    @Input("displays") displays:string[];
    @Input("fields") fields:string[];
    

    meta: DataTable;
    currentItem: any = {Id:''};

    public constructor(){
        setTimeout(()=>{
            this.initControl.emit(this);
            // console.log("data", this.datasource);
            this.createMeta();
        }, 500);
        
    }

    getDisplayFields(){
        // var cols = [];
        // for(let c of this.meta.Columns){
        //     if (this.displays.indexOf(c)>=0){
        //         cols.push(c);
        //     }
        // }
        // return cols;

        return this.displays;
    }

    createMeta(){
        if (this.datasource != null){
            var columns = [];
            for(var key in this.datasource[0]) {
                columns.push(key);
            }
            this.meta = {Columns: columns, Rows: this.datasource};
            setTimeout(()=>{
                //$('#datatable').DataTable();
            }, 200);
        }
    }

    public refresh(){

    }

    public selectRow(row: any){
        this.currentItem = row;
        var top = $("#" + row['Id']).offset().top;
        var currentScroll = $("#datatable").parent().scrollTop();
        var newScroll = currentScroll + top - 120;
        if (newScroll < 0 ) newScroll = 0;
        console.log("scroll ",row['Id']," to ", currentScroll, top, newScroll);
        $("#datatable").parent().scrollTop(newScroll);

    }

    public onDisplayChanged(items: any) {
        console.log("onDisplayChanged", items);
    }
}