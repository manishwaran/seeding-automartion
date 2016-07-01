var exec = require('child_process').exec;
var ipArray = [
  '75.126.153.206',
  '72.21.214.200',
  '163.53.78.58',
],
hostArray = [];
runExec = (ip) => {
  return new Promise(function(resolve, reject) {
    exec(`host ${ip}`, function puts(error, stdout, stderr) {
      if(error){
        reject('not found');
      }else{
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
}

fetchIpHost = ipArray.map(function(ip) {
  return runExec(ip);
})

getAllIphostName = (fromIp,toIp) => {

  extractIp = (execVal) => {
    if(execVal.indexOf('found') === -1) {
      return execVal.substring(execVal.lastIndexOf(" "),execVal.length);
    }else {
      return 'not found'
    }
  }

  return Promise.all(fetchIpHost)
  .then((data) => extractIp(data))
  .then((data) => console.log(data))
  .catch((data) => console.log(data))
}
getAllIphostName('1.1.1.1','2.2.2.2');
// convertIpToDomainName('1.2.3.4', '9.9.9.9')
