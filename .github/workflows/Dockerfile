FROM nginx:alpine

COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html/
# COPY .docker/mime.types /etc/nginx/mime.types # TODO: might need to add mime.types

EXPOSE 80
