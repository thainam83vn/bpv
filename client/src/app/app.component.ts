import { Component } from '@angular/core';
import * as $ from 'jquery';
import { DiagramService } from "app/services/diagram.service";
import { Diagram } from "app/models/data-common";
import { PredictiveAnalysisCtr } from "app/predictive-analysis/predictive-analysis-ctr";
import { BusinessMonitorCtr } from "app/business-monitor/business-monitor";
import { AdminDiagramCtr } from "app/admin-diagram/admin-diagram";

@Component({
  selector: 'my-app',
  templateUrl:"../layout.html",
  styleUrls:["../layout_content/site.css", "../layout_content/leftConfigMenu.css", "../layout_content/topNavMenu.css"]
  
})
export class AppComponent  { 
  ctrPredictive: PredictiveAnalysisCtr;
  ctrBusiness: BusinessMonitorCtr;
  
  name = 'Angular'; 
  diagrams: Diagram[] = [];
  fixLeftNav:boolean=false;
  page = "BusinessMonitor";

  public constructor(private diagramService: DiagramService){
    this.loadAllDiagrams();
  }

  public loadAllDiagrams(){
    this.diagramService.getAll().subscribe((data: Diagram[])=>{
        this.diagrams = data;
        console.log("All diagrams: ", data);
    }, (error)=>{
        console.log("Error: ", error);
    });
  }

  public initPredictive(c){
    console.log("initPredictive:", c);
    this.ctrPredictive = c;
  }

  public initBusinessMonitor(c){
    console.log("initBusiness:", c);
    this.ctrBusiness = c;
  }

  public diagramClick(d){
    this.page = "BusinessMonitor";
    setTimeout(()=> {
      this.ctrBusiness.showDiagram(d);
    }, 200);
  }

  public showAdminDiagram(){
    this.page = "BusinessMonitor";
    setTimeout(()=> {
      this.ctrBusiness.showAdminDiagram();
    }, 200);
    
  }
  public showAdminData(){
    this.page = "BusinessMonitor";
    setTimeout(()=> {
    this.ctrBusiness.showAdminData();
      this.ctrBusiness.showAdminData();
    }, 200);
  }

  diagramChanged($event){
    console.log("diagramChanged");
    this.loadAllDiagrams();
  }
}
