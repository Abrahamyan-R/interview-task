FROM node:16

ENV PORT=3000
ENV DB_HOST="app-db"
ENV DB="interview-task"

WORKDIR /usr/src/api

COPY package*.json .

RUN npm install

COPY . .