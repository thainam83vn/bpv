import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Http, Headers} from "@angular/http";
import * as $ from 'jquery';
import { TreeMapItem, HeatMap, DataCommon, HeatMapItem, PointMap, CSS, Diagram, KPIMetric, ConfigurableShape, Table, DiagramDetail } from "./../models/data-common";
import { DiagramService } from "app/services/diagram.service";
import { MetricSettingComponent } from "app/business-monitor/metric-setting";
import { TreeDiagramComponent } from "app/admin-diagram/tree-diagram";

@Component({
    selector: 'admin-data',
    templateUrl: './admin-data.html',
    styleUrls:["./admin-data.css"]
})
export class AdminDataCtr{
    @Output() initControl: EventEmitter<any> = new EventEmitter();

    tableNames: string[];
    tableName: string = "";
    file: any;

    public constructor(private diagramService: DiagramService){
        setTimeout(()=>{
            if (this.initControl) this.initControl.emit(this);
        }, 100);
        
        this.load();
     
    }

    public load(){
        this.diagramService.getAllTable().subscribe(
        (data)=>{
            this.tableNames = data;
        }, (err)=>{
            console.log("Error getAllTable", err);
        }
        );
    }

    save($event){
        if (this.tableName != '' && this.file != null){
            this.diagramService.uploadFileCSV(this.tableName, this.file).subscribe(
            (res)=>{
                this.tableName = "";
                this.file = null;
                $("#fileUpload").val('');

                this.load();
                $event.done();
            }, (error)=>{
                $event.done();                
                console.log("Error uploadFileCSV:", error);
                alert("Error upload table: table " + this.tableName + " is already existed.");
            }
            );
        } else {
            $event.done();
        }
    }

    removeTable(d){
        if (window.confirm("Do you want to delete this table?")){
            this.diagramService.deleteTable(d.Table_Name).subscribe(
            (res)=>{
                this.load();
            },(error)=>{
                console.log("Error delete table:", error);                
            }
            );
        }
    }

    fileChange(event) {
        let fileList: FileList = event.target.files;
        if(fileList.length > 0) {
            this.file = fileList[0];
        }
    }

}