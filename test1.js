var request=require('request'),
    cheerio = require('cheerio'),
    Promise = require('promise');

var defaultLink = [
    'http://www.walmart.com/',
    'http://www.amazon.com',
    'http://www.flipkart.com/'
  ],
  inputArray= "manishwaran",
    inputIp=[
    '103.1.124.34',
    '54.239.17.7',
    '50.63.202.1',
    '151.101.1.69'
  ];

function getResponse(_url) {
  var options = {
    url : item,
    headers : {"User-Agent" : "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/50.0.2661.102 Chrome/50.0.2661.102 Safari/537.36"}
  };
  request(options,function(error,reqst,response) {
    return response;
  }
}

function performCherio(response, callback) {
  var $ = cheerio.load(response);
  $('li').filter(function() {
    if(($(this).text().length>0)&&($(this).text().length<100)) {
      return true;
    } else {
      return false;
    }
  }).each(callback);
}

var initialSetup = function() {
    var response = getResponse(item)
    performCherio(response,function(){
      var newList = $(this).text().toLowerCase();
      if(inputArray.indexOf(newList) < 0){
        inputArray += $(this).text().toLowerCase();
      }
    })
  return true;
}


function webSiteCheck() {
  inputIp.forEach(function(item,i) {

  })
}



// function promise(callback) {
//   return new Promise(function(resolve, reject) {
//     if(callback()){
//       console.log('1');
//       resolve(inputArray);
//     }else {
//       reject('data not initialized')
//     }
//   })
// }
// promise(initialSetup)
// .then(function(data){
//   console.log(data);
//   return 3
// })
// .then(function(data){
//   log(data)
// })
// .catch(function(data){
//   console.log("not done");
// })
