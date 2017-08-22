"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var predictive_analysis_model_1 = require("./predictive-analysis-model");
var $ = require("jquery");
var data_common_1 = require("./../models/data-common");
var com_dropdown_button_1 = require("../com-dropdown-button/com-dropdown-button");
var com_dropdown_1 = require("../com-dropdown/com-dropdown");
var FilterOption = (function () {
    function FilterOption(name, dataFunc) {
        this.collapsed = true;
        this.name = name;
        this.dataFunc = dataFunc;
        this.selected = [];
        this.display = [];
    }
    FilterOption.prototype.getDisplayData = function (dataset) {
        this.display = data_common_1.DataCommon.distinct(dataset, this.dataFunc);
        return this.display;
    };
    FilterOption.prototype.choose = function (item) {
        var i = this.selected.indexOf(item);
        if (i < 0)
            this.selected.push(item);
        else {
            this.selected.splice(i, 1);
        }
    };
    FilterOption.prototype.chooseAll = function () {
        var _this = this;
        if (this.selected.length == this.display.length) {
            this.selected = [];
        }
        else {
            this.selected = [];
            this.display.forEach(function (element) {
                _this.selected.push(element);
            });
        }
    };
    FilterOption.prototype.isSelectedAll = function () {
        if (this.selected == null)
            return false;
        return this.selected.length == this.display.length;
    };
    return FilterOption;
}());
exports.FilterOption = FilterOption;
var PredictiveAnalysisCtr = (function () {
    function PredictiveAnalysisCtr() {
        var _this = this;
        this.graph = 2;
        this.fixLeftNavChange = new core_1.EventEmitter();
        //fixLeftNav: boolean = false;
        this.HeatMapWidth = 400;
        this.HeatMapHeight = 400;
        this.BlockSize = 5;
        this.FilterOptionTemplates = [
            { name: 'Segments', defaultSelections: [], getDataFunc: function (e) { return e.Segment; } },
            { name: 'Subsegments', defaultSelections: [], getDataFunc: function (e) { return e.Subsegment; } },
            { name: 'Areas', defaultSelections: [], getDataFunc: function (e) { return e.Area; } },
            { name: 'Countries', defaultSelections: [], getDataFunc: function (e) { return e.Country; } },
            { name: 'Customers', defaultSelections: [], getDataFunc: function (e) { return e.Customer; } },
            { name: 'Partners', defaultSelections: [], getDataFunc: function (e) { return e.Partner; } },
            { name: 'AccountTeams', defaultSelections: [], getDataFunc: function (e) { return e.Account; } },
            { name: 'SalesTeritories', defaultSelections: [], getDataFunc: function (e) { return e.SalesTerritory; } }
        ];
        this.FilterOptions = [];
        this.DataSets = {
            Segments: [],
            Subsegments: [],
            Areas: [],
            Countries: [],
            Customers: [],
            Partners: [],
            AccountTeams: [],
            SalesTeritories: []
        };
        this.Selected = {
            Segments: [],
            Subsegments: [],
            Areas: [],
            Countries: [],
            Customers: [],
            Partners: [],
            AccountTeams: [],
            SalesTeritories: []
        };
        this.mode = 1;
        this.loading = false;
        this.currentDataSet = [];
        // debugger;
        setTimeout(function () {
            var f = $("#heatmap");
            console.log(f);
            $.ajax({
                url: "database/test1.csv",
                dataType: "html",
                method: "GET",
                success: function (response) {
                    console.log(response);
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }, 1000);
        //  $(".dropdown").addClass("open");
        // debugger;
        // $.get("http://localhost:3000/database/test1.csv", (data)=>{
        //     console.log(data);
        // });
        // $.ajax({
        //     url:"https://www.google.com/",
        //     dataType: null
        // }).done((data)=>{
        //     console.log(data);
        // });
        //this.http.get("database/test1.csv");
        this.dataset = predictive_analysis_model_1.PredictiveAnalysis.getTestData();
        //console.log(this.dataset);
        // var groupSegments = DataCommon.groupBy(this.dataset, (element: PredictiveAnalysis)=>{
        //     return element.Segment;
        // });
        this.refreshCurrentDataSet();
        this.heatmap = predictive_analysis_model_1.PredictiveAnalysis.getHeatMap(this.currentDataSet);
        this.pointmap = predictive_analysis_model_1.PredictiveAnalysis.getPointMap(this.currentDataSet);
        // $('.dropdown-toggle').dropdown();
        this.FilterOptionTemplates.forEach(function (element) {
            _this.filterAddClicked(element);
        });
    }
    Object.defineProperty(PredictiveAnalysisCtr.prototype, "fixLeftNav", {
        get: function () {
            return this.fixLeftNavValue;
        },
        set: function (v) {
            this.fixLeftNavValue = v;
            this.fixLeftNavChange.emit(v);
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    PredictiveAnalysisCtr.prototype.initHeatmapControl = function (control) {
        this.heatmapControl = control;
    };
    PredictiveAnalysisCtr.prototype.initPointmapControl = function (control) {
        this.pointmapControl = control;
        this.refreshCurrentDataSet();
    };
    PredictiveAnalysisCtr.prototype.initDataGridControl = function (control) {
        this.datagridControl = control;
    };
    PredictiveAnalysisCtr.prototype.removeOption = function (option) {
        for (var i = 0; i < this.FilterOptions.length; i++) {
            if (option == this.FilterOptions[i]) {
                this.FilterOptions.splice(i, 1);
                this.refreshCurrentDataSet();
            }
        }
    };
    PredictiveAnalysisCtr.prototype.filterAddClicked = function (item) {
        console.log("filterAddClicked ", item);
        var option = new FilterOption(item.name, item.getDataFunc);
        option.selected = item.defaultSelections;
        this.FilterOptions.push(option);
        console.log("FilterOptions", this.FilterOptions);
        this.refreshCurrentDataSet();
    };
    PredictiveAnalysisCtr.prototype.onAddFilterShown = function () {
        com_dropdown_1.DropDownComponent.closeAll();
    };
    PredictiveAnalysisCtr.prototype.onFilterShown = function () {
        com_dropdown_button_1.DropDownButtonComponent.closeAll();
    };
    // public dataChanged(){
    //     // alert("AAAAA");
    //     this.refreshCurrentDataSet();
    //     this.refreshHeatMap();
    // }
    PredictiveAnalysisCtr.prototype.dataChanged = function (option) {
        this.refreshCurrentDataSet();
    };
    PredictiveAnalysisCtr.prototype.refreshCurrentDataSet = function () {
        var _this = this;
        this.currentDataSet = data_common_1.DataCommon.where(this.dataset.Products, function (e) { return true; });
        for (var i = 0; i < this.FilterOptions.length; i++) {
            var option = this.FilterOptions[i];
            option.getDisplayData(this.currentDataSet);
            this.currentDataSet = data_common_1.DataCommon.where(this.currentDataSet, function (e) {
                if (option.selected == null || option.selected.length == 0)
                    return true;
                return option.selected.indexOf(option.dataFunc(e)) >= 0;
                // if (this.Selected.Segments.length > 0)
                //     r = r && this.Selected.Segments.indexOf(e.Segment) >= 0;                
            });
        }
        setTimeout(function () {
            if (_this.graph == 1 && _this.heatmapControl != null) {
                _this.heatmapControl.refresh();
            }
            if (_this.graph == 2 && _this.pointmapControl != null) {
                _this.pointmapControl.refresh();
            }
            // if (this.datagridControl != null){
            //     this.datagridControl.refresh();
            // }
        }, 200);
    };
    PredictiveAnalysisCtr.prototype.chooseGraph = function (graph) {
        this.graph = graph;
        this.refreshCurrentDataSet();
    };
    PredictiveAnalysisCtr.prototype.cellClicked = function (cell) {
        console.log(cell);
        this.SelectedCell = cell;
        this.mode = 2;
        this.SelectedProducts = [];
        var total = 0;
        for (var i = 0; i < cell.Result.length; i++) {
            var e = cell.Result[i];
            if (e.ProductID != "") {
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
        this.SelectedProducts.sort(function (a, b) {
            if (a.ProductProbability == b.ProductProbability)
                return 0;
            if (a.ProductProbability < b.ProductProbability)
                return 1;
            return -1;
        });
        //this.avg = DataCommon.avg(this.SelectedProducts, (e:any)=>e.ProductProbability);
        this.cakemap = [];
        var currentContainer = this.cakemap;
        var remainTotal = 100;
        var isVertical = false;
        var totalOrgOfCurrentDirection = 0;
        var totalOfCurrentDirection = 0;
        this.SelectedProducts.forEach(function (element) {
            var item = {
                Name: element.ProductID,
                OrgPercent: element.ProductProbability,
                Percent: Math.round(element.ProductProbability * 100 / remainTotal),
                IsVertical: isVertical,
                Items: [],
                Width: 100,
                Height: 100,
                Top: 0,
                Left: 0,
                Color: "000000"
            };
            if (item.IsVertical) {
                item.Height = item.Percent;
                item.Top = totalOfCurrentDirection;
            }
            else {
                item.Width = item.Percent;
                item.Left = totalOfCurrentDirection;
            }
            var colorIndex = (item.OrgPercent + totalOfCurrentDirection) + Math.floor(Math.random() * 1000);
            item.Color = data_common_1.CSS.COLORS[colorIndex % data_common_1.CSS.COLORS.length];
            currentContainer.push(item);
            totalOrgOfCurrentDirection += item.OrgPercent;
            totalOfCurrentDirection += item.Percent;
            if (totalOfCurrentDirection > 50) {
                var item = {
                    Name: null,
                    OrgPercent: remainTotal,
                    Percent: 100 - totalOfCurrentDirection,
                    IsVertical: isVertical,
                    Items: [],
                    Width: 100,
                    Height: 100,
                    Top: 0,
                    Left: 0,
                    Color: "transparent"
                };
                if (item.IsVertical) {
                    item.Height = item.Percent;
                    item.Top = totalOfCurrentDirection;
                }
                else {
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
    };
    PredictiveAnalysisCtr.prototype.back = function () {
        this.mode = 1;
    };
    PredictiveAnalysisCtr.prototype.pointmapSelectItem = function (row) {
        if (this.datagridControl != null) {
            this.datagridControl.selectRow(row);
        }
    };
    return PredictiveAnalysisCtr;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], PredictiveAnalysisCtr.prototype, "fixLeftNavChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PredictiveAnalysisCtr.prototype, "fixLeftNav", null);
PredictiveAnalysisCtr = __decorate([
    core_1.Component({
        selector: 'predictive-analysis',
        templateUrl: './predictive-analysis.html',
        styleUrls: ["./predictive-analysis.css"]
    }),
    __metadata("design:paramtypes", [])
], PredictiveAnalysisCtr);
exports.PredictiveAnalysisCtr = PredictiveAnalysisCtr;
//# sourceMappingURL=predictive-analysis-ctr.js.map