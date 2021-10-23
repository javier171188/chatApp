# chatApp
This is a web app in which a user can add contacts, chat in one to one conversations and chat in group rooms. To use the app it is necessary to register by giving a user name,  email, password and, optionally, an avatar picture.
## Setup
The app is formed by 4 services:  users, chats, notifications, and client. The services are (will be) mounted in their own docker container and the communication is through an Nginx proxy service. 

![Diagram](./chatAV1.png) {:height="36px"
### Required Technologies (so far)
* Chats:
	- node
	- express: ^4.17.1
	- mongoose: ^6.0.7
	- socket.io: ^4.2.0
* Users:
	- bcryptjs: ^2.4.3
	- express: ^4.17.1
	- express-session: ^1.17.2
	- jsonwebtoken: ^8.5.1
	- mongoose: ^5.13.7
	- multer: ^1.4.3
	- passport: ^0.4.1
	- passport-local: ^1.0.0
	- sharp: ^0.29.0
	- validator: ^13.6.0
* Client:
	-	axios: ^0.21.1
	-	multer: ^1.4.3
	-	react: ^17.0.2
	-	react-dom: ^17.0.2
	-	react-flash-message: ^1.0.7
	-	react-hook-form: ^7.13.0 (I think I am not using this)
	-	react-router-dom: ^5.2.0
	-	socket.io-client: ^4.2.0

### Nginx
In the file /etc/nginx/sites-available/default, after 
```
server_name _;

	location / {
		# First attempt to serve request as file, then
		# as directory, then fall back to displaying a 404.
		try_files $uri $uri/ =404;
	}
```
add the following

```

	location ~ \.s?css$ {
		proxy_pass http://client-service:1234;
	}

	location ~ \.png$ {
                proxy_pass http://client-service:1234;
        }


	location ~ \.map$ {
		proxy_pass http://client-service:1234;
	}

	location ~ \.jsx?$ {
		proxy_pass http://client-service:1234;
	}
	
	location ~ \/chat\/.* {
		proxy_pass http://client-service:1234;
	}

	location ~ \/users\/.* {
		proxy_pass http://chats-service:3000;
	}

	location ~ \/chats\/.* {
                proxy_pass http://chats-service:3001;
        }

	#location ~ \/socket\.io\/.* {
        #        proxy_pass http://chats-service:3001;
        #}

	location /mysocket/ {
     		proxy_pass http://chats-service:3001; 
      		proxy_http_version 1.1;
      		proxy_set_header Upgrade $http_upgrade;
      		proxy_set_header Connection 'upgrade';
      		proxy_set_header Host $host;
      		proxy_cache_bypass $http_upgrade;
    	} 

```

### Deployment in kubernetes
For deployment in kubernetes, the nginx container copy the following files
```
COPY ./proxy.conf /etc/nginx/sites-available/proxy.conf 
COPY ./proxy.conf /etc/nginx/sites-enabled/proxy.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
```
that should set the configuration for nginx.

The services have their yaml files to set up the deployment and the services
- Users: userdb.yaml, user.yaml
- Chats: chatsdb.yaml, chats.yaml
- Nginx: proxy.yaml
- client: client. yaml

To set the configuration execute with kubectl:
```kubectl apply -f file.yaml```

There is also a file chat.yaml in the root folder. You can start all the services by
```kubectl apply -f chat.yaml```
however the address for the proxy service is not set automatically, and you have to set it manually.

### Environment Variables
- For the client service: 
		- SOCKET_ENDPOINT=http://proxy-service:80 
		- SOCKET_PATH=/mysocket
		- USER_PATH=http://proxy-service:80/users 

- For the user service:\
		- PORT=3000\
		- SECRET_SIGN=secretsign\
		- DB_URL=mongodb://userdb-service.1:27017\
		- DB_NAME=users-chat\

- For the chats service: 
		- PORT=3001
		- DB_URL=mongodb://chatsdb-service:27017
		- DB_NAME=chats-chat

 ### Ports
 - 3000: Service users.
 - 3001: Service chats.
 - 1234: Service client.