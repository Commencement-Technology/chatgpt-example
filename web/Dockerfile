FROM node:21-alpine

WORKDIR /app/web
COPY . .
RUN npm install --silent --legacy-peer-deps

CMD ["npm", "run", "dev"]