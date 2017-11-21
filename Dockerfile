FROM node:6

LABEL maintainer="Pierre Kuhner <pierre@pcksr.net>"

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Bundle app source code
COPY . .

EXPOSE 4000

CMD [ "node", "app.js" ]
