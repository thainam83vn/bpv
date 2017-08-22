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
var DropDownButtonComponent = DropDownButtonComponent_1 = (function () {
    function DropDownButtonComponent() {
        this.Title = "Select";
        this.DataSet = [];
        this.onItemClicked = new core_1.EventEmitter();
        this.onPopupShown = new core_1.EventEmitter();
        this.down = false;
        DropDownButtonComponent_1.Controls.push(this);
    }
    DropDownButtonComponent.closeAll = function () {
        DropDownButtonComponent_1.Controls.forEach(function (element) {
            element.close();
        });
    };
    DropDownButtonComponent.prototype.isExclusive = function (item) {
        for (var i = 0; i < this.ExclusiveList.length; i++) {
            if (this.ExclusiveList[i][this.ExclusiveField] == item[this.DisplayField])
                return true;
        }
        return false;
    };
    DropDownButtonComponent.prototype.itemClick = function (item) {
        this.close();
        this.raiseDataChangeHandle(item);
    };
    DropDownButtonComponent.prototype.btnClick = function () {
        var v = !this.down;
        DropDownButtonComponent_1.closeAll();
        this.down = v;
        if (this.down)
            this.onPopupShown.emit();
    };
    DropDownButtonComponent.prototype.close = function () {
        this.down = false;
    };
    DropDownButtonComponent.prototype.raiseDataChangeHandle = function (item) {
        var _this = this;
        setTimeout(function () {
            _this.onItemClicked.emit(item);
        }, 100);
    };
    return DropDownButtonComponent;
}());
DropDownButtonComponent.Controls = [];
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DropDownButtonComponent.prototype, "Title", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], DropDownButtonComponent.prototype, "DataSet", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DropDownButtonComponent.prototype, "DisplayField", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], DropDownButtonComponent.prototype, "ExclusiveList", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DropDownButtonComponent.prototype, "ExclusiveField", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DropDownButtonComponent.prototype, "onItemClicked", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DropDownButtonComponent.prototype, "onPopupShown", void 0);
DropDownButtonComponent = DropDownButtonComponent_1 = __decorate([
    core_1.Component({
        selector: '[com-dropdown-button]',
        templateUrl: './com-dropdown-button.html'
    }),
    __metadata("design:paramtypes", [])
], DropDownButtonComponent);
exports.DropDownButtonComponent = DropDownButtonComponent;
var DropDownButtonComponent_1;
//# sourceMappingURL=com-dropdown-button.js.map