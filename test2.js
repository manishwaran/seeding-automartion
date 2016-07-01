
var request=require('request'),
    cheerio = require('cheerio');

var defaultLink = [
    'http://www.walmart.com/',
    'http://www.amazon.com',
    'http://www.flipkart.com/',
    'http://www.snapdeal.com/'
  ],
  inputArray= "manish",
    inputIp=[
    '103.1.124.34',
    '54.239.17.7',
    '50.63.202.1',
    '151.101.1.69'
  ],
  outputArray = [];

send = (options)=> {
  return new Promise(function (resolve, reject){
      request(options, function (err, res, body) {
        if (err)
          return reject(err)
        if (res.statusCode >= 400) {
          return reject(body);
        }
        return resolve(body);
      })
  });
};

fetchCategory = (item)=> {
  var options = {
    url : item,
    headers : {"User-Agent" : "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/50.0.2661.102 Chrome/50.0.2661.102 Safari/537.36"}
  };
  return send(options)
}

const noop = ()=>{}
function initialSetup(callback) {

  promisesToFetchCateg = defaultLink.map(function(item) {
    return fetchCategory(item)
  })

  processHtmlDataList = (htmlDataList) => {
    console.log(htmlDataList);
    htmlDataList.forEach((htmlData) => {
        var $ = cheerio.load(htmlData);
        $('li').filter(function() {
          if(($(this).text().length>0)&&($(this).text().length<100)) {
            return true;
          } else {
            return false;
          }
        }).each(function() {
          var newList = $(this).text().toLowerCase().replace(/\s\s/g,"");
          if(inputArray.indexOf(newList) < 0){
            inputArray += newList + " ";
          }
        })
      })
      return Promise.resolve(0)
    }

  return Promise.all(promisesToFetchCateg)
  .then(processHtmlDataList)
  .then(()=> webSiteCheck(0.5))
}

function webSiteCheck(thresholdValue) {
  inputIp.forEach(function(item,i) {
    var yes=0,no=0;
    var url = 'http://' + item;
    fetchCategory(url)
    .then( (htmlData) => {
      var $ = cheerio.load(htmlData);
      $('li').filter(function() {
        if(($(this).text().length>0)&&($(this).text().length<100)) {
          return true;
        } else {
          return false;
        }
      }).each(function() {
        var newList = $(this).text().toLowerCase().replace(/\s\s/g,"");
        if(inputArray.indexOf(newList) > 0){
          yes += 1;
        }else {
          no += 1;
        }
      })
      if( (yes/no) >= thresholdValue ) {
        outputArray.push(item);
      }
      console.log(inputArray);
      })
    .catch((data) => {
      console.log(data);
    })
  })
}
// initialSetup();
// console.log("manish");
// webSiteCheck(.5)
