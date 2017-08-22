import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: '[com-dropdown]',
    templateUrl: './dropdown.html'
})
export class DropDownComponent{
    static Controls: DropDownComponent[] = [];
    static closeAll(){
        DropDownComponent.Controls.forEach(element => {
            element.close();
        });
    }

    @Input() Title: string = "Select";
    @Input() DisplayFieldName: string;    
    @Input() IsMultiSelect: boolean = true;
    @Input() Selected: string[] = [];
    @Input() DataSet: string[] = [];
    @Input() SingleSelected: string;

    @Input() ExclusiveList: any[];
    @Input() ExclusiveField: string;

    @Input() LayoutPopupLeft: number = 0;

    @Output() onDataChange: EventEmitter<any> = new EventEmitter();
    @Output() onPopupShown: EventEmitter<any> = new EventEmitter();


    down: boolean = false;

    public constructor(){
        DropDownComponent.Controls.push(this);
        
    }

    public getDisplay():string{
        if (this.IsMultiSelect || this.Selected.length == 0)
            return this.Title;
        return this.Selected[0];
    }

    public isExclusive(item: any){

        if (!this.ExclusiveList) return false;
        for(var i = 0; i < this.ExclusiveList.length; i++){
            var v1 = this.ExclusiveList[i];
            if (this.ExclusiveField != '') v1 = this.ExclusiveList[i][this.ExclusiveField];
            var v2 = item;
            if (this.DisplayFieldName != '') v2 = item[this.DisplayFieldName];
            if (v1==v2)
                return true;
        }
        return false;
    }    

    itemClick(item: string){
        if (this.IsMultiSelect){
            // item['Checked'] = !item['Checked'];
            var i = this.Selected.indexOf(item);
            if (i >= 0){            
                this.Selected.splice(i, 1);
            } else {
                this.Selected.push(item);
            }
            this.raiseDataChangeHandle();
        }else {
            this.btnClick();
            var i = this.Selected.indexOf(item);
            if (i >= 0){            
                this.Selected.splice(i, 1);
            } else {
                this.Selected.splice(0, this.Selected.length);
                this.Selected.push(item);
            }
            this.raiseDataChangeHandle();
        }
    }

    public btnClick(){        
        var v = !this.down;
        DropDownComponent.closeAll();
        this.down = v;
        if (this.down)
            this.onPopupShown.emit();
    }

    public selectAll(){
        this.DataSet.forEach(element => {
            if (this.Selected.indexOf(element) < 0)
                this.Selected.push(element);
        });        
        this.raiseDataChangeHandle();
    }

    public unselectAll(){
        this.Selected.splice(0, this.Selected.length);
        this.raiseDataChangeHandle();        
    }

    public close(){
        this.down = false;
    }

    raiseDataChangeHandle(){
        setTimeout(()=>{
            if (this.IsMultiSelect)
                this.onDataChange.emit(this.Selected);
            else
                this.onDataChange.emit(this.Selected[0]);
        }, 100);
    }

    selectedDisplay(){
        if (this.SingleSelected){
            return (this.DisplayFieldName==''?this.SingleSelected:this.SingleSelected[this.DisplayFieldName]);
        }
        return "";
    }
}