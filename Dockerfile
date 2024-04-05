FROM node:20 as build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./ /app/


RUN npm run docs:build

FROM nginx:1

COPY --from=build-stage /app/.vitepress/dist/ /usr/share/nginx/html
COPY ./static_files/* /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx-backend-not-found.conf /etc/nginx/extra-conf.d/backend-not-found.conf