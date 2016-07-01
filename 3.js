var exec = require('child_process').exec;
var ipArray = [
  '1.1.1.1',
  '75.126.153.206',
  '72.21.214.200',
  '163.53.78.58',
],
hostArray = [];
runExec = (ip) => {
  return new Promise(function(resolve, reject) {
    exec(`host ${ip}`, function puts(error, stdout, stderr) {
      if(error){
        // console.log('not found host');
      }else{
        console.log('http://' + stdout.substring(stdout.lastIndexOf(" "),stdout.length-2).replace(/\s/g,""));
        hostArray.push('http://' + stdout.substring(stdout.lastIndexOf(" "),stdout.length-2).replace(/\s/g,""));
        resolve(stdout);
      }
    });
  });
}

buildIpList = (fromIp, toIp) => {
  var tempIp = fromIp;
  while(tempIp !== toIp){
    ipArray.push(tempIp);
    var intIp = [];
    tempIp.split('.').map((val) => intIp.push(val));
    var i=3,flag = 1;

    while( flag && i>=0 ){
      tempIp[i]++;
      if(temp[i] % 254 == 1 ){
        flag = 1;
        i--;
        temp[i] = 0;
      }else{
        flag = 0;
      }
    }
    tempIp = intIp.join('.');
  }
  ipArray.map(console.log(ip))
}

fetchIpHost =  ipArray.map(function(ip){
  console.log("fetching ip : ", ip);
  return runExec(ip);
});

getAllIphostName = () => {

  printAllHost = () => {
    console.log('printing hosts :');
    hostArray.map(console.log(host));
  }

  return Promise.all(fetchIpHost)
  // .then((data) => extractIp(data))
  .then(printAllHost)
  .catch((data) => console.log("error data"))
}
getAllIphostName();
// convertIpToDomainName('1.2.3.4', '9.9.9.9')
