import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Http, Headers} from "@angular/http";
import * as $ from 'jquery';
import { TreeMapItem, HeatMap, DataCommon, HeatMapItem, PointMap, CSS, Diagram, KPIMetric, ConfigurableShape, Table, DiagramDetail } from "./../models/data-common";
import { DiagramService } from "app/services/diagram.service";
import { MetricSettingComponent } from "app/business-monitor/metric-setting";
import { TreeDiagramComponent } from "app/admin-diagram/tree-diagram";

@Component({
    selector: 'admin-diagram',
    templateUrl: './admin-diagram.html',
    styleUrls:["./admin-diagram.css"]
})
export class AdminDiagramCtr{
    @Output() initControl: EventEmitter<any> = new EventEmitter();
    @Output() onDiagramChanged: EventEmitter<any> = new EventEmitter();
    root: Diagram;
    parent: Diagram;    
    diagram: Diagram;
    ctrTreeDiagram: TreeDiagramComponent;
    file: any;

    public constructor(private diagramService: DiagramService){
        setTimeout(()=>{
            console.log("BusinessMonitorCtr");
            if (this.initControl) this.initControl.emit(this);
        }, 100);
        
        this.load();
     
    }

    public load(){
        this.diagramService.getAll().subscribe((data: Diagram[])=>{
            this.root = {Id : 0, Content: '', Name: '/', Children: data};
        }, (error)=>{
            console.log("Error: ", error);
        });   
    }

    addChild(d){
        this.parent = d;
        this.diagram = {Id: null, Name: "", Children: [], Content: null};
    }

    save($event){
        console.log("save diagram");

        if (this.diagram.Name != "" && this.file != null){
        this.diagramService.addDiagram(this.parent.Id, this.diagram, this.file).subscribe(
            (res)=>{
                this.load();
                this.diagram = null;
                $event.done();            
                this.onDiagramChanged.emit(this);
            }, (error)=>{
                console.log("Error add diagram:", error);
                $event.done();            
            }
        );
        } else {
            $event.done();
        }
    }

    removeDiagram(d){
        console.log("remove diagram");
        
        if (window.confirm("Do you want to delete this diagram?")){
            this.diagramService.deleteDiagram(d.Id).subscribe(
            (res)=>{
                this.load();
                this.onDiagramChanged.emit(this);                
            },(error)=>{
                console.log("Error delete diagram:", error);
            }
            );
        }
    }

    initTreeDiagram(c){
        this.ctrTreeDiagram = c;
    }

    fileChange(event) {
        let fileList: FileList = event.target.files;
        if(fileList.length > 0) {
            this.file = fileList[0];
        }
    }
}