const fs=require('fs');
var request = require('request');
const token = 'ee7671750d5151ac3abd3dd20efcd473';
const daysAgo = 172800000;
const url = 'http://moonwalk.center/api/serials_updates.json?category=Anime&api_token='+token+'&page=';
var mongo = require('mongodb').MongoClient;
mongo.connect("mongodb://localhost:27017/site",function(err,db){
promisePageFunc(1,function(pageIndex,pageResolve,pageReject){
    const twoDaysAgo = Date.now() - daysAgo;   
    if(err)return console.log(err);  
     //подключем бд, вызываем страницы ао порядку, twoDaysAgo-константа, время два дня назад от вызова этог файла    
        
     request(options(url+pageIndex),function (err, response, body) {
         
        if(err)return console.log('error',name,err);
        console.log('statusCode:',response.statusCode);
        if(response.statusCode!=200)return pageReject();
                
        var answer = JSON.parse(body).updates;// массив обновлений
        console.log('answer array length: ',answer.length);
        promiseArrFunc(0,answer,function(obj,res){//ходим по обновлениям
        console.log('-----object got \n', obj,'\n-----')
        if(!obj.serial.kinopoisk_id||
        !obj.serial.translator_id)return res();
            
        const urlSeasons = `
            http://moonwalk.cc//api/serial_episodes.json?translator_id=${obj.serial.translator_id}&kinopoisk_id=${obj.serial.kinopoisk_id}&api_token=${token}`
                
        console.log('url for translation: ',urlSeasons);
        console.log('----name: ',obj.serial.title_ru,
                    " it's date",obj.added_at,'\n----');
            
        if(Date.parse(obj.added_at)<twoDaysAgo)return pageReject();//смотрим когда был добавлен сериал, то выходим из фунцкии
        function checkCollection(colArr){ 
            var checkCols=true;
            promiseArrFunc(0,colArr,function(colName,checkRes){
                var col = db.collection(colName);
                console.log(obj.serial.kinopoisk_id)
                col.findOne({uid:obj.serial.kinopoisk_id},
                            function(err, result) {//
                console.log('---What we got from the db', result,'\n---');
                if(err)return res();
                if(result&&result.links){//проверяем , есть ли фильм в бд
                    request(options(urlSeasons),function(error,resp,anw){
                        if(error)return res();
                        anw=JSON.parse(anw);
                        result.links.forEach(function(el,i){//собираем переводы
                            if(el.translation==anw.serial.translator){
                                el.seasons=anw.season_episodes_count;
                            }
                        });
                        console.log('---What we set', result,'\n---')
                        col.updateOne({uid:obj.serial.kinopoisk_id},
                                      {$set:{links:result.links}});
                       return res();
                    })
                    checkCols=false;
                }
                else {
                    console.log('there is no movie in',colName);
                    return  checkRes();
                }
                    
                            })
            },()=>{
                if(checkCols)checkNew(obj,res);
            })
        }
        checkCollection(['anime'])
            },pageResolve)
                
        });

    })
function promisePageFunc(i,callBack){
    console.log('----------New page ',i);
    new Promise((resolve,reject)=>{
        callBack(i,resolve,reject)    
    })
    .then((ans)=>{
        return promisePageFunc(i+1,callBack)
    },(err)=>{
        console.log('ended');
        db.close();
    })
}

    
function promiseArrFunc(i,arr,callBack,afterBack){//функция с помощтю которой можно ходить по массивам асинхронными функциями
    console.log('----------New promiseArr ',i);
    if(i>arr.length-1)return afterBack();
    new Promise((resolve,reject)=>{
        callBack(arr[i],resolve,i,arr)    
    })
    .then((ans)=>{
        return promiseArrFunc(i+1,arr,callBack,afterBack)
    })
}
function options (url) {//возращет заголовки
    console.log('send request at: ',url);
    return { 
     url:url,
     method: 'GET',
     headers:{
      Host: 'moonwalk.cc',
      "Upgrade-Insecure-Requests": 1,
      "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36 OPR/49.0.2725.47',
      "Accept-Language": 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7'
     }
   }
 }
        function checkNew(obj,res){//если фильма в юд, мы собираем м него инфу,и добавляем в коллекцию new, чтобы потом добавить на сайт
            console.log('there is not the serial in the db');
            var addCol = db.collection("new");
            const addUrl = 'http://moonwalk.cc/api/videos.json?kinopoisk_id='+obj.serial.kinopoisk_id+'&api_token='+token; 
                        
            console.log('url for new movie: ',addUrl)
            console.log(obj)
            addCol.findOne({uid:obj.serial.kinopoisk_id}, 
                           function(addErr, addResult) {
                if(addErr||addResult)return res()//проверяем есть ли фильм в new
                console.log('-----there is not the serial in the new-----');
                if(!obj.serial.material_data) return res();
                var insertObj = {
                    uid:obj.serial.kinopoisk_id||'',
                    name:obj.serial.title_ru||'',
                    nameEn:obj.serial.title_en||'',
                    country:obj.serial.material_data.countries||'',
                    genres:obj.serial.material_data.genres||'',
                    year:obj.serial.material_data.year||'',
                    raiting:Number(obj.serial.material_data
                                   .kinopoisk_rating)||'',
                    text:obj.serial.material_data.description||'',
                    links:[]
                };//объект который мы потом добавим в new
                request(options(addUrl),function(addErr,addRes,addBody){
                    if(addErr)return res();
                    var serTrans = JSON.parse(addBody).map(function(el,i,arr){
                            return el.translator_id
                    })//создаём массив переводов для ногвого сериала
                    console.log('----Trans array',serTrans,'\n----');
                    promiseArrFunc(0,serTrans,function(addObj,addResolve,
                                                        num,avf){//ходим по нему
                        const addSeasonsUrl=`
                            http://moonwalk.cc//api/serial_episodes.json?translator_id=${addObj}&kinopoisk_id=${obj.serial.kinopoisk_id}&api_token=${token}`
                            console.log('---Url to new serial',addSeasonsUrl)        
                        request(options(addSeasonsUrl),
                                function(transErr,transRes,transBody){
                            if(transErr)return addResolve();
                            let body = JSON.parse(transBody);
                            insertObj.links.push(body.season_episodes_count);
                            //добавляем в массив links сезоны
                            console.log('--What links we add\n',body,'\n--');
                            addResolve();
                        })
                    },function(){//под конец,добавляем объект в new
                            addCol.insertOne(insertObj,function(err,xuy){
                                if(err)console.log('not added');
                                    console.log('-What pbj we added',insertObj,'\n-')
                                    res();
                                });    
                            })
                          })
                        })
                     }
    
})