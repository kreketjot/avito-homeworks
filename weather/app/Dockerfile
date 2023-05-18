# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn run build
EXPOSE 3000
CMD [ "yarn", "run", "start" ]