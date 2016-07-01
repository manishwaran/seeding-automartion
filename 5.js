var exec = require('child_process').exec;
var ipArray = [],hostName=[];

buildIpList = (fromIp, toIp) => {
  var tempIp = fromIp;
  while(tempIp !== toIp){
    ipArray.push(tempIp);
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
  ipArray.push(toIp);
  getAllIpHostName();
}

getAllIpHostName = () => {

  printAllHost = (hosts) => {
    console.log("starting printing hostnames...");
    hostName.map((host) => {
      console.log(host);
    });
  }

  runExec = (ip) => {
    return new Promise(function(resolve, reject) {
      exec(`host ${ip}`, function (err, stdout, stderr) {
        hostName.push('http://'+stdout.substring(stdout.lastIndexOf(" ")+1,stdout.length-2));
        resolve({stdout, stderr});
      });
    });
  }

  promisesToFetchIpHost = ipArray.map(function(ip) {
    return runExec(ip);
  })

  return Promise.all(promisesToFetchIpHost)
  .then((hostArray) => printAllHost(hostArray))
  .catch((err) => console.log(err))
}
buildIpList('75.126.153.205', '75.126.153.216');










// console.log("starting execution of exec...",ip);
// extractIp = (execVal) => {
//   console.log("starting execution of extractIp...",ip);
//   if(execVal.indexOf('found') === -1) {
//      console.log(execVal.substring(execVal.lastIndexOf(" "),execVal.length));
//   }else {
//
//   }
//   Promise.resolve(0);
// }
