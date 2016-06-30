var request=require('request'),
    cheerio = require('cheerio');

var defaultLink = [
    'http://www.walmart.com/',
    'http://www.amazon.com',
    'http://www.flipkart.com/'
  ],
  inputArray= "",
    inputIp=[
    '103.1.124.34',
    '54.239.17.7',
    '50.63.202.1',
    '151.101.1.69'
  ];

function initialSetup() {
  defaultLink.forEach(function(item,i) {
    console.log("item");
    console.log(item);
    var options = {
      url : item,
      headers : {"User-Agent" : "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/50.0.2661.102 Chrome/50.0.2661.102 Safari/537.36"}
    };
    request(options,function(error,reqst,response) {
        var $ = cheerio.load(response);
        $('li').filter(function() {
            if(($(this).text().length>0)&&($(this).text().length<100)) {
                return true;
            } else {
                return false;
            }
        }).each(function() {
            var newList = $(this).text().toLowerCase();
            if(inputArray.indexOf(newList) > -1)
              inputArray += newList + " ";
        });
    })
  });
}

initialSetup();
