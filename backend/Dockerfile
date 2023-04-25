FROM node:17-alpine

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install
COPY . .

EXPOSE 4444
CMD ["npm", "start"]