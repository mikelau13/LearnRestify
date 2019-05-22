# This will be passed in from docker-compose file
ARG BUILD_ENV=development

FROM keymetrics/pm2:10-slim AS node-production

FROM node:10-slim AS node-development

FROM node-${BUILD_ENV} AS build-base
# python dependency is needed for dtrace-provider npm module
RUN apt-get update
RUN apt-get install python make -y
ENV NODE_ENV ${BUILD_ENV}
WORKDIR /app
COPY package*.json ./
RUN npm install --quiet
COPY . .
EXPOSE 8080

# start up dev server using nodemon
FROM build-base AS start-development
CMD ["npm", "start"]

# start up prod server using pm2
FROM build-base AS start-production
ENV NPM_CONFIG_LOGLEVEL warn
RUN NODE_ENV=test npm test
CMD [ "npm", "run", "start"]
