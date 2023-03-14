FROM node:18.14.1-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8081

CMD ["npm", "run","start:prod"]