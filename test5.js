
var request=require('request'),
    cheerio = require('cheerio'),
    fs = require('fs');
var exec = require('child_process').exec;

var fromIp = ''
var defaultLink = [
  'http://www.walmart.com/'
  ],
  outputArray = [];
var ipArray = [];

  buildIpList = (fromIp, toIp) => {
    var tempIp = fromIp;
    while(tempIp !== toIp){
      ipArray.push('http://'+tempIp);
      console.log(tempIp);
      var intIp = [];
      tempIp.split('.').map((val) => intIp.push(val));
      var i=3,flag = 1;
      while( flag && i>=0 ){
        intIp[i]++;
        if(intIp[i] / 256 == 1 ){
          flag = 1;
          intIp[i] = 0;
          i--;
        }else{
          flag = 0;
        }
      }
      tempIp = intIp.join('.');
    }
    ipArray.push('http://'+toIp);
    // ipArray.map((ip) => console.log(ip));
    webSiteCheck(0.45);
    // getAllIpHostName();
  }
send = (options)=> {
  return new Promise(function (resolve, reject){
      request(options, function (err, res, body) {
        if (err)
          return reject(err)
        if (res.statusCode >= 400) {
          return reject(body);
        }
        return resolve({
          html: body,
          item: options.url
        });
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
    console.log("fetching initialSetup item - ", item);
    return fetchCategory(item)
  })

  const processHtmlDataList = (htmlDataList) => {
    console.log("processing initialSetup htmlDataList");
    htmlDataList.forEach((htmlData) => {
        var $ = cheerio.load(htmlData.html);
        $('li').filter(function() {
          if(($(this).text().length>0)&&($(this).text().length<100)) {
            return true;
          } else {
            return false;
          }
        }).each(function() {
          var newList = $(this).text().toLowerCase().replace(/\s\s/g,"");
          if(inputArray.indexOf(newList) === -1){
            inputArray += newList.replace(/[a-zA-Z]/g,"") + "";
          }
        })
      })
      return Promise.resolve(0)
    }

  console.log("Before promise all");
  return Promise.all(promisesToFetchCateg)
  .then(processHtmlDataList)
  .then(()=>{
    console.log("entering website check...");
    webSiteCheck(0.5);
  })
  .catch((err)=> console.log("data error", err))
}

/*=============================================================================*/

function webSiteCheck(thresholdValue) {
  promisesToFetchCateg1 = ipArray.map(function(item) {
    console.log("fetching webSiteCheck item - ", item);
    return fetchCategory(item)
  })

  const processHtmlDataList1 = (htmlDataList) => {
    console.log("processing webSiteCheck htmlDataList", htmlDataList.length);
    htmlDataList.forEach((htmlData) => {
        var yes=0,no=0,size=0,sum=0,mightData="";
        var $ = cheerio.load(htmlData.html);
        size=$('li').length+1;
        $('li').filter(function() {
          if(($(this).text().length>0)&&($(this).text().length<100)) {
            return true;
          }
            return false;

        }).each(function() {
          var newList;
          newList = $(this).text().toLowerCase().replace(/[^A-z0-9 ]/g,"").replace(/^\s+|\s+$|\s+(?=\s)/g,"").replace(/\W+/g," ");
          newList = newList.split(" ");
          newList.map((newItem) => {
            var element = newItem.replace(/\s+?/g,'');
            if(inputArray.indexOf(element) >= 0 && element.length>1){
              yes += 1;
              sum += 1;
              console.log('yes-',element);
            }else {
              no += 1;
              sum += 1;
              mightData += element + " ";
              console.log('no-',element);
            }
          })
        })
        var percentage = (yes/sum); //parseFloat(percentage) >= parseFloat(thresholdValue*100)
        if( parseFloat(percentage) >= parseFloat(thresholdValue) && sum > 20 ) {
          console.log("YES - probability ",percentage, htmlData.item);
          // fs.appendFile('categoryData.txt',mightData);
        }else {
          console.log("No -  probability ",percentage, htmlData.item);
        }
      })
      return Promise.resolve(0)
    }

    inputArray = fs.readFileSync('categoryData.txt', 'utf8');
    console.log("Before webSiteCheck all ");
    // fs.writeFileSync("categoryData.txt",inputArray.replace(/\//g,""))
    return Promise.all(promisesToFetchCateg1)
    .then(processHtmlDataList1)
    .catch((err)=> console.log("data error", err))
}
buildIpList('27.1.1.1', '27.1.5.1')
