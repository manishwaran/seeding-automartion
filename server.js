var healthCheck = require('connect-health-check');
var express = require('express');
var app = express();
var healthCheck = require('connect-health-check');
var bodyParser = require('body-parser'),
	request=require('request'),
	tempResp = "",
	cheerio = require('cheerio');
var defaultLink = [
  'http://www.walmart.com/',
  'http://www.amazon.com',
  'http://www.flipkart.com/'
],
  inputArray= [],
  inputIp=[
    103.1.124.34,
    54.239.17.7,
    50.63.202.1,
    151.101.1.69
  ];

var options = {
  url : url,
  headers : {"User-Agent" : "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/50.0.2661.102 Chrome/50.0.2661.102 Safari/537.36"}
};

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(healthCheck)
app.use(express.static(__dirname + '/'));



initialSetup() {
  defaultLink.forEach(function(item,i) {
    var response = getResponse(item);
    if(response != -1){
      var $ = cheerio.load(response);
      $('li').filter(function() {
        if(($(this).text().length>0)&&($(this).text().length<100)) {
            return true;
        }
        else{
            return false;
        }
      }).each(function() {
        inputArray.push($(this).text());
      });
    });
  }
}

app.get('/', function(req, res){
	res.sendFile(__dirname + "/index.html")
  initialSetup();
});

app.post('/sendip', function(req, res){
  var outputIp = [];

});

app.post('/getresult',function(req,res){
	console.log(JSON.parse(req.body))
	var runJson = JSON.parse(req.body),
		resultJson = [],
		$ = cheerio.load(tempResp);
	runJson.data.forEach(function(item,index){
		var obj = {};
		obj.id=item.id;
		obj.val=$(item.css).text();
		resultJson.push(obj);
	})
	console.log("result sent "+resultJson);
	res.json(resultJson);

})

app.listen(3030, function () {
  console.log('Example app listening on port 3030!');
});
