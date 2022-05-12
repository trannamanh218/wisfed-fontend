FROM node:14-alpine as build
WORKDIR /wisfeed
COPY . /wisfeed/
RUN npm i
RUN npm run build

FROM nginx:alpine
COPY --from=build /wisfeed/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY /nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]