FROM nginx
COPY ./default /etc/nginx/sites-available/default
COPY ./default /etc/nginx/sites-enabled/default

RUN unlink /etc/nginx/sites-enabled/default

COPY ./reverse-proxy.conf /etc/nginx/sites-available/reverse-proxy.conf 
COPY ./reverse-proxy.conf /etc/nginx/sites-enabled/reverse-proxy.conf

