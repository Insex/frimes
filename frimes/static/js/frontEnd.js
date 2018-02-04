'use strict'	
function createHeader(){
Vue.component('my-header', {//элемент хедера в value передаётся значение, в active передаются бкльевая пер. которая показывает, активен ли, что пользователь находится на данной странице 
  template: `<div v-url="'/'+value.url" class="frameWidth mouse" id="animateDad" >
				<div class="center padding">{{value.name}}</div>
				<div  :class="active==value.url?'active':''" id="animateBaby" class="animate" ></div>	
              </div>`,
 props:['value','active']    
})
Vue.component('my-header-new', {//просто new компонент
  template: `<div v-url="'/new'" class="hot frameWidth mouse" id="animateDad" >
                <div class="center padding">
                    <div><img src="img/hot.svg"></div>
                    <span> Новинки</span>
                </div>
                <div :class="active" id="animateBaby" class="animate" ></div>	
             </div>	`,
 props:['active']     
})

new Vue({
        el:'.head-color',
        data:{
            headers:[
                    {name:'Сериалы',url:'series'},
                    {name:'Фильмы',url:'films'},
                    {name:'Мультфильмы',url:'cartoons'},
                    {name:'Аниме',url:'anime'}
            ]
        }
})	

new Vue({//анимация для мобилки, если activeBurger == true, то меню слева появляется
        el:'#header',
        data:{
            activeBurger:false,
            overflow:'auto'
        },
    methods:{
        burger(){
            this.activeBurger=!this.activeBurger;
            document.getElementsByTagName('html')[0].style.overflowY=this.activeBurger
            ?'hidden':'auto';
        }
    }
})		

}