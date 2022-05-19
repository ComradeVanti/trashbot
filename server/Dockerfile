FROM node:alpine
WORKDIR /app
COPY ./server/package.json ./
COPY ./server/package-lock.json ./
COPY ./ ./
RUN npm i
CMD ["npm", "run", "run"]