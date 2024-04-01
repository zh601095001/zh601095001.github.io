# 1.克隆仓库

```sh
git clone https://github.com/trojan-gfw/trojan.git
cd trojan/
```

# 2.编译安装

## 2.1安装编译器

```sh
sudo apt update
sudo apt upgrade
sudo apt install build-essential
sudo apt install libboost-all-dev
sudo apt install libssl-dev
sudo apt install libmysqlclient-dev
sudo apt install netcat
```



```sh
mkdir build
cd build/
cmake ..
make
ctest
sudo make install
```

# 3.配置用户

```sh
sudo groupadd certusers
sudo useradd -r -M -G certusers trojan
sudo useradd -r -m -G certusers acme
```

# 4.安装acme.sh

## 4.1相关依赖

```sh
sudo apt install -y socat cron curl
```

## 4.2启动crontab

```sh
sudo systemctl start cron
```

# 5.安装与配置nginx

## 5.1安装nginx

```sh
sudo apt install -y nginx
```

## 5.2配置nginx

1. /etc/nginx/nginx.conf:

```json
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
	worker_connections 768;
	# multi_accept on;
}

http {

	sendfile on;
	tcp_nopush on;
	types_hash_max_size 2048;


	include /etc/nginx/mime.types;
	default_type application/octet-stream;



	ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
	ssl_prefer_server_ciphers on;

	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;



	gzip on;

	include /etc/nginx/conf.d/*.conf;
	include /etc/nginx/sites-enabled/*;
}
```

2. /etc/nginx/sites-enabled/default

```json

# Default server configuration
#
server {
	listen 127.0.0.1:6000;

	root /var/www/html;

	# Add index.php to the list if you are using PHP
	index index.html index.htm index.nginx-debian.html;

	server_name _;

	location / {
		# First attempt to serve request as file, then
		# as directory, then fall back to displaying a 404.
		try_files $uri $uri/ $uri.html /index.html;
	}

	location ~* \.(css|js|jpg|jpeg|png|svg|woff|woff2|ttf|eot)$ {
        	try_files $uri =404;
   	 }
}

```

3./etc/nginx/site-enabled/redirect.conf

```json
server {
    listen 80;
    server_name _; # 通配符，匹配所有域名

    location / {
        return 301 https://cuddlebugs.asia$request_uri; # 重定向到HTTPS端口443
    }
}
```

注意：需要`sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/`的形式将sites-available中的配置链接到sites-enabled中方便维护

# 6.证书配置

## 6.1创建证书文件夹

```sh
sudo mkdir /usr/local/etc/certfiles

sudo chown -R acme:acme /usr/local/etc/certfiles
```

## 6.2安装acme

分别执行如下命令，注意看是否报错。第一条命令切换到用户acme。第二条命令安装acme.sh。第三条命令退出当前用户。第四条命令再次切换到用户acme。注意到这里两次切换用户的操作不能省略，因为安装完acme.sh之后要重新登录当前用户，否则无法识别出acme.sh命令。

```sh
sudo su -l -s /bin/bash acme

curl  https://get.acme.sh | sh
exit

sudo su -l -s /bin/bash acme
```

## 6.3添加Cloudflare Global CA Key

```sh
export CF_Key="<Your Global API Key>"
export CF_Email="<Your cloudflare account Email>"
```

## 6.4申请证书

```sh
acme.sh --register-account -m <email address>
acme.sh --issue --dns dns_cf -d <your domain>
```

## 6.5安装证书

```sh
acme.sh --install-cert -d <your domian> --key-file /usr/local/etc/certfiles/private.key --fullchain-file /usr/local/etc/certfiles/certificate.crt

# 证书自动更新
acme.sh  --upgrade  --auto-upgrade
```

## 6.6修改权限

最后还要允许组内用户访问证书。可通过如下命令实现。第一条命令将证书文件夹所在用户组改为certusers。第二条命令是赋予证书文件夹组内用户读取权限。运行这两条命令之后用户trojan就有权限读取证书了。第三条命令退出用户acme，因为证书已经安装完成。

```sh
chown -R acme:certusers /usr/local/etc/certfiles
chmod -R 750 /usr/local/etc/certfiles
exit
```

# 7.配置trojan

```sh
# 将Trojan配置文件的所有者修改为用户trojan
sudo chown -R trojan:trojan /usr/local/etc/trojan
sudo cp /usr/local/etc/trojan/config.json /usr/local/etc/trojan/config.json.bak
sudo vim /usr/local/etc/trojan/config.json
```

修改配置文件为：

```json

{
    "run_type": "server",
    "local_addr": "0.0.0.0",
    "local_port": 443,
    "remote_addr": "127.0.0.1",
    "remote_port": 6000,
    "password": [
        "xxx"
    ],
    "log_level": 1,
    "ssl": {
        "cert": "/usr/local/etc/certfiles/certificate.crt",
        "key": "/usr/local/etc/certfiles/private.key",
        "key_password": "",
        "cipher": "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384",
        "cipher_tls13": "TLS_AES_128_GCM_SHA256:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_256_GCM_SHA384",
        "prefer_server_cipher": true,
        "alpn": [
            "http/1.1"
        ],
        "alpn_port_override": {
            "h2": 81
        },
        "reuse_session": true,
        "session_ticket": false,
        "session_timeout": 600,
        "plain_http_response": "",
        "curves": "",
        "dhparam": ""
    },
    "tcp": {
        "prefer_ipv4": false,
        "no_delay": true,
        "keep_alive": true,
        "reuse_port": false,
        "fast_open": false,
        "fast_open_qlen": 20
    },
    "mysql": {
        "enabled": false,
        "server_addr": "127.0.0.1",
        "server_port": 3306,
        "database": "trojan",
        "username": "trojan",
        "password": "",
        "key": "",
        "cert": "",
        "ca": ""
    }
}
```

配置trojan.service:

```
[Unit]
Description=trojan
After=network.target network-online.target nss-lookup.target mysql.service mariadb.service mysqld.service

[Service]
Type=simple
StandardError=journal
User=trojan
ExecStart="/usr/local/bin/trojan" "/usr/local/etc/trojan/config.json"
ExecReload=/bin/kill -HUP $MAINPID

[Install]
WantedBy=multi-user.target                          
```

重新加载配置：

```sh
sudo systemctl daemon-reload
```

配置用户trojan允许监听443：

执行如下命令，赋予Trojan监听1024以下端口的能力，使得Trojan可以监听到443端口。这是由于我们使用非root用户启动Trojan，但是Linux默认不允许非root用户启动的进程监听1024以下的端口，除非为每一个二进制文件显式声明。

```sh
sudo setcap CAP_NET_BIND_SERVICE=+eip /usr/local/bin/trojan
```



设置trojan自动加载证书和私钥：

首先，编辑用户trojan的crontab文件

```sh
sudo -u trojan crontab -e
```

在文件末尾添加一行如下，该行表示每个月1号的时候运行命令killall -s SIGUSR1 trojan，由于是使用用户trojan运行的，故不需要在前面加sudo -u trojan。

```sh
0 0 1 * * killall -s SIGUSR1 trojan
```

最后查看crontab是否生效。

```sh
sudo -u trojan crontab -l
```

# 8.配置开机自启动

```sh
sudo systemctl enable trojan
sudo systemctl enable nginx
```

# 9.配置bbr

bbr是谷歌开发的网络控制算法，可以加快访问速度。

## 9.1查看是否开启

```sh
sudo sysctl net.ipv4.tcp_congestion_control
```

## 9.2开启命令

```sh
sudo bash -c 'echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf'
sudo bash -c 'echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf'
sudo sysctl -p
```

# 10.配置防火墙

## 10.1安装防火墙

```sh
sudo apt install -y ufw
```

## 10.2启动防火墙

```sh
sudo ufw disable
sudo ufw allow ssh
sudo ufw allow https
sudo ufw allow http
sudo ufw enable
```

## 10.3查看防火墙状态

```sh
sudo ufw status
sudo ufw status verbose
```

# 11.客户端clash配置文件

```yaml
# Clash 配置文件示例
port: 7890 # HTTP 代理端口
socks-port: 7891 # SOCKS5 代理端口
redir-port: 7892 # 透明代理端口
allow-lan: false
mode: Rule
log-level: info
external-controller: '127.0.0.1:9090'

proxies:
  - name: "USA01"
    type: trojan
    server: your server
    port: 443
    password: your password
    udp: true
    # sni:  # 如果你的服务器需要SNI，请填写，否则可以省略或留空
    # skip-cert-verify: false # 如果你信任你的服务器证书，此项可不用开启

proxy-groups:
  - name: "Proxy"
    type: select
    proxies:
      - "USA01"

rules:
  # 学术
  - DOMAIN-SUFFIX,sciencedirect.com,DIRECT
  - DOMAIN-SUFFIX,springer.com,DIRECT
  - DOMAIN-SUFFIX,wiley.com,DIRECT
  - DOMAIN-SUFFIX,tandfonline.com,DIRECT
  - DOMAIN-SUFFIX,ieee.org,DIRECT
  - DOMAIN-SUFFIX,nature.com,DIRECT
  - DOMAIN-SUFFIX,sciencemag.org,DIRECT
  - DOMAIN-SUFFIX,thelancet.com,DIRECT
  - DOMAIN-SUFFIX,nejm.org,DIRECT
  - DOMAIN-SUFFIX,jamanetwork.com,DIRECT
  - DOMAIN-SUFFIX,cell.com,DIRECT
  - DOMAIN-SUFFIX,acs.org,DIRECT
  - DOMAIN-SUFFIX,rsc.org,DIRECT
  - DOMAIN-SUFFIX,iop.org,DIRECT
  - DOMAIN-SUFFIX,elsevier.com,DIRECT
  - DOMAIN-SUFFIX,oup.com,DIRECT
  - DOMAIN-SUFFIX,mdpi.com,DIRECT
  - DOMAIN-SUFFIX,webofknowledge.com,DIRECT
  - DOMAIN-SUFFIX,clarivate.com,DIRECT
  - DOMAIN-SUFFIX,springer.com,DIRECT
  # 其他
  - DOMAIN-SUFFIX,ghcr.io,Proxy
  - DOMAIN-SUFFIX,googleapis.cn,Proxy
  - DOMAIN-KEYWORD,googleapis.cn,Proxy
  - DOMAIN,safebrowsing.urlsec.qq.com,DIRECT
  - DOMAIN,safebrowsing.googleapis.com,DIRECT
  - DOMAIN,ocsp.apple.com,Proxy
  - DOMAIN-SUFFIX,digicert.com,Proxy
  - DOMAIN-SUFFIX,entrust.net,Proxy
  - DOMAIN,ocsp.verisign.net,Proxy
  - DOMAIN-SUFFIX,apps.apple.com,Proxy
  - DOMAIN,itunes.apple.com,Proxy
  - DOMAIN-SUFFIX,blobstore.apple.com,Proxy
  - DOMAIN-SUFFIX,music.apple.com,DIRECT
  - DOMAIN-SUFFIX,mzstatic.com,DIRECT
  - DOMAIN-SUFFIX,itunes.apple.com,DIRECT
  - DOMAIN-SUFFIX,icloud.com,DIRECT
  - DOMAIN-SUFFIX,icloud-content.com,DIRECT
  - DOMAIN-SUFFIX,me.com,DIRECT
  - DOMAIN-SUFFIX,mzstatic.com,DIRECT
  - DOMAIN-SUFFIX,akadns.net,DIRECT
  - DOMAIN-SUFFIX,aaplimg.com,DIRECT
  - DOMAIN-SUFFIX,cdn-apple.com,DIRECT
  - DOMAIN-SUFFIX,apple.com,DIRECT
  - DOMAIN-SUFFIX,apple-cloudkit.com,DIRECT
  - DOMAIN,e.crashlytics.com,REJECT
  - DOMAIN-SUFFIX,cn,DIRECT
  - DOMAIN-KEYWORD,-cn,DIRECT
  - DOMAIN-SUFFIX,126.com,DIRECT
  - DOMAIN-SUFFIX,126.net,DIRECT
  - DOMAIN-SUFFIX,127.net,DIRECT
  - DOMAIN-SUFFIX,163.com,DIRECT
  - DOMAIN-SUFFIX,360buyimg.com,DIRECT
  - DOMAIN-SUFFIX,36kr.com,DIRECT
  - DOMAIN-SUFFIX,acfun.tv,DIRECT
  - DOMAIN-SUFFIX,air-matters.com,DIRECT
  - DOMAIN-SUFFIX,aixifan.com,DIRECT
  - DOMAIN-SUFFIX,akamaized.net,DIRECT
  - DOMAIN-KEYWORD,alicdn,DIRECT
  - DOMAIN-KEYWORD,alipay,DIRECT
  - DOMAIN-KEYWORD,taobao,DIRECT
  - DOMAIN-SUFFIX,amap.com,DIRECT
  - DOMAIN-SUFFIX,autonavi.com,DIRECT
  - DOMAIN-KEYWORD,baidu,DIRECT
  - DOMAIN-SUFFIX,bdimg.com,DIRECT
  - DOMAIN-SUFFIX,bdstatic.com,DIRECT
  - DOMAIN-SUFFIX,bilibili.com,DIRECT
  - DOMAIN-SUFFIX,bilivideo.com,DIRECT
  - DOMAIN-SUFFIX,caiyunapp.com,DIRECT
  - DOMAIN-SUFFIX,clouddn.com,DIRECT
  - DOMAIN-SUFFIX,cnbeta.com,DIRECT
  - DOMAIN-SUFFIX,cnbetacdn.com,DIRECT
  - DOMAIN-SUFFIX,cootekservice.com,DIRECT
  - DOMAIN-SUFFIX,csdn.net,DIRECT
  - DOMAIN-SUFFIX,ctrip.com,DIRECT
  - DOMAIN-SUFFIX,dgtle.com,DIRECT
  - DOMAIN-SUFFIX,dianping.com,DIRECT
  - DOMAIN-SUFFIX,douban.com,DIRECT
  - DOMAIN-SUFFIX,doubanio.com,DIRECT
  - DOMAIN-SUFFIX,duokan.com,DIRECT
  - DOMAIN-SUFFIX,easou.com,DIRECT
  - DOMAIN-SUFFIX,ele.me,DIRECT
  - DOMAIN-SUFFIX,feng.com,DIRECT
  - DOMAIN-SUFFIX,fir.im,DIRECT
  - DOMAIN-SUFFIX,frdic.com,DIRECT
  - DOMAIN-SUFFIX,g-cores.com,DIRECT
  - DOMAIN-SUFFIX,godic.net,DIRECT
  - DOMAIN-SUFFIX,gtimg.com,DIRECT
  - DOMAIN,cdn.hockeyapp.net,DIRECT
  - DOMAIN-SUFFIX,hongxiu.com,DIRECT
  - DOMAIN-SUFFIX,hxcdn.net,DIRECT
  - DOMAIN-SUFFIX,iciba.com,DIRECT
  - DOMAIN-SUFFIX,ifeng.com,DIRECT
  - DOMAIN-SUFFIX,ifengimg.com,DIRECT
  - DOMAIN-SUFFIX,ipip.net,DIRECT
  - DOMAIN-SUFFIX,iqiyi.com,DIRECT
  - DOMAIN-SUFFIX,jd.com,DIRECT
  - DOMAIN-SUFFIX,jianshu.com,DIRECT
  - DOMAIN-SUFFIX,knewone.com,DIRECT
  - DOMAIN-SUFFIX,le.com,DIRECT
  - DOMAIN-SUFFIX,lecloud.com,DIRECT
  - DOMAIN-SUFFIX,lemicp.com,DIRECT
  - DOMAIN-SUFFIX,licdn.com,DIRECT
  - DOMAIN-SUFFIX,linkedin.com,Proxy
  - DOMAIN-SUFFIX,luoo.net,DIRECT
  - DOMAIN-SUFFIX,meituan.com,DIRECT
  - DOMAIN-SUFFIX,meituan.net,DIRECT
  - DOMAIN-SUFFIX,mi.com,DIRECT
  - DOMAIN-SUFFIX,miaopai.com,DIRECT
  - DOMAIN-SUFFIX,microsoft.com,DIRECT
  - DOMAIN-SUFFIX,microsoftonline.com,DIRECT
  - DOMAIN-SUFFIX,miui.com,DIRECT
  - DOMAIN-SUFFIX,miwifi.com,DIRECT
  - DOMAIN-SUFFIX,mob.com,DIRECT
  - DOMAIN-SUFFIX,netease.com,DIRECT
  - DOMAIN-SUFFIX,office.com,DIRECT
  - DOMAIN-SUFFIX,office365.com,DIRECT
  - DOMAIN-KEYWORD,officecdn,DIRECT
  - DOMAIN-SUFFIX,oschina.net,DIRECT
  - DOMAIN-SUFFIX,ppsimg.com,DIRECT
  - DOMAIN-SUFFIX,pstatp.com,DIRECT
  - DOMAIN-SUFFIX,qcloud.com,DIRECT
  - DOMAIN-SUFFIX,qdaily.com,DIRECT
  - DOMAIN-SUFFIX,qdmm.com,DIRECT
  - DOMAIN-SUFFIX,qhimg.com,DIRECT
  - DOMAIN-SUFFIX,qhres.com,DIRECT
  - DOMAIN-SUFFIX,qidian.com,DIRECT
  - DOMAIN-SUFFIX,qihucdn.com,DIRECT
  - DOMAIN-SUFFIX,qiniu.com,DIRECT
  - DOMAIN-SUFFIX,qiniucdn.com,DIRECT
  - DOMAIN-SUFFIX,qiyipic.com,DIRECT
  - DOMAIN-SUFFIX,qq.com,DIRECT
  - DOMAIN-SUFFIX,qqurl.com,DIRECT
  - DOMAIN-SUFFIX,rarbg.to,DIRECT
  - DOMAIN-SUFFIX,ruguoapp.com,DIRECT
  - DOMAIN-SUFFIX,segmentfault.com,DIRECT
  - DOMAIN-SUFFIX,sinaapp.com,DIRECT
  - DOMAIN-SUFFIX,smzdm.com,DIRECT
  - DOMAIN-SUFFIX,snapdrop.net,DIRECT
  - DOMAIN-SUFFIX,sogou.com,DIRECT
  - DOMAIN-SUFFIX,sogoucdn.com,DIRECT
  - DOMAIN-SUFFIX,sohu.com,DIRECT
  - DOMAIN-SUFFIX,soku.com,DIRECT
  - DOMAIN-SUFFIX,speedtest.net,DIRECT
  - DOMAIN-SUFFIX,sspai.com,DIRECT
  - DOMAIN-SUFFIX,suning.com,DIRECT
  - DOMAIN-SUFFIX,taobao.com,DIRECT
  - DOMAIN-SUFFIX,tencent.com,DIRECT
  - DOMAIN-SUFFIX,tenpay.com,DIRECT
  - DOMAIN-SUFFIX,tianyancha.com,DIRECT
  - DOMAIN-SUFFIX,tmall.com,DIRECT
  - DOMAIN-SUFFIX,tudou.com,DIRECT
  - DOMAIN-SUFFIX,umetrip.com,DIRECT
  - DOMAIN-SUFFIX,upaiyun.com,DIRECT
  - DOMAIN-SUFFIX,upyun.com,DIRECT
  - DOMAIN-SUFFIX,veryzhun.com,DIRECT
  - DOMAIN-SUFFIX,weather.com,DIRECT
  - DOMAIN-SUFFIX,weibo.com,DIRECT
  - DOMAIN-SUFFIX,xiami.com,DIRECT
  - DOMAIN-SUFFIX,xiami.net,DIRECT
  - DOMAIN-SUFFIX,xiaomicp.com,DIRECT
  - DOMAIN-SUFFIX,ximalaya.com,DIRECT
  - DOMAIN-SUFFIX,xmcdn.com,DIRECT
  - DOMAIN-SUFFIX,xunlei.com,DIRECT
  - DOMAIN-SUFFIX,yhd.com,DIRECT
  - DOMAIN-SUFFIX,yihaodianimg.com,DIRECT
  - DOMAIN-SUFFIX,yinxiang.com,DIRECT
  - DOMAIN-SUFFIX,ykimg.com,DIRECT
  - DOMAIN-SUFFIX,youdao.com,DIRECT
  - DOMAIN-SUFFIX,youku.com,DIRECT
  - DOMAIN-SUFFIX,zealer.com,DIRECT
  - DOMAIN-SUFFIX,zhihu.com,DIRECT
  - DOMAIN-SUFFIX,zhimg.com,DIRECT
  - DOMAIN-SUFFIX,zimuzu.tv,DIRECT
  - DOMAIN-SUFFIX,zoho.com,DIRECT
  - DOMAIN-KEYWORD,amazon,Proxy
  - DOMAIN-KEYWORD,google,Proxy
  - DOMAIN-KEYWORD,gmail,Proxy
  - DOMAIN-KEYWORD,youtube,Proxy
  - DOMAIN-KEYWORD,facebook,Proxy
  - DOMAIN-SUFFIX,fb.me,Proxy
  - DOMAIN-SUFFIX,fbcdn.net,Proxy
  - DOMAIN-KEYWORD,twitter,Proxy
  - DOMAIN-KEYWORD,instagram,Proxy
  - DOMAIN-KEYWORD,dropbox,Proxy
  - DOMAIN-SUFFIX,twimg.com,Proxy
  - DOMAIN-KEYWORD,blogspot,Proxy
  - DOMAIN-SUFFIX,youtu.be,Proxy
  - DOMAIN-KEYWORD,whatsapp,Proxy
  - DOMAIN-KEYWORD,admarvel,REJECT
  - DOMAIN-KEYWORD,admaster,REJECT
  - DOMAIN-KEYWORD,adsage,REJECT
  - DOMAIN-KEYWORD,adsmogo,REJECT
  - DOMAIN-KEYWORD,adsrvmedia,REJECT
  - DOMAIN-KEYWORD,adwords,REJECT
  - DOMAIN-KEYWORD,adservice,REJECT
  - DOMAIN-KEYWORD,domob,REJECT
  - DOMAIN-KEYWORD,duomeng,REJECT
  - DOMAIN-KEYWORD,dwtrack,REJECT
  - DOMAIN-KEYWORD,guanggao,REJECT
  - DOMAIN-KEYWORD,lianmeng,REJECT
  - DOMAIN-SUFFIX,mmstat.com,REJECT
  - DOMAIN-KEYWORD,omgmta,REJECT
  - DOMAIN-KEYWORD,openx,REJECT
  - DOMAIN-KEYWORD,partnerad,REJECT
  - DOMAIN-KEYWORD,pingfore,REJECT
  - DOMAIN-KEYWORD,supersonicads,REJECT
  - DOMAIN-KEYWORD,uedas,REJECT
  - DOMAIN-KEYWORD,umeng,REJECT
  - DOMAIN-KEYWORD,usage,REJECT
  - DOMAIN-KEYWORD,wlmonitor,REJECT
  - DOMAIN-KEYWORD,zjtoolbar,REJECT
  - DOMAIN-SUFFIX,9to5mac.com,Proxy
  - DOMAIN-SUFFIX,abpchina.org,Proxy
  - DOMAIN-SUFFIX,adblockplus.org,Proxy
  - DOMAIN-SUFFIX,adobe.com,Proxy
  - DOMAIN-SUFFIX,alfredapp.com,Proxy
  - DOMAIN-SUFFIX,amplitude.com,Proxy
  - DOMAIN-SUFFIX,ampproject.org,Proxy
  - DOMAIN-SUFFIX,android.com,Proxy
  - DOMAIN-SUFFIX,angularjs.org,Proxy
  - DOMAIN-SUFFIX,aolcdn.com,Proxy
  - DOMAIN-SUFFIX,apkpure.com,Proxy
  - DOMAIN-SUFFIX,appledaily.com,Proxy
  - DOMAIN-SUFFIX,appshopper.com,Proxy
  - DOMAIN-SUFFIX,appspot.com,Proxy
  - DOMAIN-SUFFIX,arcgis.com,Proxy
  - DOMAIN-SUFFIX,archive.org,Proxy
  - DOMAIN-SUFFIX,armorgames.com,Proxy
  - DOMAIN-SUFFIX,aspnetcdn.com,Proxy
  - DOMAIN-SUFFIX,att.com,Proxy
  - DOMAIN-SUFFIX,awsstatic.com,Proxy
  - DOMAIN-SUFFIX,azureedge.net,Proxy
  - DOMAIN-SUFFIX,azurewebsites.net,Proxy
  - DOMAIN-SUFFIX,bing.com,Proxy
  - DOMAIN-SUFFIX,bintray.com,Proxy
  - DOMAIN-SUFFIX,bit.com,Proxy
  - DOMAIN-SUFFIX,bit.ly,Proxy
  - DOMAIN-SUFFIX,bitbucket.org,Proxy
  - DOMAIN-SUFFIX,bjango.com,Proxy
  - DOMAIN-SUFFIX,bkrtx.com,Proxy
  - DOMAIN-SUFFIX,blog.com,Proxy
  - DOMAIN-SUFFIX,blogcdn.com,Proxy
  - DOMAIN-SUFFIX,blogger.com,Proxy
  - DOMAIN-SUFFIX,blogsmithmedia.com,Proxy
  - DOMAIN-SUFFIX,blogspot.com,Proxy
  - DOMAIN-SUFFIX,blogspot.hk,Proxy
  - DOMAIN-SUFFIX,bloomberg.com,Proxy
  - DOMAIN-SUFFIX,box.com,Proxy
  - DOMAIN-SUFFIX,box.net,Proxy
  - DOMAIN-SUFFIX,cachefly.net,Proxy
  - DOMAIN-SUFFIX,chromium.org,Proxy
  - DOMAIN-SUFFIX,cl.ly,Proxy
  - DOMAIN-SUFFIX,cloudflare.com,Proxy
  - DOMAIN-SUFFIX,cloudfront.net,Proxy
  - DOMAIN-SUFFIX,cloudmagic.com,Proxy
  - DOMAIN-SUFFIX,cmail19.com,Proxy
  - DOMAIN-SUFFIX,cnet.com,Proxy
  - DOMAIN-SUFFIX,cocoapods.org,Proxy
  - DOMAIN-SUFFIX,comodoca.com,Proxy
  - DOMAIN-SUFFIX,crashlytics.com,Proxy
  - DOMAIN-SUFFIX,culturedcode.com,Proxy
  - DOMAIN-SUFFIX,d.pr,Proxy
  - DOMAIN-SUFFIX,danilo.to,Proxy
  - DOMAIN-SUFFIX,dayone.me,Proxy
  - DOMAIN-SUFFIX,db.tt,Proxy
  - DOMAIN-SUFFIX,deskconnect.com,Proxy
  - DOMAIN-SUFFIX,disq.us,Proxy
  - DOMAIN-SUFFIX,disqus.com,Proxy
  - DOMAIN-SUFFIX,disquscdn.com,Proxy
  - DOMAIN-SUFFIX,dnsimple.com,Proxy
  - DOMAIN-SUFFIX,docker.com,Proxy
  - DOMAIN-SUFFIX,dribbble.com,Proxy
  - DOMAIN-SUFFIX,droplr.com,Proxy
  - DOMAIN-SUFFIX,duckduckgo.com,Proxy
  - DOMAIN-SUFFIX,dueapp.com,Proxy
  - DOMAIN-SUFFIX,dytt8.net,Proxy
  - DOMAIN-SUFFIX,edgecastcdn.net,Proxy
  - DOMAIN-SUFFIX,edgekey.net,Proxy
  - DOMAIN-SUFFIX,edgesuite.net,Proxy
  - DOMAIN-SUFFIX,engadget.com,Proxy
  - DOMAIN-SUFFIX,entrust.net,Proxy
  - DOMAIN-SUFFIX,eurekavpt.com,Proxy
  - DOMAIN-SUFFIX,evernote.com,Proxy
  - DOMAIN-SUFFIX,fabric.io,Proxy
  - DOMAIN-SUFFIX,fast.com,Proxy
  - DOMAIN-SUFFIX,fastly.net,Proxy
  - DOMAIN-SUFFIX,fc2.com,Proxy
  - DOMAIN-SUFFIX,feedburner.com,Proxy
  - DOMAIN-SUFFIX,feedly.com,Proxy
  - DOMAIN-SUFFIX,feedsportal.com,Proxy
  - DOMAIN-SUFFIX,fiftythree.com,Proxy
  - DOMAIN-SUFFIX,firebaseio.com,Proxy
  - DOMAIN-SUFFIX,flexibits.com,Proxy
  - DOMAIN-SUFFIX,flickr.com,Proxy
  - DOMAIN-SUFFIX,flipboard.com,Proxy
  - DOMAIN-SUFFIX,g.co,Proxy
  - DOMAIN-SUFFIX,gabia.net,Proxy
  - DOMAIN-SUFFIX,geni.us,Proxy
  - DOMAIN-SUFFIX,gfx.ms,Proxy
  - DOMAIN-SUFFIX,ggpht.com,Proxy
  - DOMAIN-SUFFIX,ghostnoteapp.com,Proxy
  - DOMAIN-SUFFIX,git.io,Proxy
  - DOMAIN-KEYWORD,github,Proxy
  - DOMAIN-SUFFIX,globalsign.com,Proxy
  - DOMAIN-SUFFIX,gmodules.com,Proxy
  - DOMAIN-SUFFIX,godaddy.com,Proxy
  - DOMAIN-SUFFIX,golang.org,Proxy
  - DOMAIN-SUFFIX,gongm.in,Proxy
  - DOMAIN-SUFFIX,goo.gl,Proxy
  - DOMAIN-SUFFIX,goodreaders.com,Proxy
  - DOMAIN-SUFFIX,goodreads.com,Proxy
  - DOMAIN-SUFFIX,gravatar.com,Proxy
  - DOMAIN-SUFFIX,gstatic.com,Proxy
  - DOMAIN-SUFFIX,gvt0.com,Proxy
  - DOMAIN-SUFFIX,hockeyapp.net,Proxy
  - DOMAIN-SUFFIX,hotmail.com,Proxy
  - DOMAIN-SUFFIX,icons8.com,Proxy
  - DOMAIN-SUFFIX,ifixit.com,Proxy
  - DOMAIN-SUFFIX,ift.tt,Proxy
  - DOMAIN-SUFFIX,ifttt.com,Proxy
  - DOMAIN-SUFFIX,iherb.com,Proxy
  - DOMAIN-SUFFIX,imageshack.us,Proxy
  - DOMAIN-SUFFIX,img.ly,Proxy
  - DOMAIN-SUFFIX,imgur.com,Proxy
  - DOMAIN-SUFFIX,imore.com,Proxy
  - DOMAIN-SUFFIX,instapaper.com,Proxy
  - DOMAIN-SUFFIX,ipn.li,Proxy
  - DOMAIN-SUFFIX,is.gd,Proxy
  - DOMAIN-SUFFIX,issuu.com,Proxy
  - DOMAIN-SUFFIX,itgonglun.com,Proxy
  - DOMAIN-SUFFIX,itun.es,Proxy
  - DOMAIN-SUFFIX,ixquick.com,Proxy
  - DOMAIN-SUFFIX,j.mp,Proxy
  - DOMAIN-SUFFIX,js.revsci.net,Proxy
  - DOMAIN-SUFFIX,jshint.com,Proxy
  - DOMAIN-SUFFIX,jtvnw.net,Proxy
  - DOMAIN-SUFFIX,justgetflux.com,Proxy
  - DOMAIN-SUFFIX,kat.cr,Proxy
  - DOMAIN-SUFFIX,klip.me,Proxy
  - DOMAIN-SUFFIX,libsyn.com,Proxy
  - DOMAIN-SUFFIX,linode.com,Proxy
  - DOMAIN-SUFFIX,lithium.com,Proxy
  - DOMAIN-SUFFIX,littlehj.com,Proxy
  - DOMAIN-SUFFIX,live.com,Proxy
  - DOMAIN-SUFFIX,live.net,Proxy
  - DOMAIN-SUFFIX,livefilestore.com,Proxy
  - DOMAIN-SUFFIX,llnwd.net,Proxy
  - DOMAIN-SUFFIX,macid.co,Proxy
  - DOMAIN-SUFFIX,macromedia.com,Proxy
  - DOMAIN-SUFFIX,macrumors.com,Proxy
  - DOMAIN-SUFFIX,mashable.com,Proxy
  - DOMAIN-SUFFIX,mathjax.org,Proxy
  - DOMAIN-SUFFIX,medium.com,Proxy
  - DOMAIN-SUFFIX,mega.co.nz,Proxy
  - DOMAIN-SUFFIX,mega.nz,Proxy
  - DOMAIN-SUFFIX,megaupload.com,Proxy
  - DOMAIN-SUFFIX,microsofttranslator.com,Proxy
  - DOMAIN-SUFFIX,mindnode.com,Proxy
  - DOMAIN-SUFFIX,mobile01.com,Proxy
  - DOMAIN-SUFFIX,modmyi.com,Proxy
  - DOMAIN-SUFFIX,msedge.net,Proxy
  - DOMAIN-SUFFIX,myfontastic.com,Proxy
  - DOMAIN-SUFFIX,name.com,Proxy
  - DOMAIN-SUFFIX,nextmedia.com,Proxy
  - DOMAIN-SUFFIX,nsstatic.net,Proxy
  - DOMAIN-SUFFIX,nssurge.com,Proxy
  - DOMAIN-SUFFIX,nyt.com,Proxy
  - DOMAIN-SUFFIX,nytimes.com,Proxy
  - DOMAIN-SUFFIX,omnigroup.com,Proxy
  - DOMAIN-SUFFIX,onedrive.com,Proxy
  - DOMAIN-SUFFIX,onenote.com,Proxy
  - DOMAIN-SUFFIX,ooyala.com,Proxy
  - DOMAIN-SUFFIX,openvpn.net,Proxy
  - DOMAIN-SUFFIX,openwrt.org,Proxy
  - DOMAIN-SUFFIX,orkut.com,Proxy
  - DOMAIN-SUFFIX,osxdaily.com,Proxy
  - DOMAIN-SUFFIX,outlook.com,Proxy
  - DOMAIN-SUFFIX,ow.ly,Proxy
  - DOMAIN-SUFFIX,paddleapi.com,Proxy
  - DOMAIN-SUFFIX,parallels.com,Proxy
  - DOMAIN-SUFFIX,parse.com,Proxy
  - DOMAIN-SUFFIX,pdfexpert.com,Proxy
  - DOMAIN-SUFFIX,periscope.tv,Proxy
  - DOMAIN-SUFFIX,pinboard.in,Proxy
  - DOMAIN-SUFFIX,pinterest.com,Proxy
  - DOMAIN-SUFFIX,pixelmator.com,Proxy
  - DOMAIN-SUFFIX,pixiv.net,Proxy
  - DOMAIN-SUFFIX,playpcesor.com,Proxy
  - DOMAIN-SUFFIX,playstation.com,Proxy
  - DOMAIN-SUFFIX,playstation.com.hk,Proxy
  - DOMAIN-SUFFIX,playstation.net,Proxy
  - DOMAIN-SUFFIX,playstationnetwork.com,Proxy
  - DOMAIN-SUFFIX,pushwoosh.com,Proxy
  - DOMAIN-SUFFIX,rime.im,Proxy
  - DOMAIN-SUFFIX,servebom.com,Proxy
  - DOMAIN-SUFFIX,sfx.ms,Proxy
  - DOMAIN-SUFFIX,shadowsocks.org,Proxy
  - DOMAIN-SUFFIX,sharethis.com,Proxy
  - DOMAIN-SUFFIX,shazam.com,Proxy
  - DOMAIN-SUFFIX,skype.com,Proxy
  - DOMAIN-SUFFIX,smartdnsProxy.com,Proxy
  - DOMAIN-SUFFIX,smartmailcloud.com,Proxy
  - DOMAIN-SUFFIX,sndcdn.com,Proxy
  - DOMAIN-SUFFIX,sony.com,Proxy
  - DOMAIN-SUFFIX,soundcloud.com,Proxy
  - DOMAIN-SUFFIX,sourceforge.net,Proxy
  - DOMAIN-SUFFIX,spotify.com,Proxy
  - DOMAIN-SUFFIX,squarespace.com,Proxy
  - DOMAIN-SUFFIX,sstatic.net,Proxy
  - DOMAIN-SUFFIX,st.luluku.pw,Proxy
  - DOMAIN-SUFFIX,stackoverflow.com,Proxy
  - DOMAIN-SUFFIX,startpage.com,Proxy
  - DOMAIN-SUFFIX,staticflickr.com,Proxy
  - DOMAIN-SUFFIX,steamcommunity.com,Proxy
  - DOMAIN-SUFFIX,symauth.com,Proxy
  - DOMAIN-SUFFIX,symcb.com,Proxy
  - DOMAIN-SUFFIX,symcd.com,Proxy
  - DOMAIN-SUFFIX,tapbots.com,Proxy
  - DOMAIN-SUFFIX,tapbots.net,Proxy
  - DOMAIN-SUFFIX,tdesktop.com,Proxy
  - DOMAIN-SUFFIX,techcrunch.com,Proxy
  - DOMAIN-SUFFIX,techsmith.com,Proxy
  - DOMAIN-SUFFIX,thepiratebay.org,Proxy
  - DOMAIN-SUFFIX,theverge.com,Proxy
  - DOMAIN-SUFFIX,time.com,Proxy
  - DOMAIN-SUFFIX,timeinc.net,Proxy
  - DOMAIN-SUFFIX,tiny.cc,Proxy
  - DOMAIN-SUFFIX,tinypic.com,Proxy
  - DOMAIN-SUFFIX,tmblr.co,Proxy
  - DOMAIN-SUFFIX,todoist.com,Proxy
  - DOMAIN-SUFFIX,trello.com,Proxy
  - DOMAIN-SUFFIX,trustasiassl.com,Proxy
  - DOMAIN-SUFFIX,tumblr.co,Proxy
  - DOMAIN-SUFFIX,tumblr.com,Proxy
  - DOMAIN-SUFFIX,tweetdeck.com,Proxy
  - DOMAIN-SUFFIX,tweetmarker.net,Proxy
  - DOMAIN-SUFFIX,twitch.tv,Proxy
  - DOMAIN-SUFFIX,txmblr.com,Proxy
  - DOMAIN-SUFFIX,typekit.net,Proxy
  - DOMAIN-SUFFIX,ubertags.com,Proxy
  - DOMAIN-SUFFIX,ublock.org,Proxy
  - DOMAIN-SUFFIX,ubnt.com,Proxy
  - DOMAIN-SUFFIX,ulyssesapp.com,Proxy
  - DOMAIN-SUFFIX,urchin.com,Proxy
  - DOMAIN-SUFFIX,usertrust.com,Proxy
  - DOMAIN-SUFFIX,v.gd,Proxy
  - DOMAIN-SUFFIX,v2ex.com,Proxy
  - DOMAIN-SUFFIX,vimeo.com,Proxy
  - DOMAIN-SUFFIX,vimeocdn.com,Proxy
  - DOMAIN-SUFFIX,vine.co,Proxy
  - DOMAIN-SUFFIX,vivaldi.com,Proxy
  - DOMAIN-SUFFIX,vox-cdn.com,Proxy
  - DOMAIN-SUFFIX,vsco.co,Proxy
  - DOMAIN-SUFFIX,vultr.com,Proxy
  - DOMAIN-SUFFIX,w.org,Proxy
  - DOMAIN-SUFFIX,w3schools.com,Proxy
  - DOMAIN-SUFFIX,webtype.com,Proxy
  - DOMAIN-SUFFIX,wikiwand.com,Proxy
  - DOMAIN-SUFFIX,wikileaks.org,Proxy
  - DOMAIN-SUFFIX,wikimedia.org,Proxy
  - DOMAIN-SUFFIX,wikipedia.com,Proxy
  - DOMAIN-SUFFIX,wikipedia.org,Proxy
  - DOMAIN-SUFFIX,windows.com,Proxy
  - DOMAIN-SUFFIX,windows.net,Proxy
  - DOMAIN-SUFFIX,wire.com,Proxy
  - DOMAIN-SUFFIX,wordpress.com,Proxy
  - DOMAIN-SUFFIX,workflowy.com,Proxy
  - DOMAIN-SUFFIX,wp.com,Proxy
  - DOMAIN-SUFFIX,wsj.com,Proxy
  - DOMAIN-SUFFIX,wsj.net,Proxy
  - DOMAIN-SUFFIX,xda-developers.com,Proxy
  - DOMAIN-SUFFIX,xeeno.com,Proxy
  - DOMAIN-SUFFIX,xiti.com,Proxy
  - DOMAIN-SUFFIX,yahoo.com,Proxy
  - DOMAIN-SUFFIX,yimg.com,Proxy
  - DOMAIN-SUFFIX,ying.com,Proxy
  - DOMAIN-SUFFIX,yoyo.org,Proxy
  - DOMAIN-SUFFIX,ytimg.com,Proxy
  - DOMAIN-SUFFIX,telegra.ph,Proxy
  - DOMAIN-SUFFIX,telegram.org,Proxy
  - IP-CIDR,91.108.4.0/22,Proxy,no-resolve
  - IP-CIDR,91.108.8.0/22,Proxy,no-resolve
  - IP-CIDR,91.108.12.0/22,Proxy,no-resolve
  - IP-CIDR,91.108.16.0/22,Proxy,no-resolve
  - IP-CIDR,91.108.56.0/22,Proxy,no-resolve
  - IP-CIDR,149.154.160.0/22,Proxy,no-resolve
  - IP-CIDR,149.154.164.0/22,Proxy,no-resolve
  - IP-CIDR,149.154.168.0/22,Proxy,no-resolve
  - IP-CIDR,149.154.172.0/22,Proxy,no-resolve
  - DOMAIN-SUFFIX,local,DIRECT
  - IP-CIDR,127.0.0.0/8,DIRECT
  - IP-CIDR,172.16.0.0/12,DIRECT
  - IP-CIDR,192.168.0.0/16,DIRECT
  - IP-CIDR,10.0.0.0/8,DIRECT
  - IP-CIDR,17.0.0.0/8,DIRECT
  - IP-CIDR,100.64.0.0/10,DIRECT
  - GEOIP,CN,DIRECT
  - MATCH,Proxy

```
