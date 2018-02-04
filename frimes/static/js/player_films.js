'use strict'
function createPlayer(data){
    console.log(data)
    function getTime(){
        var id = Cookies.get('uid');
        console.log(id,data.uid)
        if(id==data.uid){
            console.log(Cookies.get('time'))
            return Number(Cookies.get('time'))-10
        }
        else{
            return ''
        }
    }
    var movie = new Vue({
        el:'#movie',
        data:{
            //данные об активном видосе
            time:getTime(),
            movie:data
            
        }
    })
    Cookies.set('uid',data.uid,cookieExp)
}