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
var $ = require("jquery");
var DataGridComponent = (function () {
    function DataGridComponent() {
        var _this = this;
        this.initControl = new core_1.EventEmitter();
        this.currentItem = { Id: '' };
        setTimeout(function () {
            _this.initControl.emit(_this);
            console.log("data", _this.datasource);
            _this.createMeta();
        }, 500);
    }
    DataGridComponent.prototype.getDisplayFields = function () {
        var cols = [];
        for (var _i = 0, _a = this.meta.Columns; _i < _a.length; _i++) {
            var c = _a[_i];
            if (this.displays.indexOf(c) >= 0) {
                cols.push(c);
            }
        }
        // console.log("getDisplayFields", this.meta.Columns);
        return cols;
    };
    DataGridComponent.prototype.createMeta = function () {
        if (this.datasource != null) {
            var columns = [];
            for (var key in this.datasource[0]) {
                columns.push(key);
            }
            this.meta = { Columns: columns, Rows: this.datasource };
            setTimeout(function () {
                //$('#datatable').DataTable();
            }, 200);
        }
    };
    DataGridComponent.prototype.refresh = function () {
    };
    DataGridComponent.prototype.selectRow = function (row) {
        this.currentItem = row;
        var top = $("#" + row['Id']).offset().top;
        var currentScroll = $("#datatable").parent().scrollTop();
        var newScroll = currentScroll + top - 120;
        if (newScroll < 0)
            newScroll = 0;
        console.log("scroll ", row['Id'], " to ", currentScroll, top, newScroll);
        $("#datatable").parent().scrollTop(newScroll);
        // for(var i = 0; i < this.datasource.length;i++){
        //     var r = this.datasource[i];
        //     if (r['Id'] == row['Id']){
        //         console.log("scroll to ",i, r);
        //         var top = $("#" + row['Id']).offset().top;
        //         $("#datatable").scrollTop(top);
        //         break;
        //     }
        // }
    };
    return DataGridComponent;
}());
__decorate([
    core_1.Output("initControl"),
    __metadata("design:type", core_1.EventEmitter)
], DataGridComponent.prototype, "initControl", void 0);
__decorate([
    core_1.Input("datasource"),
    __metadata("design:type", Array)
], DataGridComponent.prototype, "datasource", void 0);
__decorate([
    core_1.Input("displays"),
    __metadata("design:type", Array)
], DataGridComponent.prototype, "displays", void 0);
DataGridComponent = __decorate([
    core_1.Component({
        selector: "[data-grid]",
        templateUrl: "./data-grid.html",
        styleUrls: ["./data-grid.css"]
    }),
    __metadata("design:paramtypes", [])
], DataGridComponent);
exports.DataGridComponent = DataGridComponent;
//# sourceMappingURL=data-grid.js.map