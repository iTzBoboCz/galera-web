# Build stage
FROM node:18.17-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production
COPY --from=build /app/dist /usr/share/nginx/html
COPY .docker/nginx.conf /etc/nginx/templates/default.conf.template
# COPY .docker/mime.types /etc/nginx/mime.types # TODO: might need to add mime.types
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
