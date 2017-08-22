import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Http, Headers} from "@angular/http";
import * as $ from 'jquery';
import { DiagramService } from "app/services/diagram.service";
import { MetricSettingComponent } from "app/business-monitor/metric-setting";
import { TreeDiagramComponent } from "app/admin-diagram/tree-diagram";

@Component({
    selector: 'tg-button',
    templateUrl: './index.html',
    styleUrls:["./style.css"]
})
export class TgButton{
    @Output() initControl: EventEmitter<any> = new EventEmitter();
    @Output() onClick: EventEmitter<any> = new EventEmitter();

    @Input() title: string = "";

    busy: boolean = false;
    public constructor(){
        setTimeout(()=>{
            if (this.initControl) this.initControl.emit(this);
        }, 100);
    }

    raiseClick(){
        setTimeout(()=>{
            this.onClick.emit({source: this, done: ()=>{
                this.busy = false;
            }});
        }, 50);
    }

    onClickLocal(){
        console.log("onClickLocal");
        if (!this.busy){
            this.busy = true;
            this.raiseClick();
        }
    }
}