FROM node:8-alpine

RUN apk add --no-cache docker
RUN apk add build-base

WORKDIR /usr/src/judge-taskmaster/
COPY runguard runguard

WORKDIR /usr/src/judge-taskmaster/runguard
RUN gcc runguard.c -o /usr/bin/runguard

WORKDIR /usr/src/judge-taskmaster

COPY package.json .
COPY package-lock.json .

RUN npm install -D

COPY . .

WORKDIR /usr/src/judge-taskmaster

CMD ["npm", "start"]