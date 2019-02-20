const verson = "verson1.0"
const cacheName = `${verson}-cache` 

// 离线优先,适用于很久不更新的门户类网站

// 静态资源目录
const manifest = {
    "app.css": "/assets/css/app.f68955df.bundle.css",
    "app.js": "/assets/js/app.081afff0.bundle.js",
    "assets/img/avatar.jpg": "/assets/img/avatar.562f81e3.jpg",
    "vendors~app.js": "/assets/js/vendors~app.6f4540e5.bundle.js"
}


// 安装事件
self.addEventListener("install",function(event){
    // 接受promise 
    // 确保 Service Worker 不会在 waitUntil() 里面的代码执行完毕之前安装完成
    event.waitUntil(
        caches.open(cacheName).then((cache)=>{
            console.log(cache)
            // 缓存静态资源
            return cache.addAll(
                Object.values(manifest)
            )
        })

    )
})


// 自定义请求响应

self.addEventListener('fetch',function(event){
    console.log(caches)
    event.respondWith(
        
        caches.open(cacheName).then(cache => {

            return cache.match(event.requset).then((response)=>{
                
                // 匹配到了缓存 
    
                // 如果匹配到了缓存 && 缓存是静态资源 则返回
                // install 下安眠的缓存匹配不到
                console.log(event.request,"这是我的request")
                console.log(response)
                if(response){
                    console.log(response,"匹配到了缓存！")
                    return response
                }
    
                // 缓存不存在  
                // 否则发起 fetch请求 
                
                return fetch(event.request.clone()).then((res)=>{
                    console.log("没有找到缓存，发起请求")
                    // 请求失败 判断有没有缓存
                    // if (!res || res.status !== 200){
                    //     // response || new Response(...)
                    //     return new Response(`
                    //         <div>请求出错咯!!!!</div>
                    //     `)
                    // }
                    // 请求成功
                    // 将请求缓存
                    console.log(res)
                    return res
                    // return caches.open(cacheName).then(function (cache) {
                    //     return cache.put(event.request, res);
                    // })
                })
    
            })
        })

    )
})