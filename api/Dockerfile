FROM node:21-alpine

WORKDIR /app/api
COPY . .
RUN npm install --silent --legacy-peer-deps

CMD ["npm", "run", "dev"]