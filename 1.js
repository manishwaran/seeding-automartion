var exec = require('child_process').exec;
var ipArray = [];

buildIpList = (fromIp, toIp) => {
  var tempIp = fromIp;
  while(tempIp !== toIp){
    ipArray.push(tempIp);
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
  ipArray.push(toIp);
  // ipArray.map(console.log(ip));

}

buildIpList('1.1.1.253', '1.1.2.2');


runExec = (ip) => {
  return new Promise(function(resolve, reject) {
    exec(`host ${ip}`, function (error, stdout, stderr) {
      if(error){
        reject('not found');
      }else{
        console.log("std..",stdout);
        resolve(stdout);
      }
    });
  });
}

fetchIpHost = (ip) => {
  return runExec(ip);
}

getAllIphostName = (fromIp,toIp) => {

  extractIp = (execVal) => {
    if(execVal.indexOf('found') === -1) {
      return execVal.substring(execVal.lastIndexOf(" "),execVal.length);
    }else {
      return 'not found'
    }
  }

  return fetchIpHost('75.126.153.206')
  .then((data) => extractIp(data))
  .then((data) => console.log(data))
  .catch((data) => console.log(data))
}
getAllIphostName('1.1.1.1','2.2.2.2');
// convertIpToDomainName('1.2.3.4', '9.9.9.9')
