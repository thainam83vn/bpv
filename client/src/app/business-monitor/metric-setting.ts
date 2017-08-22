import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Http, Headers} from "@angular/http";
import * as $ from 'jquery';
import { Diagram, ConfigurableShape, KPIMetric, Table, Metric, Column } from "app/models/data-common";
import { DiagramService } from "app/services/diagram.service";

@Component({
    selector: '[metric-setting]',
    templateUrl: './metric-setting.html',
    styleUrls:['./metric-setting.css']
})
export class MetricSettingComponent{
    @Output() initControl: EventEmitter<any> = new EventEmitter();
    @Output() onApply: EventEmitter<any> =new EventEmitter();
    @Output() onTableChanged: EventEmitter<any> =new EventEmitter();
    @Output() onIsShowData: EventEmitter<any> =new EventEmitter();
    @Output() onMetricChanged: EventEmitter<any> =new EventEmitter();
    

    @Input() isShowData: boolean = false;

    tables: Table[];
    operators: string[] = ['None','+','-','*','/'];
    aggregates: string[] = ["sum","avg"];
    table: Table = null;
    column1: Column = null;
    column2: Column = null;
    metric: Metric;

    exceptFields: string[] = [];


    shape: KPIMetric;
    public constructor(private diagramService: DiagramService){
        setTimeout(()=>{
            this.initControl.emit(this);
        }, 100);
        this.diagramService.getAllTable().subscribe(
        (data)=>{
            this.tables = data;
            console.log("getAllTable: ", data);            
        }, (error)=>{
            console.log("Error: ", error);
        });

        for(var i = 0; i < 100;i++){
            this.exceptFields.push("Prod" + i);
        }
    }    

    public loadMetricData(){
        this.diagramService.getMetricByShapeId(this.shape.Id).subscribe(
            (data)=>{
                this.metric = data[0];
                this.onMetricChanged.emit(this.metric);
                if (this.metric){
                    console.log("metric:", this.metric);                
                    for(let t of this.tables){
                        if (t.Table_Name == this.metric.Table){
                            this.table = t;
                            this.diagramService.getColumnsByTable(this.table.Table_Name).subscribe(
                            (cols: Column[])=>{
                                this.table.Columns = cols;
                                for(let c of cols){
                                    if (c.Column_Name.toLocaleLowerCase() == this.metric.Column1.toLocaleLowerCase()){
                                        this.column1 = c;
                                    }
                                    if (c.Column_Name.toLocaleLowerCase() == this.metric.Column2.toLocaleLowerCase()){
                                        this.column2 = c;
                                    }
                                }
                            }, (errCol)=>{
                                console.log("Error: ", errCol);
                            }
                            );
                            break;
                        }
                    }
                } else {
                    this.metric = {Table : null, Column1 : null, Operator : null, 
                        Column2: null, Aggregation :null ,Id:null, ShapeId: this.shape.Id};
                        this.table = null;
                        this.column1 = null;
                        this.column2 = null;
                }
                console.log("Metric: ", this.metric);
            }, (error)=>{
                console.log("Error: ", error);
            }
            );
    }

    public showMetric(shape: KPIMetric){
        console.log("Show metric setting: ", shape);
        this.shape = shape;
        if (this.shape.Id){
            this.loadMetricData();
        } else {
            this.diagramService.createShape(shape.DiagramId, shape.ShapeId).subscribe((data)=>{
                console.log("CreateShape: ", data);
                this.shape = data;
                this.loadMetricData();
            }, (err)=>{
                console.log("Error CreateShape:", err);
            });
        }
    }

    public tableChanged(table:Table){
        this.table = table;
        this.onTableChanged.emit(this.table);
        this.metric.Table = table.Table_Name;
        this.diagramService.getColumnsByTable(this.table.Table_Name).subscribe(
        (data)=>{
            this.table.Columns = data;
        }, (error)=>{
            console.log("Error:", error);
        }
        );
    }

    public onColumn1Change(col:Column){
        this.column1 = col;
        this.metric.Column1 = col.Column_Name;
    }
    public onColumn2Change(col:Column){
        this.column2 = col;
        this.metric.Column2 = col.Column_Name;
    }

    public close(){
        this.metric = null;
    }

    public apply(){
        if (this.metric){
            this.diagramService.createMetric(this.metric).subscribe(
            (res)=>{
                this.metric = null;
                if (this.onApply) this.onApply.emit(this.metric);
            }, (error)=>{
                console.log("Error:", error);
            }
            );
        }
    }

    isShowDataChanged($event){
        this.isShowData = $event.target.checked;
        this.onIsShowData.emit(this.isShowData);
        console.log("isShowDataChanged:", this.isShowData);
        
    }

}