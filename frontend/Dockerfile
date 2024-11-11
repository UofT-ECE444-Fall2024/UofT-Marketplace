FROM node:16-alpine
WORKDIR /app/frontend
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
RUN npm install
COPY . ./
