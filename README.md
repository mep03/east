# shorten

## Render

`Dashboard` [Click Me](https://dashboard.render.com/ "Click Me")

### Build

```
Root Directory = .
Build Command = yarn && yarn build
Start Command = node dist/app.js
```

`and`

### Environment Variables

```
PORT=
MONGODB_URI=
PUBLIC_URI=
API_KEY=
MAIL_FROM=
MAIL_USER=
MAIL_PASSWORD=
```

## Nginx

```
sudo apt-get update
sudo apt-get install nginx
sudo apt-get install nginx-extras
sudo apt-get install screen
```

### Option White label

```
sudo nano /etc/nginx/nginx.conf
server_tokens off;    # removed pound sign
more_set_headers "Server: tomorowland";
```

## NodeJS

```
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```

## Cache

```
sudo mkdir -p /var/cache/nginx
sudo chown -R www-data:www-data /var/cache/nginx
sudo chmod -R 755 /var/cache/nginx
```

## proxy_pass

### add to top http server block default nginx.conf

```
##
# Cache
##

proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=cache:8m max_size=100m inactive=60m use_temp_path=off;
proxy_cache_key "$scheme$request_method$host$request_uri";
proxy_cache_valid 200 302 60m;
proxy_cache_valid 404 1m;
```

### Port 80

```
server {
    listen 80;
    server_name your_domain;

    location / {
        return 301 https://$host$request_uri;
    }
}
```

### Port 443

```
server {
    listen 443 ssl;
    server_name your_domain;

    ssl_certificate /etc/ssl/host/fullcert.crt;    # path of ssl crt
    ssl_certificate_key /etc/ssl/host/cert.key;    # path of ssl key

    access_log /var/log/nginx/domain.com_access.log;
    error_log /var/log/nginx/domain.com_error.log;

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache cache;
        add_header X-Proxy-Cache $upstream_cache_status;
        proxy_ignore_headers Cache-Control;
        proxy_hide_header Cache-Control;
        expires 60m;
        proxy_pass http://localhost:3000;
    }
}
```

## Running

```
screen + space + space    # (if you just installed screen or just used it)
npm install -g yarn
yarn
yarn dev
CTRL + A and D    # (to save the session screen to keep running in the background)
```
