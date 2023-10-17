FROM node:16-alpine

WORKDIR /app

COPY ./package*.json ./

RUN npm ci

COPY . .

RUN npx nest build --webpack

CMD ["npm","run","start:dev"]
