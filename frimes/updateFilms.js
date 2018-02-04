const fs=require('fs');
var request = require('request');
const token = 'ee7671750d5151ac3abd3dd20efcd473';
const fileName = 'series.json';
const dataName = 'serials_foreign.json';
var movies = require('./'+fileName);
var moviesData = require('./'+dataName);
const daysAgo = 86400000;
const newFileName = 'seriesNew.json';
const url = 'http://moonwalk.cc/api/movies_updates.json?api_token='+token+'&page=';
var mongo = require('mongodb').MongoClient;
    mongo.connect("mongodb://localhost:27017/site",function(err,db){
    
    function promisePageFunc(i,callBack){
        console.log('----------New page ',i);
        new Promise((resolve,reject)=>{
            callBack(i,resolve,reject)    
        })
        .then((ans)=>{
            return promisePageFunc(i+1,callBack)
        },(err)=>{
            console.log('ended')
            db.close();
        })
    }   
    promisePageFunc(1,function(pageIndex,pageResolve,pageReject){
    
    
    function promiseArrFunc(i,arr,callBack){//функция с помощтю которой можно ходить по массивам асинхронными функциями
        console.log('----------New promiseArr ',i);
        if(i>arr.length-1)return pageResolve();
        new Promise((resolve,reject)=>{
            callBack(arr[i],resolve,i,arr)    
        })
            .then((ans)=>{
            return promiseArrFunc(i+1,arr,callBack)
        })
    }     
    const twoDaysAgo = Date.now() - daysAgo;   
    if(err)return console.log(err);  
     //подключем бд, вызываем страницы ао порядку, twoDaysAgo-константа, время два дня назад от вызова этог файла    
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
        
     request(options(url+pageIndex),function (err, response, body) {
         
        if(err)return console.log('error',name,err);
        console.log('statusCode:',response.statusCode);
        if(response.statusCode!=200)return pageReject();
                
        var answer = JSON.parse(body).updates;// массив обновлений
        console.log('answer array length: ',answer.length);
        promiseArrFunc(0,answer,function(obj,res){//ходим по обновлениям
        console.log('-----object got \n', obj,'\n-----')
        if(!obj.kinopoisk_id)return res();
            
        if(Date.parse(obj.added_at)<twoDaysAgo)return pageReject();//смотрим когда был добавлен фильм, то выходим из фунцкии
            var addCol = db.collection("new");
            addCol.findOne({uid:obj.kinopoisk_id}, 
                           function(addErr, addResult) {
                if(addErr||addResult)return res()//проверяем есть ли фильм в new
                var insertObj = {
                    uid:obj.kinopoisk_id||'',
                    name:obj.title_ru||'',
                    nameEn:obj.title_en||'',
                    country:obj.material_data.countries||'',
                    genres:obj.material_data.genres||'',
                    year:obj.material_data.year||'',
                    raiting:Number(obj.kinopoisk_rating)||'',
                    text:obj.material_data.description||'',
                    link:obj.iframe_url
                };//объект который мы потом добавим в new
                    addCol.insertOne(insertObj,function(err,xuy){
                    if(err)console.log('not added');
                    console.log('-What pbj we added',insertObj,'\n-')
                    res();
                          })
                        })
                    })
            });

            
                
        })
    })  
//var newMovies = require('./'+fileName);
/*movies.forEach((el)=>{
            el.country=el.info.country
            el.img=el.info.imgDes
            el.genres=el.info.genres
            el.criticm=el.info.criticm
            el.year=el.info.year
            delete el.info
})
movies.forEach((el)=>{
    moviesData.report.serials.forEach((elem)=>{
        if(el.name==elem.title_ru&&el.id==elem.title_en){
            el.uid=elem.kinopoisk_id;
        }
    })
})
movies.forEach((el)=>{
    if(typeof el.link == 'string'){
        var ror=fs.readFileSync("log.txt", "utf8");
        fs.writeFileSync("log.txt",ror+'\nError:  name:'+el.name+', id: '+el.id+'\n');
    }
})
fs.writeFileSync(newFileName, JSON.stringify(movies))*/


