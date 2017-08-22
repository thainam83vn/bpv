import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Http, Headers} from "@angular/http";
import * as $ from 'jquery';
import { TreeMapItem, HeatMap, DataCommon, HeatMapItem, PointMap, CSS, Diagram, KPIMetric, ConfigurableShape, Table } from "./../models/data-common";
import { DiagramService } from "app/services/diagram.service";
import { MetricSettingComponent } from "app/business-monitor/metric-setting";
import { AdminDiagramCtr } from "app/admin-diagram/admin-diagram";
import { DataTableComponent } from "app/data-table/component";

@Component({
    selector: 'business-monitor',
    templateUrl: './business-monitor.html',
    styleUrls:["./business-monitor.css"]
})
export class BusinessMonitorCtr{
    @Output() initControl: EventEmitter<any> = new EventEmitter();
    @Output() onDiagramChanged: EventEmitter<any> = new EventEmitter();

    ctrMetricSetting: MetricSettingComponent;
    ctrAdminDiagram: AdminDiagramCtr;
    ctrDataTable: DataTableComponent;

    ShowMode:string = "AdminDiagram";

    isShowData: boolean = true;

    diagrams: Diagram[];
    diagram: Diagram;
    kpimetrics: KPIMetric[];
    shapes: ConfigurableShape[];

    currentDS:any;

    viewdiagramHover: boolean = false;    

    public constructor(private diagramService: DiagramService){
        setTimeout(()=>{
            console.log("BusinessMonitorCtr");
            if (this.initControl) this.initControl.emit(this);
        }, 100);
        

        this.diagramService.getAll().subscribe((data: Diagram[])=>{
            this.diagrams = data;
            console.log("All diagrams: ", data);
        }, (error)=>{
            console.log("Error: ", error);
        });

        
    }

    public diagramClick(d){
        this.showDiagram(d);
    }

    public initMetricSetting(c){
        this.ctrMetricSetting = c;
    }

    public initAdminDiagram(c){
        console.log("initAdminDiagram:", c);
        this.ctrAdminDiagram = c;
    }

    private loadKPIMetric(){
        var svg = $("svg");
        for(let ele of this.kpimetrics){
            var shape = svg.find("g[id^='" + ele.ShapeId.toLowerCase() + "']");
			if(ele.Result || ele.Result == 0)
				shape.children("text").text(Math.round(parseFloat(ele.Result + "") * 100) / 100);
			else
				shape.children("text").text("xXx");
            
			
			//if(ele.clickEventType === "DRILD"){
				// shape.attr("class", "svgShape task");
				// shape.attr("data-id", ele.shapeId);
				// shape.on("click", "console.log('shap_click')");
				// shape.attr("clickAddress", ele.diagramId);
        }
    }

    public showDiagram(d){
        this.ShowMode = "Diagram";
        this.diagram = d;
        setTimeout(()=>{
            $("#content").html(d.Content);
            $("#content g > text").on("click", (e)=>{
                var parent = $(e.target).parent()[0];
                console.log("click:", e.target);
                console.log("click:", parent.id, parent);
                var kpi = null;
                for(let kpi of this.kpimetrics){
                    if (kpi.ShapeId == parent.id){
                        this.showMetric(kpi);
                        return;
                    }
                }
                var newkpi: KPIMetric = {
                    ClickAddress: null,
                    ClickEventType: null,
                    DiagramId: this.diagram.Id,
                    ShapeId: parent.id,
                    Result: null,
                    Id: null
                };
                this.showMetric(newkpi);
            });
            console.log("showDiagram",d);
            this.loadDiagram();
        }, 100);
    }

    public showMetric(ele){
        this.ctrMetricSetting.showMetric(ele);
    }

    public showAdminDiagram(){
        this.ShowMode = "AdminDiagram";
    }

    public showAdminData(){
        this.ShowMode = "AdminData";
    }    

    public loadDiagram(){
        console.log("loadDiagram", this.diagram.Name);
        // if (this.diagram.Name.indexOf('Lead To Agreement')>=0){//Lead To Agreement
        this.diagramService.getKPIMetricByDiagramId(this.diagram.Id).subscribe(
            (data)=>{
                this.kpimetrics = data;
                console.log("all metrics:", this.kpimetrics);
                this.loadKPIMetric();
            }, (error)=>{
                console.log("Error:", error);
            }
        );

        // this.diagramService.getConfigurableShapeByDiagramId(this.diagram.Id).subscribe(
        // (data)=>{
        //     this.shapes = data;
        // }, (error)=>{
        //     console.log("Error:", error);
        // }
        // );
        // }
    }

    public metricSettingChange(metric){
        this.loadDiagram();
    }

    diagramChanged($event){
        console.log("diagramChanged");
        this.onDiagramChanged.emit(this);
    }

    tableChanged($event){
        console.log("tableChanged", $event);
        this.loadDataTable($event.Table_Name);
    }

    loadDataTable(tableName: string){
        this.diagramService.selectAllFromTable(tableName).subscribe(
            (dataset)=>{
                this.ctrDataTable.setData(dataset);
                // this.diagramService.getColumnsByTable(tableName).subscribe(
                // (dataColumns)=>{
                //     var columns = [];
                //     var displays = [];
                //     for(let c of dataColumns){
                //         columns.push(c.Column_Name);
                //         if (c.Column_Name.indexOf("Prod")!=0){
                //             displays.push(c.Column_Name);
                //         }
                //     }                
                //     this.currentDS = {
                //         TableName: tableName,
                //         DataSet: dataset,
                //         Fields: columns,
                //         DisplayFields: displays
                //     };                    
                // }, (error)=>{
                //     console.log("Error:", error);
                // }
                // );
                
            }, (err)=>{
                console.log("selectAllFromTable", err);
            }
        );
    }

    metricChanged(metric){
        console.log("metricChanged", metric);
        if (metric){
            if (this.currentDS==null||this.currentDS.TableName!=metric.Table){
                this.loadDataTable(metric.Table);
            }
        } else {
            this.currentDS = null;
        }
    }

    initDataTable(c){
        console.log("initDataTable:",c);
        this.ctrDataTable = c;
    }
}