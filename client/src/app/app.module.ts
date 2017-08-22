import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from "@angular/http";
import {DataTableModule} from "angular-2-data-table";

import { AppComponent } from './app.component';
import { PredictiveAnalysisCtr } from "./predictive-analysis/predictive-analysis-ctr";
import { DropDownComponent } from "./com-dropdown/com-dropdown";
import { TreeMap } from "./com-treemap/tree-map-control";
import { DropDownButtonComponent } from "./com-dropdown-button/com-dropdown-button";
import { HeatMapComponent } from "./heat-map/heat-map-component";
import { PlottingComponent } from "./plotting/plotting";
import { DataGridComponent } from "./data-grid/data-grid";
import { BusinessMonitorCtr } from "app/business-monitor/business-monitor";
import { DiagramService } from "app/services/diagram.service";
import { BusinessMenuComponent } from "app/business-monitor/business-menu";
import { MetricSettingComponent } from "app/business-monitor/metric-setting";
import { DiagramMenuComponent } from "app/business-monitor/diagram-menu";
import { AdminDiagramCtr } from "app/admin-diagram/admin-diagram";
import { TreeDiagramComponent } from "app/admin-diagram/tree-diagram";
import { AdminDataCtr } from "app/admin-data/admin-data";
import { TgButton } from "app/_directives/button/code";
import { DataTableComponent } from "app/data-table/component";

@NgModule({
  imports:      [ BrowserModule, HttpModule, DataTableModule  ],
  declarations: [ 
      AppComponent, 
      PredictiveAnalysisCtr, 
      AdminDiagramCtr,
      BusinessMonitorCtr,
      DropDownComponent,
      DropDownButtonComponent, 
      TreeMap,
      HeatMapComponent,
      PlottingComponent,
      DataGridComponent,
      BusinessMenuComponent,
      DiagramMenuComponent,
      MetricSettingComponent,
      TreeDiagramComponent,
      AdminDataCtr,
      DataTableComponent,

      TgButton
      ],
  providers:[
    DiagramService
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
