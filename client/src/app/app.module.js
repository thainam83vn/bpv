"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var app_component_1 = require("./app.component");
var predictive_analysis_ctr_1 = require("./predictive-analysis/predictive-analysis-ctr");
var com_dropdown_1 = require("./com-dropdown/com-dropdown");
var test_chart_1 = require("./predictive-analysis/test-chart");
var angular2_google_chart_directive_1 = require("./directives/angular2-google-chart.directive");
var tree_map_control_1 = require("./com-treemap/tree-map-control");
var com_dropdown_button_1 = require("./com-dropdown-button/com-dropdown-button");
var heat_map_component_1 = require("./heat-map/heat-map-component");
var plotting_1 = require("./plotting/plotting");
var data_grid_1 = require("./data-grid/data-grid");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule],
        declarations: [
            app_component_1.AppComponent,
            predictive_analysis_ctr_1.PredictiveAnalysisCtr,
            com_dropdown_1.DropDownComponent,
            com_dropdown_button_1.DropDownButtonComponent,
            test_chart_1.TestChartCtr,
            angular2_google_chart_directive_1.GoogleChart,
            tree_map_control_1.TreeMap,
            heat_map_component_1.HeatMapComponent,
            plotting_1.PlottingComponent,
            data_grid_1.DataGridComponent
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map