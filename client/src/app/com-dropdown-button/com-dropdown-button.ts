import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: '[com-dropdown-button]',
    templateUrl: './com-dropdown-button.html'
})
export class DropDownButtonComponent{
    static Controls: DropDownButtonComponent[] = [];
    static closeAll(){
        DropDownButtonComponent.Controls.forEach(element => {
            element.close();
        });
    }

    @Input() Title: string = "Select";
    @Input() DataSet: string[] = [];
    @Input() DisplayField: string;

    @Input() ExclusiveList: any[];
    @Input() ExclusiveField: string;

    @Input() LayoutPopupLeft: number = 0;

    @Output() onItemClicked: EventEmitter<any> = new EventEmitter();
    @Output() onPopupShown: EventEmitter<any> = new EventEmitter();

    down: boolean = false;

    public constructor(){
        DropDownButtonComponent.Controls.push(this);
    }

    public isExclusive(item: any){
        for(var i = 0; i < this.ExclusiveList.length; i++){
            if (this.ExclusiveList[i][this.ExclusiveField] == item[this.DisplayField])
                return true;
        }
        return false;
    }

    itemClick(item: any){
        this.close();
        this.raiseDataChangeHandle(item);
    }

    public btnClick(){        
        var v = !this.down;
        DropDownButtonComponent.closeAll();
        this.down = v;
        if (this.down)
            this.onPopupShown.emit();
    }

    public close(){
        this.down = false;
    }

    raiseDataChangeHandle(item: any){
        setTimeout(()=>{
            this.onItemClicked.emit(item);
        }, 100);
    }
}