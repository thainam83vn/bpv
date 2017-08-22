import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Http, Headers} from "@angular/http";
import * as $ from 'jquery';
import { TreeMapItem, HeatMap, DataCommon, HeatMapItem, PointMap, CSS, Diagram, KPIMetric, ConfigurableShape, Table, DiagramDetail } from "./../models/data-common";

@Component({
    selector: '[tree-diagram]',
    templateUrl: './tree-diagram.html',
    styleUrls:['./tree-diagram.css']
})
export class TreeDiagramComponent{
    @Output() addClick: EventEmitter<any> = new EventEmitter();
    @Output() removeClick: EventEmitter<any> = new EventEmitter();
    
    @Input() Root: Diagram;
    public constructor(){
    }

    public addChild(d){
        if (this.addClick) 
            this.addClick.emit(d);
    }
    public removeChild(d){
        if (this.removeClick) 
            this.removeClick.emit(d);
    }


}