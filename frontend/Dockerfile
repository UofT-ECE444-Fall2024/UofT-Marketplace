FROM node:20-alpine as build

WORKDIR /app/frontend
COPY . ./
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/frontend/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx-dev.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
