
var request=require('request'),
    cheerio = require('cheerio');

var defaultLink = [
    // 'http://www.walmart.com/',
    // 'http://www.amazon.com',
    'http://www.flipkart.com/'
  ],
  inputArray= "",
    inputIp=[
    '103.1.124.34',
    '54.239.17.7',
    '50.63.202.1',
    '151.101.1.69'
  ],
  outputArray = [];

function initialSetup(callback) {
  defaultLink.forEach(function(item,i) {
    (function(i){
      var options = {
        url : item,
        headers : {"User-Agent" : "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/50.0.2661.102 Chrome/50.0.2661.102 Safari/537.36"}
      };
      request(options,function(error,reqst,response) {
          var $ = cheerio.load(response);
          var listItems = $('li').filter(function() {
              if(($(this).text().length>0)&&($(this).text().length<100)) {
                return true;
              } else {
                return false;
            }
          }),
          listItemLen = listItems.length;

          listItems.each(function() {
            var newList = $(this).text().toLowerCase();
            if(inputArray.indexOf(newList) < 0){
              inputArray += newList + " ";
              if(i == (defaultLink.length -1)){
                callback(inputArray)
                console.log(i + "===="+ defaultLink.length)
              console.log("new list sent");}
            }
          });
      })
    })(i)
  });
}

function webSiteCheck(thresholdValue) {
  inputIp.forEach(function(item,i) {
    var yes=0,no=0;
    // console.log('url');
    var url = 'http://' + item;
    // console.log(url);
    var options = {
      url : url,
      headers : {"User-Agent" : "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/50.0.2661.102 Chrome/50.0.2661.102 Safari/537.36"}
    };
    request(options,function(error,reqst,response) {
      if(!error){
      var $ = cheerio.load(response);
      $('li').filter(function() {
          if(($(this).text().length>0)&&($(this).text().length<100)) {
            return true;
          } else {
            return false;
        }
      }).each(function() {
        var newList = $(this).text().toLowerCase();
        console.log(newList);
        if(inputArray.indexOf(newList) > -1){
          yes += 1;
        }else {
          no += 1;
        }
      });
    }});
    if( (yes/no) >= thresholdValue ) {
      outputArray.push(item);
    }
  });
}
initialSetup(function(data){
  console.log(data + " printed from callback")
    webSiteCheck();
});
