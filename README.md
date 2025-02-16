# movie-rankings 
## 全球票房排行榜（TOP-30）


通过 cursor 纯 AI 生成的全球票房排行榜（top30），5s刷新一次，主要关注**哪吒2**票房。


主要通过猫眼的API获取票房数据。

### 效果如图：

PC 端：![PC端口](https://github.com/user-attachments/assets/32df9c82-2650-4771-8133-41c6e80a7a0a)

移动端：![手机端](https://github.com/user-attachments/assets/16db69f5-5d66-4186-9a40-5273856d191a)



### 配置：
涉及到猫眼接口需要在 nginx 中配置反向代理，示例：
> 需在国内服务器运行，测试香港或国外服务器请求时会报未认证。


```conf
server {
    listen 80;        
    server_name yourdomain.com; 
    index index.php index.html index.htm default.php default.htm default.html; 
    # API 代理
    location /api/boxoffice {
        proxy_pass https://piaofang.maoyan.com/i/api/rank/globalBox/historyRankList?WuKongReady=h5; 
        # 基本请求头
        proxy_set_header Host 'piaofang.maoyan.com'; 
        proxy_set_header Connection 'keep-alive'; 
        proxy_set_header Pragma 'no-cache'; 
        proxy_set_header Cache-Control 'no-cache'; 
        proxy_set_header User-Agent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'; 
    }
    # 其他路由
    location / {
        try_files $uri $uri/ /index.html; 
    }
    proxy_set_header Host $host; 
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
    proxy_set_header X-Forwarded-Host $server_name; 
    proxy_set_header X-Real-IP $remote_addr; 
    proxy_http_version 1.1; 
    proxy_set_header Upgrade $http_upgrade; 
    proxy_set_header Connection $http_connection; 
    access_log /www/sites/movie.iyushuo.cn/log/access.log main; 
    error_log /www/sites/movie.iyushuo.cn/log/error.log; 
    location ^~ /.well-known/acme-challenge {
        allow all; 
        root /usr/share/nginx/html; 
    }
    root /www/sites/movie.iyushuo.cn/index; 
    error_page 404 /404.html; 
}
```
