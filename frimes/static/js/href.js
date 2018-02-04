        
        function url (el, binding, vnode) {
                    el.onclick=()=>{
                        window.location=binding.value;
                }
        }
        Vue.directive('url', {//деректива для замены ссылок
            bind: url,
            update:url
        })