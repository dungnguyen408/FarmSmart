var https = require('https');
//var pathFile = 'main/';
var dataResponse='';
var httpResponse='';
var jsonObject ='';

//writeAercloudDataToCsv(); //function call

function writeAercloudDataToCsv() {
	console.log("Preparing to write the data from Aercloud to CSV");
    /*
    * HTTP Options 
    * The below GET call GETs the most recent 100 rows. To get more, add queryparam "max"
    * Eg: url?apiKey=<apiKey>&max =200
    */
    var options = {
        host :  'api.aercloud.aeris.com',
        port : 443,
        path : '/v1/16074/scls/ClimateDevice/containers/FirstContainer/contentInstances?apiKey='+ '4ebc440a-eafb-11e5-a218-497c8286085a',
        method : 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'         
        }
    }
    
    var getReq = https.request(options, function(res) {
        console.log("\nstatus code: ", res.statusCode); //statuscode = 200 means success
           //get the Data from the response
           res.on('data', function(data) {
            dataResponse += data;
           });
           //parse the response to JSON
           res.on('end', function() {
            httpResponse = JSON.parse(dataResponse);

           if(!isEmpty(httpResponse)){
                    var contentTypeBinaryData = [];
                    var contentTypeBinaryFields = [];   
                    //Prepare the Data array with JSON elements with Temperature, Humidity and CreateTime data      
                    for (var key in httpResponse.contentInstances){
                        jsonObject = JSON.parse(httpResponse.contentInstances[key].content.contentTypeBinary);
                        jsonObject["creationTime"] = new Date(httpResponse.contentInstances[key].creationTime).toLocaleString();
						var p = document.getElementById("p");
						p.innerHTML = jsonObject;
                        //contentTypeBinaryData.push(jsonObject);
                    }
                 
            }
        });
    });

 //end the request
    getReq.end();
    getReq.on('error', function(err){
        console.log("Error: ", err);
    });  

//Function: Used to check if the File already exists
function fileExists(filePath)
    {
        console.log("Checking if the file.csv already exists....");
        try
        {
            return fs.statSync(filePath).isFile();
        }
        catch (err)
        {
            return false;
        }
    } 
    
//Funtion: Used to check if the object is empty 
var isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}  

}
