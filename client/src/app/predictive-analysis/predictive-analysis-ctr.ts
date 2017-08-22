import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PredictiveAnalysis, ProductAnalysis } from "./predictive-analysis-model";
import {Http, Headers} from "@angular/http";
import * as $ from 'jquery';
import { TreeMapItem, HeatMap, DataCommon, HeatMapItem, PointMap, CSS } from "./../models/data-common";
import { DropDownButtonComponent } from "../com-dropdown-button/com-dropdown-button";
import { DropDownComponent } from "../com-dropdown/com-dropdown";
import { HeatMapComponent } from "../heat-map/heat-map-component";
import { PlottingComponent } from "../plotting/plotting";
import { DataGridComponent } from "../data-grid/data-grid";
import { DiagramService } from "app/services/diagram.service";

export class FilterOption {
    name: string;
    dataFunc: any;
    public selected: any[];
    public display: any[];
    public collapsed: boolean = true;
    public constructor(name: string, dataFunc: any){
        this.name = name;
        this.dataFunc = dataFunc;
        this.selected = [];
        this.display = [];
        
    }

    public getDisplayData(dataset: any[]):any[]{
        this.display = DataCommon.distinct(dataset, this.dataFunc);
        return this.display;
    }

    public choose(item: string){
        var i = this.selected.indexOf(item);
        if (i < 0)
            this.selected.push(item);
        else{
            this.selected.splice(i, 1);
        }
    }
    public chooseAll(){
        
        if (this.selected.length == this.display.length)
        {
            this.selected = [];
        }
        else{
            this.selected = [];
            this.display.forEach(element => {
                this.selected.push(element);
            });
        }
    }

    public isSelectedAll(){
        if (this.selected == null)
            return false;
        return this.selected.length == this.display.length;
    }
}

@Component({
    selector: 'predictive-analysis',
    templateUrl: './predictive-analysis.html',
    styleUrls:["./predictive-analysis.css"]
})
export class PredictiveAnalysisCtr{
    @Output() initControl: EventEmitter<any> = new EventEmitter();


    fixLeftNavValue:boolean;  
    graph: number = 2;
    
    @Output() fixLeftNavChange = new EventEmitter();  
    @Input() 
    get fixLeftNav(): boolean{
        return this.fixLeftNavValue;
    };
    set fixLeftNav(v:boolean){
        this.fixLeftNavValue = v;
        this.fixLeftNavChange.emit(v);
    };


    //fixLeftNav: boolean = false;

    HeatMapWidth: number = 400;
    HeatMapHeight:  number = 400;

    BlockSize:number = 5;

    FilterOptionTemplates : any[] = [
        {name: 'Segments', defaultSelections:[], getDataFunc: (e: ProductAnalysis)=>{return e.Segment;}},
        {name: 'Subsegments', defaultSelections:[], getDataFunc: (e: ProductAnalysis)=>{return e.Subsegment;}},
        {name: 'Areas', defaultSelections:[], getDataFunc: (e: ProductAnalysis)=>{return e.Area;}},
        {name: 'Countries', defaultSelections:[], getDataFunc: (e: ProductAnalysis)=>{return e.Country;}},
        {name: 'Customers', defaultSelections:[], getDataFunc: (e: ProductAnalysis)=>{return e.Customer;}},
        {name: 'Partners', defaultSelections:[], getDataFunc: (e: ProductAnalysis)=>{return e.Partner;}},
        {name: 'AccountTeams', defaultSelections:[], getDataFunc: (e: ProductAnalysis)=>{return e.Account;}},
        {name: 'SalesTeritories', defaultSelections:[], getDataFunc: (e: ProductAnalysis)=>{return e.SalesTerritory;}}
    ];
    FilterOptions: FilterOption[] = [];
    
    DataSets: any = {
        Segments: [],
        Subsegments: [],
        Areas: [],
        Countries:[],
        Customers: [],
        Partners:[],
        AccountTeams:[],
        SalesTeritories:[]
    };


    Selected: any = {
        Segments: [],
        Subsegments: [],
        Areas: [],
        Countries:[],
        Customers: [],
        Partners:[],
        AccountTeams:[],
        SalesTeritories:[]
    };
    SelectedProducts: any[];
    SelectedCell: HeatMapItem;

    mode: number = 1;
    loading: boolean = false;

    dataset: PredictiveAnalysis;
    currentDataSet: ProductAnalysis[] = [];
    heatmap: HeatMap;
    pointmap: PointMap;
    cakemap: TreeMapItem[];

    heatmapControl: HeatMapComponent;
    pointmapControl: PlottingComponent;
    datagridControl: DataGridComponent;

    
    public constructor(private diagramService: DiagramService){
        // debugger;
        if (this.initControl) this.initControl.emit(this);
        

        this.diagramService.getTableData("bpv").subscribe(
        (data)=>{
            // this.dataset = data;
            this.dataset = PredictiveAnalysis.getTestDataFromDB(data);
            this.refreshCurrentDataSet();
            // console.log("currentDataSet:", this.currentDataSet);
            this.pointmap = PredictiveAnalysis.getPointMap(this.currentDataSet);
            // console.log("loaded bpv");
            this.setPlottingData();                    
        }, (err)=>{
            console.log("Error getTableData", err);
        }
        );
    }

    setPlottingData(){
        if(this.pointmapControl){
            this.pointmapControl.loadData(this.dataset.Products, this.pointmap);            
            this.FilterOptionTemplates.forEach(element => {
                this.filterAddClicked(element);
            });                
        } else {
            setTimeout(()=>{
                this.setPlottingData();
            }, 200);
        }
    }

    initHeatmapControl(control: any){
        this.heatmapControl = control;        
    }
    initPointmapControl(control: any){
        this.pointmapControl = control;     
        this.refreshCurrentDataSet();   
    }
    initDataGridControl(control: any){
        this.datagridControl = control;        
    }

    public removeOption(option: FilterOption){
        for(var i = 0; i < this.FilterOptions.length; i++){
            if (option == this.FilterOptions[i]){
                this.FilterOptions.splice(i, 1);
                this.refreshCurrentDataSet();
            }
                
        }
    }

    public filterAddClicked(item: any){
        // console.log("filterAddClicked ", item);
        var option: FilterOption = new FilterOption(item.name, item.getDataFunc);
        option.selected = item.defaultSelections;

        this.FilterOptions.push(option);
        // console.log("FilterOptions",this.FilterOptions);
        this.refreshCurrentDataSet();        
    }

    public onAddFilterShown(){
        DropDownComponent.closeAll();
    }
    public onFilterShown(){
        DropDownButtonComponent.closeAll();
    }

       // public dataChanged(){
    //     // alert("AAAAA");
    //     this.refreshCurrentDataSet();
    //     this.refreshHeatMap();
    // }
    public dataChanged(option: FilterOption){
        this.refreshCurrentDataSet();
    }

    public refreshCurrentDataSet(){
        if (this.dataset){
            this.currentDataSet = DataCommon.where(this.dataset.Products, (e: ProductAnalysis)=>{return true;});
            for(var i = 0; i < this.FilterOptions.length; i++){
                var option = this.FilterOptions[i];
                option.getDisplayData(this.currentDataSet);
                this.currentDataSet = DataCommon.where(this.currentDataSet, (e: ProductAnalysis)=>{
                    if (option.selected == null || option.selected.length == 0) 
                        return true;
                    return option.selected.indexOf(option.dataFunc(e)) >= 0;                
                    // if (this.Selected.Segments.length > 0)
                    //     r = r && this.Selected.Segments.indexOf(e.Segment) >= 0;                
                });
                
            }
            setTimeout(()=>{
                if (this.graph==1&&this.heatmapControl != null){
                    this.heatmapControl.refresh();
                }
                if (this.graph==2&&this.pointmapControl != null){
                    this.pointmapControl.refresh();
                }
                // if (this.datagridControl != null){
                //     this.datagridControl.refresh();
                // }
            }, 200);
        } else {
            setTimeout(()=>{
                this.refreshCurrentDataSet();
            }, 100);
        }
    }

    public chooseGraph(graph: number){
        this.graph = graph;
        this.refreshCurrentDataSet();
    }

    
 

    public cellClicked(cell: HeatMapItem){
        console.log(cell);
        this.SelectedCell = cell;
        this.mode = 2;
        this.SelectedProducts = [];
        var total = 0;
        for(var i = 0; i< cell.Result.length;i++){
            var e = cell.Result[i];
            if (e.ProductID != ""){
                this.SelectedProducts.push({
                    ProductID: e.ProductID,
                    ProductProbability: Math.round(e.ProductProbability * 100)
                });
                total += Math.round(e.ProductProbability * 100);
            }                                     
        }
        this.SelectedProducts.push({
            ProductID: "Others",
            ProductProbability: 100 - total
        });
        this.SelectedProducts.sort((a, b)=>{
            if (a.ProductProbability == b.ProductProbability) return 0;
            if (a.ProductProbability < b.ProductProbability) return 1;
            return -1;
        });
        //this.avg = DataCommon.avg(this.SelectedProducts, (e:any)=>e.ProductProbability);
        this.cakemap = [];
        var currentContainer = this.cakemap;
        var remainTotal = 100;
        var isVertical: boolean = false;
        var totalOrgOfCurrentDirection = 0;
        var totalOfCurrentDirection = 0;
        this.SelectedProducts.forEach(element => {
            var item : TreeMapItem = {
                Name: element.ProductID,
                OrgPercent: element.ProductProbability,
                Percent: Math.round(element.ProductProbability * 100/remainTotal),
                IsVertical: isVertical,
                Items: [],
                Width: 100,
                Height: 100,
                Top:0,
                Left:0,
                Color: "000000"
            };
            if (item.IsVertical){
                item.Height = item.Percent; 
                item.Top = totalOfCurrentDirection;
            } else {
                item.Width = item.Percent;
                item.Left = totalOfCurrentDirection;
            }
            var colorIndex = (item.OrgPercent + totalOfCurrentDirection) + Math.floor(Math.random() * 1000);
            item.Color = CSS.COLORS[colorIndex % CSS.COLORS.length];
            currentContainer.push(item);
            
            totalOrgOfCurrentDirection += item.OrgPercent;
            totalOfCurrentDirection += item.Percent;
            if (totalOfCurrentDirection > 50){                  

                var item : TreeMapItem = {
                    Name: null,
                    OrgPercent: remainTotal,
                    Percent: 100 - totalOfCurrentDirection,
                    IsVertical: isVertical,
                    Items: [],                    
                    Width: 100,
                    Height: 100,
                    Top:0,
                    Left:0,
                    Color: "transparent"
                };
                if (item.IsVertical){
                    item.Height = item.Percent; 
                    item.Top = totalOfCurrentDirection;
                } else {
                    item.Width = item.Percent;
                    item.Left = totalOfCurrentDirection;
                }
                currentContainer.push(item);
                currentContainer = item.Items;

                remainTotal -= totalOrgOfCurrentDirection;
                totalOrgOfCurrentDirection = 0;
                totalOfCurrentDirection = 0;
                isVertical = !isVertical;
            }
        });
        console.log(this.cakemap);
    }

    public back(){
        this.mode = 1;
    }

    public pointmapSelectItem(row: any){
        if (this.datagridControl != null){
            this.datagridControl.selectRow(row);
        }
    }
}