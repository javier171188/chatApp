FROM nginx
COPY ./default /etc/nginx/sites-available/default
COPY ./default /etc/nginx/sites-enabled/default

# RUN unlink /etc/nginx/sites-enabled/default

COPY ./proxy.conf /etc/nginx/sites-available/proxy.conf 
COPY ./proxy.conf /etc/nginx/sites-enabled/proxy.conf
COPY ./nginx.conf /etc/nginx/nginx.conf