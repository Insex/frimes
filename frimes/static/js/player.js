'use strict'
const cookieExp = { expires: 60};
//через какое количесвто день истекает кука
function reccomend(data){// функция для рекомендаций
    console.log(data)
    const frameWidth = 25.6;//размер блока в процентах с марджином
    Vue.directive('animate', {//деректива,которая расставляет блоки по умолчанию, и передвигает их анимацией, в зависимости от позицмии в массиве рекомендаций
        bind (el, binding, vnode){
            var index = binding.value;
            el.style.left=(frameWidth*index)+'%';
        },
        update(el, binding, vnode){
            var index = binding.value;
            Velocity(el, { left: (frameWidth*index)+'%' }, 
                    {
                    duration: 550,
                    easing: "ease", 
                    queue: false
            })
        }
    })
    
    function moveArr(arr,index){//функция, которая изменяет позиции элементов массиве рекомендаций
        arr.forEach((el,i)=>{
                el.animPos = el.animPos + index;
        })
        return arr;
    }
                    
    var reccomend = new Vue({
        el:'.lastBlock',
        data:{
            frames:data.map((el,i)=> { return {frame:el,animPos:i} })//сздаём массив реккомендаций по умолчанию
        },
        methods:{
            framesBack(){//передвигаем вперед
                console.log(this.frames.length);
                if(this.frames[0].animPos>=0)return;
                this.frames =  moveArr(this.frames,1);
            },
            framesForward(){//передвигаем назад
                console.log(this.frames.length);
                if(this.frames[this.frames.length-1].animPos<=3)return;
                this.frames =  moveArr(this.frames,-1);
            }
        }
    });
}
(function(){// отслеживаем время серии в собственной области видимости, на закрытии страницы, оставляем время в куках
var time=0;
 window.addEventListener('unload', function(event) {
     console.log('xuy')
    Cookies.set('time',time>10?time-10:time,cookieExp);
 })
function mwPlayerMessageReceive(event) {
    
    if (event.data && event.data.message == 'MW_PLAYER_TIME_UPDATE') {
        console.log(event.data.value);
        time=event.data.value;
    }
    
  }
    
    if (window.addEventListener) {
      window.addEventListener('message', mwPlayerMessageReceive);
    } 
    else {
      window.attachEvent('onmessage', mwPlayerMessageReceive);
    }
    
})()