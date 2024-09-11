FROM node:21


WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN which node

RUN yarn build

EXPOSE 8080

CMD ["node", "/app/dist/src/index.js"]
