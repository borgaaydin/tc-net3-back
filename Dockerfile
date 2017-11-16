FROM node:boron

LABEL maintainer="Pierre Kuhner <pierre@pcksr.net>"

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production

# Bundle app source code
COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
