import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import 'rxjs/add/operator/map';
import { Metric } from "app/models/data-common";

@Injectable()
export class DiagramService{
    WS_URL: string = "http://54.244.159.69:3000";
    // WS_URL: string = "http://localhost:3000";
    constructor(private http:Http){}

    selectAllFromTable(tableName: string){
        return this.http.get(this.WS_URL + "/Table/" + tableName + "/SelectAll").map((response:Response)=>response.json());
    }

    addDiagram(parentId, d, file){
        let formData:FormData = new FormData();
        formData.append('svg', file, file.name);
        let headers = new Headers();
        // headers.append('Content-Type', 'multipart/form-data');
        // headers.append('Accept', 'application/json');
        // let options = new RequestOptions({ headers: headers });
        return this.http.post(this.WS_URL + "/KPIMetric/Diagram/"+parentId+"/"+d.Name, formData)
            .map(res => res.json());
        //return this.http.post(this.WS_URL + "/KPIMetric/Diagram/"+parentId, d).map((response:Response)=>response.json());
    }

    deleteDiagram(id){
        return this.http.delete(this.WS_URL + "/KPIMetric/Diagram/" + id).map((response:Response)=>response.json());
    }

    getAll(){
        return this.http.get(this.WS_URL + "/KPIMetric/GetAllDiagram").map((response:Response)=>response.json());
    }

    getAllDiagrams(){
        return this.http.get(this.WS_URL + "/KPIMetric/Diagrams").map((response:Response)=>response.json());
    }
    //http://localhost:8084/ProcessMonitoringWS/api/ShapeWS/GetConfigurableShapeByDiagramId/2
    getMetricByShapeId(id: number){
        return this.http.get(this.WS_URL + "/KPIMetric/GetMetricByShapeId/"+id).map((response:Response)=>response.json());
    }    

    createShape(diagramId: number, shapeId: string){
        return this.http.post(this.WS_URL + "/KPIMetric/createShape", {ShapeId: shapeId, DiagramId: diagramId}).map((response:Response)=>response.json());
    }     

    createMetric(metric: Metric){
        return this.http.post(this.WS_URL + "/KPIMetric/createMetric", metric);
    } 

    makeMetric(metric: Metric){
        var url = "/KPIMetric/makeMetric/:shapeId/:tableName/:col1/:col2/:op/:agg"
            .replace(":shapeId", metric.ShapeId + "")
            .replace(":tableName", metric.Table)
            .replace(":col1", metric.Column1)
            .replace(":col2", metric.Column2)
            .replace(":op", metric.Operator)
            .replace(":agg", metric.Aggregation);
        return this.http.post(this.WS_URL + url, metric);
    }           

    //ProcessMonitoringWS/api/DBTableWS/getAllTableName
    getAllTable(){
        return this.http.get(this.WS_URL + "/DBTableWS/getAllTableName").map((response:Response)=>response.json());
    }

    getTableData(tableName: string){
        return this.http.get(this.WS_URL + "/DBTableWS/data/" + tableName).map((response:Response)=>response.json());
    }    

    uploadFileCSV(tableName: string, file: any){
        let formData:FormData = new FormData();
        formData.append('csv', file, file.name);
        let headers = new Headers();
        // headers.append('Content-Type', 'multipart/form-data');
        // headers.append('Accept', 'application/json');
        // let options = new RequestOptions({ headers: headers });
        return this.http.post(this.WS_URL + "/DBTableWS/table/" + tableName, formData).map((response:Response)=>response.json());
    }

    deleteTable(tableName){
        return this.http.delete(this.WS_URL + "/DBTableWS/table/" + tableName).map((response:Response)=>response.json());
    }


    //ProcessMonitoringWS/api/KPIMetric/GetByDiagramId/2
    getKPIMetricByDiagramId(id: number){
        return this.http.get(this.WS_URL + "/KPIMetric/GetByDiagramId/"+id).map((response:Response)=>response.json());
    }

    //http://localhost:8084/ProcessMonitoringWS/api/ShapeWS/GetConfigurableShapeByDiagramId/2
    getConfigurableShapeByDiagramId(id: number){
        return this.http.get(this.WS_URL + "/ShapeWS/GetConfigurableShapeByDiagramId/"+id).map((response:Response)=>response.json());
    }

    //http://localhost:8084/ProcessMonitoringWS/api/ShapeWS/GetConfigurableShapeByDiagramId/2
    getColumnsByTable(tableName: string){
        return this.http.get(this.WS_URL + "/DBTableWS/getColumnNameByTable/"+tableName).map((response:Response)=>response.json());
    }


}