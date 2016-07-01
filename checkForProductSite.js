
var request=require('request'),
    cheerio = require('cheerio'),
    fs = require('fs');

var hostsTxt = fs.readFileSync('hostName.txt', 'utf8');
var hostName = hostsTxt.split(",");
/*=============================================================================*/

function webSiteCheck(thresholdValue) {

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

  promisesToFetchCateg = hostName.map(function(item) {
    console.log("fetching initialSetup item - ", item);
    return fetchCategory(item)
  })

  const processHtmlDataList = (htmlDataList) => {
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
            }else {
              no += 1;
              sum += 1;
              mightData += element + " ";
            }
          })
        })
        var percentage = (yes/sum); //parseFloat(percentage) >= parseFloat(thresholdValue*100)
        if( parseFloat(percentage) >= parseFloat(thresholdValue) && sum > 20 ) {
          console.log("YES - probability ",percentage, htmlData.item);
          fs.appendFile('categoryData.txt',mightData);
        }else {
          console.log("No -  probability ",percentage, htmlData.item);
        }
      })
      return Promise.resolve(0)
    }

    inputArray = fs.readFileSync('categoryData.txt', 'utf8');
    hostName.map((item) =>{
      console.log(item);
    })

    console.log("Before webSiteCheck all ");
    return Promise.all(promisesToFetchCateg)
    .then(processHtmlDataList)
    .catch((err)=> console.log("data error", err))
}
webSiteCheck(0.5);
