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
var DropDownComponent = DropDownComponent_1 = (function () {
    function DropDownComponent() {
        this.Title = "Select";
        this.IsMultiSelect = true;
        this.Selected = [];
        this.DataSet = [];
        this.onDataChange = new core_1.EventEmitter();
        this.onPopupShown = new core_1.EventEmitter();
        this.down = false;
        DropDownComponent_1.Controls.push(this);
    }
    DropDownComponent.closeAll = function () {
        DropDownComponent_1.Controls.forEach(function (element) {
            element.close();
        });
    };
    DropDownComponent.prototype.getDisplay = function () {
        if (this.IsMultiSelect || this.Selected.length == 0)
            return this.Title;
        return this.Selected[0];
    };
    DropDownComponent.prototype.itemClick = function (item) {
        if (this.IsMultiSelect) {
            // item['Checked'] = !item['Checked'];
            var i = this.Selected.indexOf(item);
            if (i >= 0) {
                this.Selected.splice(i, 1);
            }
            else {
                this.Selected.push(item);
            }
            this.raiseDataChangeHandle();
        }
        else {
            var i = this.Selected.indexOf(item);
            if (i >= 0) {
                this.Selected.splice(i, 1);
            }
            else {
                this.Selected.splice(0, this.Selected.length);
                this.Selected.push(item);
            }
            this.raiseDataChangeHandle();
        }
    };
    DropDownComponent.prototype.btnClick = function () {
        var v = !this.down;
        DropDownComponent_1.closeAll();
        this.down = v;
        if (this.down)
            this.onPopupShown.emit();
    };
    DropDownComponent.prototype.selectAll = function () {
        var _this = this;
        this.DataSet.forEach(function (element) {
            if (_this.Selected.indexOf(element) < 0)
                _this.Selected.push(element);
        });
        this.raiseDataChangeHandle();
    };
    DropDownComponent.prototype.unselectAll = function () {
        this.Selected.splice(0, this.Selected.length);
        this.raiseDataChangeHandle();
    };
    DropDownComponent.prototype.close = function () {
        this.down = false;
    };
    DropDownComponent.prototype.raiseDataChangeHandle = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.IsMultiSelect)
                _this.onDataChange.emit(_this.Selected);
            else
                _this.onDataChange.emit(_this.Selected[0]);
        }, 100);
    };
    return DropDownComponent;
}());
DropDownComponent.Controls = [];
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DropDownComponent.prototype, "Title", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DropDownComponent.prototype, "DisplayFieldName", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DropDownComponent.prototype, "IsMultiSelect", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], DropDownComponent.prototype, "Selected", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], DropDownComponent.prototype, "DataSet", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DropDownComponent.prototype, "SingleSelected", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DropDownComponent.prototype, "onDataChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DropDownComponent.prototype, "onPopupShown", void 0);
DropDownComponent = DropDownComponent_1 = __decorate([
    core_1.Component({
        selector: '[com-dropdown]',
        templateUrl: './dropdown.html'
    }),
    __metadata("design:paramtypes", [])
], DropDownComponent);
exports.DropDownComponent = DropDownComponent;
var DropDownComponent_1;
//# sourceMappingURL=com-dropdown.js.map