import React from 'react';
import ReactDOM from 'react-dom';
import rd3 from 'rd3';
import * as Config from '../actions/ConfigFile_Do_Not_Check_IN';

export default class BarDisplay extends React.Component
{
  constructor(props)
  {
  	  console.log(" In the C'tor of BarDIsplay");

    super(props);
       var AWS = require("aws-sdk/dist/aws-sdk");
	var AWS = window.AWS;
	AWS.config.update({
	  region: "us-west-2"
	});
    var table = "machinetab";

     var api = "AKIAILY5QKVCG45EW4AA";
   var secretKey = "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";
	 AWS.config.update({accessKeyId: api, secretAccessKey: secretKey});
	 	var docClient = new AWS.DynamoDB.DocumentClient();
     this.state= { barData : [],
     	           awsDocClient:docClient
     			  };
       /*[{
    	  "name": "Series A",
    	  "values": [
      		{ "x": "Errors", "y":  91},
      		{ "x": "Exception", "y": 290},
      		{ "x": "Faults", "y":  15},
      		{ "x": "Patients", "y":  124},
      		{ "x": "Interlock", "y":  25}
    	  ]
  	  }],
  	  render : 1
    };*/
    this.updateViz = this.updateViz.bind(this);

  


    // Query 
   	    var params = {
      TableName : table,
      KeyConditionExpression: "#user = :id ",
         FilterExpression: "#doc.#machid = :mid",
      ExpressionAttributeNames:{
        "#user": "userid",
        "#doc":"document",
        "#machid": "machineid"
      },
      ExpressionAttributeValues: {
        ":id":"200",
        ":mid": "20"
      }
    };
    this.queryFunction= this.queryFunction.bind(this);
    console.log("Scanning patient table.");
  
      docClient.query(params, this.queryFunction);
      
 
 }

  componentDidMount()
  {
    console.log(" Component DId mount  in BarDIsplay");

    window.setInterval(this.updateViz, 6000);

  }

  updateViz()
  {
  	
  	/*this.setState({barData :    [{
    	  "name": "Series A",
    	  "values": [
      		{ "x": "Errors", "y":  Math.random(10)*100},
      		{ "x": "Exception", "y": 290},
      		{ "x": "Faults", "y":  Math.random(70)*100},
      		{ "x": "Patients", "y":  124},
      		{ "x": "Interlock", "y":  Math.random(50)*100}
    	  ]
  	  }]});*/
  	 var table = "machinetab";
     var params = {
      TableName : table,
      KeyConditionExpression: "#user = :id ",
      FilterExpression: "#doc.#machid = :mid",
      ExpressionAttributeNames:{
        "#user": "userid",
        "#doc":"document",
        "#machid": "machineid"
      },
      ExpressionAttributeValues: {
        ":id":"200",
        ":mid": "20"
      }
    };
    
    console.log(" Updating the values in the UpdateViz");
  	this.state.awsDocClient.query(params,this.queryFunction);

  }

 queryFunction(err,data)
 {
    console.log(" In the callback of the query Function ");
    var newBarData = [ { "name" : "Series" , "values":[]}];
     var barDisplayDataValues = [];
    if (err) {
          console.error("Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          // print all the patients
          console.log("query succeeded.",data);
          console.log("query succeeded.",data.Items);
          console.log(" Items ",data.Items[0]);

          data.Items.forEach(function(item){
          	   console.log(" Exception  ",item.document.exceptionCount);
          	   var ex = parseInt(item.document.exceptionCount);
          	   var px = parseInt(item.document.Patients);
          	   var fx = parseInt(item.document.faultCount);
          	   var erx = parseInt(item.document.errorCount);
          	   var ix = parseInt(item.document.interlockCount);
                     var newEntry = [ { "x":"Faults" ,"y":fx},
                     				  { "x":"Exception" ,"y": ex},
                     				  { "x":"Patients" ,"y":px},
                     				  { "x":"Interlock" ,"y":ix},
                     				  { "x":"Errors" ,"y":erx}
                     				 ];
                    newBarData[0]["values"] =newEntry;
          });
          console.log(newBarData);
          this.setState({barData :  newBarData});
       
      }
 }




  componentMounted()
  {
     console.log(" Component Mounted in BarDisplay");
  }
  // Have the item and a delete button to cancel the appointment in the list
  render() 
  {

    let width = 900, height = 700, title = "Bar Chart",
    chartSeries = [
      {
        field: 'month',
        name: 'Month'
      }
    ],
    x = function(d) {
      return d.month;
    },
    xScale = 'ordinal',
    xLabel = "Metrics",
    yLabel = "Orders",
    yTicks = [100,'$'];
    console.log(" In the render for the  BarDisplay",this.state.barData);
    var BarChart = rd3.BarChart;
      return (<div> 
         		<BarChart
        		  title= {title}
      				data= {this.state.barData}
      				width= {width}
      				height= {height}
      				xAxisLabel= {xLabel}
      				yAxisLabel="Counts"
      			  />
        	</div> );

  }
}