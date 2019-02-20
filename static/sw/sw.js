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
            // 缓存静态资源
            return cache.addAll(
                Object.values(manifest)
            )
        })

    )
})


// 自定义请求响应

self.addEventListener('fetch',function(event){
    event.respondWith(
        caches.match(event.requset).then((response)=>{
            
            // 匹配到了缓存 
            if(response)
                return response

            // 缓存不存在

            return fetch(event.requset).then((res)=>{
                // 请求失败
                if (!res || res.status !== 200){
                    return new Response(`
                        <div>请求出错咯!!!!</div>
                    `)
                }
                // 请求成功
                // 将请求缓存
                caches.open(cacheName).then(function (cache) {
                    cache.put(event.request, responseClone);
                })
                return res
            })

        })

    )
})