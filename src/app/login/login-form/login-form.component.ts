import { HttpClient } from '@angular/common/http';
import { AotSummaryResolver } from '@angular/compiler';
import { Component, OnInit, NgZone } from '@angular/core';
import * as FusionCharts from "fusioncharts";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  dataFormat:any;
  dataSource: any;
  type: string;
  width: string;
  height: string;
  constructor(private httpClient: HttpClient) {
    this.type = "timeseries";
    this.width = "100%";
    this.height = "400";
    this.dataFormat = "json";
    // This is the dataSource of the chart
    this.dataSource = {
      data: null,
      chart: {},
      caption: {
        text: "Historical Data Forecast"
      },
       subcaption: {
         text: "Historical Data"
       },
      yaxis: [
        {
          plot: {
            value: "Historical Data",
            type: "line"
          },
          format: {
            prefix: "$"
          },
          title: "Historical Data Forecast"
        }
      ]
    };

    this.fetchData();
  }

  // In this method we will create our DataStore and using that we will create a custom DataTable which takes two
  // parameters, one is data another is schema.
  fetchData() {
    var jsonify = (res:any) => res.json();
    
    var dataFetch = fetch(
     "/assets/data.json"
     
    ).then(jsonify);
    var schemaFetch = fetch(
      "/assets/assets/schema.json"
   
    ).then(jsonify);

    Promise.all([dataFetch, schemaFetch]).then(res => {
     
      const [data, schema] = res;       
    

         function jsonArrayTo2D(data1:any, data2:any){
          let header:any[] = [];
          let AoA:any[] = [];
          let AoS:any[] = [];
                  
          data1.forEach((obj:any) => {
            Object.keys(obj).forEach(key => header.includes(key) || header.push(key))
            let thisRow = new Array(header.length);
            header.forEach((col, i) => thisRow[i] = obj[col] || '')
            AoA.push(thisRow);            
          })
           
             var resultSchema:any = [];
             var obj2 = schema;
             for(var j in obj2)
             resultSchema.push(obj2[j]);
              console.log(resultSchema, 'resultSchema')
              let schemaArrayNew:any[] = [];  
             resultSchema.forEach((obj:any)=> {       
             Object.keys(obj).forEach((key) => schemaArrayNew.includes(key) || schemaArrayNew.push(obj[key]))
                     
            AoS.push(schemaArrayNew)
          })          
             
         let result:any = {AoA, AoS} 
         return result; 
        }

        var dataArray = jsonArrayTo2D(data.data, schema).AoA;
     
      // First we are creating a DataStore
      const fusionDataStore = new FusionCharts.DataStore();
      // After that we are creating a DataTable by passing our data and schema as arguments
      const fusionTable = fusionDataStore.createDataTable(dataArray, schema);
   
      // Afet that we simply mutated our timeseries datasource by attaching the above
      // DataTable into its data property.
      this.dataSource.data = fusionTable;
    });
  }
  ngOnInit(): void {
  }

  login(){
   // alert("hello")
  }
  
  
}
