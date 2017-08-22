import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Http, Headers} from "@angular/http";
import * as $ from 'jquery';
import { HeatMap,CSS } from "../models/data-common";
import { DataCommon, HeatMapItem, PointMap, PointMapItem, DataTable } from "../models/data-common";
import { DataTableResource } from "angular-2-data-table/dist";

@Component({
  selector: "[tg-data-table]",
    templateUrl:"./index.html",
  styleUrls:["./style.css"]
})
export class DataTableComponent {
    @Output("initControl") initControl: EventEmitter<any> = new EventEmitter();
    datasource: any;
    itemResource: DataTableResource<any>;
    items: any[] = [];
    itemCount = 0;

    fields: string[] = [];

    public constructor(){
        console.log("DataTableComponent");
        setTimeout(()=>{
            
            this.initControl.emit(this);
        }, 500);
    }

    public setData(data){
        this.datasource = data;
        this.itemResource = new DataTableResource(this.datasource);
        this.itemCount = this.datasource.length;

        this.fields = [];
        for(var k in this.datasource[0]){
            if (k.indexOf("Prod")!=0)
                this.fields.push(k);
        }
    }

    reloadItems(params) {
        console.log("reloadItems:", params);
        this.itemResource.query(params).then(items => this.items = items);
    }

    // special properties:

    rowClick(rowEvent) {
        console.log('Clicked: ' + rowEvent.row.item.name);
    }

    rowDoubleClick(rowEvent) {
        alert('Double clicked: ' + rowEvent.row.item.name);
    }

    rowTooltip(item) { return item.jobTitle; }

}