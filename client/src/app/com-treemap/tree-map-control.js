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
var TreeMap = (function () {
    function TreeMap() {
    }
    return TreeMap;
}());
__decorate([
    core_1.Input('data'),
    __metadata("design:type", Array)
], TreeMap.prototype, "items", void 0);
__decorate([
    core_1.Input('display'),
    __metadata("design:type", String)
], TreeMap.prototype, "display", void 0);
__decorate([
    core_1.Input('key'),
    __metadata("design:type", String)
], TreeMap.prototype, "key", void 0);
__decorate([
    core_1.Input('percent'),
    __metadata("design:type", String)
], TreeMap.prototype, "percent", void 0);
__decorate([
    core_1.Input('orgPercent'),
    __metadata("design:type", String)
], TreeMap.prototype, "orgPercent", void 0);
__decorate([
    core_1.Input('vertical'),
    __metadata("design:type", String)
], TreeMap.prototype, "vertical", void 0);
TreeMap = __decorate([
    core_1.Component({
        selector: "[treemap]",
        templateUrl: "./tree-map-template.html",
        styleUrls: ["./tree-map-style.css"]
    })
], TreeMap);
exports.TreeMap = TreeMap;
//# sourceMappingURL=tree-map-control.js.map