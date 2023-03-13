FROM node:18.14.1-alpine As dev

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:18.14.1-alpine as prod

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=dev /usr/src/app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/main"]