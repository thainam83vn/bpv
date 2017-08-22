import { Component, Input } from '@angular/core';
import {Http, Headers} from "@angular/http";
import * as $ from 'jquery';
@Component({
  selector: "[treemap]",
  templateUrl:"./tree-map-template.html",
  styleUrls:["./tree-map-style.css"]
})
export class TreeMap {
  @Input('data') items: Array<Object>;
  @Input('display') display: string;
  @Input('key') key: string;
  @Input('percent') percent: string;
  @Input('orgPercent') orgPercent: string;
  @Input('vertical') vertical: string;
}