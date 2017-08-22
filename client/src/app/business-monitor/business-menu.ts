import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Http, Headers} from "@angular/http";
import * as $ from 'jquery';
import { Diagram } from "app/models/data-common";

@Component({
    selector: '[business-menu]',
    templateUrl: './business-menu.html'
})
export class BusinessMenuComponent{
    @Input() Root: Diagram;
    @Output() menuClick:EventEmitter<any> = new EventEmitter();

    hover: boolean = false;

    public constructor(){
        
    }

    public menuClickLocal(item){
        console.log("menuClickLocal:", item);
        if (this.menuClick)
            this.menuClick.emit(item);
    }
}