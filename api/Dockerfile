FROM node:18.12.1

WORKDIR /app

COPY package*.json /app/

RUN npm ci

ENV NODE_ENV=production

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "prod"]