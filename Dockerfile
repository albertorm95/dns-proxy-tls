FROM node:12.18.2-alpine AS final
LABEL maintainer="albertorojasm95@gmail.com"
EXPOSE 53

WORKDIR /app

COPY src/ ./src

CMD ["node", "src/index.js"]

FROM node:12.18.2-alpine AS lint
LABEL maintainer="albertorojasm95@gmail.com"
EXPOSE 53

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src/ ./src
COPY .eslintrc.js .

CMD ["npm", "start"]
