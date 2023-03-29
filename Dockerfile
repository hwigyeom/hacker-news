FROM node:alpine

# Install Yarn
RUN yarn global add pm2

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Bundle app source
COPY . .
RUN yarn run build

EXPOSE 3000 3001 3002

CMD [ "pm2-runtime", "ecosystem.config.js" ]