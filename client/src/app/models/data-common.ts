export class CSS{
    static COLORS: string[] = ['#00008B','#666699','#654321','#88654E','#5D3954','#A40000','#08457E','#986960','#CD5B45','#008B8B','#536878','#B8860B','#A9A9A9','#013220','#006400','#1F262A','#00416A','#00147E','#1A2421','#BDB76B','#483C32','#734F96','#534B4F','#543D37','#8B008B','#A9A9A9','#003366','#4A5D23','#556B2F','#FF8C00','#9932CC','#779ECB','#03C03C','#966FD6','#C23B22','#E75480','#003399','#4F3A3C','#301934','#872657','#8B0000','#E9967A','#560319','#8FBC8F','#3C1414','#8CBED6','#483D8B','#2F4F4F','#177245','#918151','#FFA812','#483C32','#CC4E5C','#00CED1','#D1BEA8','#9400D3','#9B870C','#00703C','#555555','#D70A53','#40826D','#A9203E','#EF3038','#E9692C','#DA3287','#FAD6A5','#B94E48','#704241','#C154C1','#056608','#0E7C61','#004B49','#333366','#F5C71A','#9955BB','#CC00CC','#820000','#D473D4','#355E3B','#FFCBA4','#FF1493','#A95C68','#850101','#843F5B','#FF9933','#00BFFF','#4A646C','#556B2F','#7E5E60','#66424D','#330066','#BA8759','#1560BD','#2243B6','#669999','#C19A6B','#EDC9AF','#EA3C53','#B9F2FF','#696969','#C53151','#9B7653','#1E90FF','#FEF65B','#D71868','#85BB65','#828E84','#664C28','#967117','#00009C','#E5CCC9','#EFDFBB','#E1A95F','#555D50','#C2B280','#1B1B1B','#614051'];
}
export interface Range {
    From: number;
    To: number;
}

export interface DataTable{
    Columns: string[];
    Rows: any[];
}

export interface TreeMapItem {
    Name: string;
    OrgPercent: number;
    Percent: number;
    IsVertical: boolean;
    Items: TreeMapItem[];

    Width:number;
    Height:number;
    Top:number;
    Left:number;
    Color: string;
}

export interface HeatMapItem {
    Name: string;
    X: Range;
    Y: Range;
    Result: any;
    Style: string;
    Desc: string;
}
export interface HeatMap {    
    Fields: string[];
    XFieldName: string;
    XRanges: number[];
    XDesc: string;
    YFieldName: string;    
    YRanges: number[];
    YDesc: string;
    Items: HeatMapItem[];
}

export interface ValueDesc {
    Name: string;
    Value: number;
}

export interface PointMapItem {
    Name: string;
    X: number;
    Y: number;
    XPercentage: number;
    YPercentage: number;
    Data: any;
    Value:any;
    Color: string;
}

export interface CheckItem {
    Items: string[];
    Name: string;
    Checked: boolean;
    Value: any;
    DataSet: any[];
}

export interface PointMap {    
    DisplayFields: any[],
    Fields: any[];
    GroupableFields: CheckItem[];    
    DetailFieldName: string;
    ValueFieldName: string;

    XFieldName: string;
    XRanges: ValueDesc[];
    XDesc: string;

    YFieldName: string;    
    YRanges: ValueDesc[];
    YDesc: string;

    Items: PointMapItem[];
    XDashes: number[];
    YDashes:number[];
    XMin:number;
    XMax:number;
    YMin:number;
    YMax:number;
}

export class DataVisualization {
    public static createHeatMap(meta: HeatMap, dataset: any[]){
        for(var i = 0; i < meta.Items.length; i++){
            var cell = meta.Items[i];
            var ls = DataCommon.where(dataset, (e1: any)=>{
                return e1[meta.XFieldName] >= cell.X.From && e1[meta.XFieldName] < cell.X.To
                    && e1[meta.YFieldName] >= cell.Y.From && e1[meta.YFieldName] < cell.Y.To;
            });
            cell.Result = ls;
        }
    }
    public static createPointMap(meta: PointMap, dataset: any[]){
        for(var i = 0; i < meta.Items.length; i++){
            
        }
    }
}

export class DataCommon {
    public static csv2object(csv: string): any{
        var lines = csv.split('\n');
        var headers = lines[0].split(',');

        var dataset = [];
        for(var i = 1; i < lines.length; i++){
            var values = lines[i].split(',');
            var obj = {};
            for(var j = 0; j < headers.length && j < values.length; j++){
                obj[headers[j]] = values[j];
            }
            dataset.push(obj);
        }

        return dataset;
    }

    public static copy(src: any, dest: any){
        for(var prop in src){
            if (prop != null && prop != "")
                dest[prop] = src[prop];
        }
        // src.forEach((element: any) => {
        //     dest[element] = src[element];
        // });

    }

    public static where(dataset: any[], condition: any): any[] {
        var result : any[] = [];
        dataset.forEach(element => {
            if (condition(element)){
                result.push(element);
            }
        });
        return result;
    }
    public static firstOrDefault(dataset: any[], condition: any): any {
        var result : any[] = DataCommon.where(dataset, condition);
        if (result.length == 0)
            return null;
        return result[0];
    }

    public static distinct(dataset: any[], getValue: any): any[] {
        var result : any[] = [];
        for(let element of dataset){ 
            var value = getValue(element);
            if (result.indexOf(value) < 0 && value != null){
                result.push(value);
            }
        }
        return result;
    }

    public static groupBy(dataset: any[], keyHandle: any, processFunc: any){
        var groupList: any[] = [];
        for(let element of dataset){
            var key = keyHandle(element);
            var item = DataCommon.firstOrDefault(groupList, (element: any)=>{
                return (element["Key"] == key);
            });
            if (item == null){
                item = {
                    Key: key,
                    Items: []
                };
                groupList.push(item);
            }
            item.Items.push(element);            
            if (processFunc) processFunc(item, element);
        }
        return groupList;
    }

    public static aggreation(dataset: any[], aggreationFunc: any, getValueFunc: any){
        var result: any[] = [];
        for(let element of dataset){
            var item = DataCommon.firstOrDefault(result, (e: any)=>{
                return e.Key == element.Key;
            });
            if (item == null){
                item = {Key: element.Key, Value: 0};
                result.push(item);
            }
            var value = getValueFunc(element);
            var newValue = aggreationFunc(item.Value, value);
            item.Value = newValue;            
        }
    }

    public static sum(dataset: any[], getValueFunc: any): number{
        var result = 0;
        for(let element of dataset){
            var value = getValueFunc(element);
            result += value;
        }
        return result;
    }

    public static avg(dataset: any[], getValueFunc: any): number{
        var result = DataCommon.sum(dataset, getValueFunc);
        return result/dataset.length;
    }

    public static lookupValue(dataset: any[], getValueFunc: any, compareFunc: any): number{
        var result: number = getValueFunc(dataset[0]);
        for(let element of dataset){
            var value = getValueFunc(element);
            if (result == null)
                result = value;
            else if (compareFunc(value, result))
                result = value;
        }
        return result;
    }

    
}

export class DiagramDetail {
    Id: number;
    Name: string;
    ParentId: number;
}

export class Diagram {
    Children: Diagram[];
    Content: string;
    Id: number;
    Name: string;
}

export class KPIMetric{
    ClickAddress: string;
    ClickEventType: string;
    DiagramId: number;
    Result: number;
    ShapeId: string;
    Id: number;
}

export class Metric {
    Aggregation: string;
    Column1: string;
    Column2: string;
    Id: number;
    Operator: string;
    ShapeId: number;
    Table: string;
}

export class ConfigurableShape {
    ClickAddress: string;
    ClickEventType: string;
    DiagramId: number;
    ShapeId: string;
}

export class Table {
    Table_Name: string;
    Columns: Column[];
}

export class Column {
    Column_Name: string;
}