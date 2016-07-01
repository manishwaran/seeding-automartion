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
  ipArray.map(console.log(ip))
}

buildIpList('1.1.1.253', '1.1.2.2');
