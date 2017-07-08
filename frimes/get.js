var https = require('https');
 https.request({
 hostname: 'api.vk.com',  
 path: '/method/video.get?owner_id=258988713&videos=258988713_170140768&access_token=c9a960548a8ed2c8764a5bdccc24ac5e59c2ffac19c613433ecd18085022a9fbfc3acd983939259775829',
    userAgent:'' 
     
 }, function(res) {
 console.log("statusCode: ", res.statusCode);  
//console.log(res)     
 res.on('data', function(d) {
process.stdout.write(d);
 }
 );
 }).on('error', function(e) {
 console.error(e);
}).end();


//https://api.vk.com/method/video.get?owner_id=25898871368&access_token=6c1583a7660db542251f2e0c5efb38dd9ac35bd853d6dfacd0df79c53109be55e651b807e25a06809c698
//https:\/\/cs12686.vk.me\/u10774157\/videos\/0ccd3cad78.240.mp4?extra=OwPguEepf1sCs5isIZsioptC6ok_6dr9mUAVm4w_f1qbC2zfHUYoAAmK9RU4mxFLqu8FCdBnXHK5Enz10kywQcl0c67x4nZDSLYKXspbsBvWOaYgENgYjUeiuzehvE7niz8oJs6WAQs

