# Node.js: 14.4.0
FROM node:14

# RUN apk --no-cache add --virtual .builds-deps build-base python3
# Add Tini
# ENV TINI_VERSION v0.15.0
# ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
# RUN chmod +x /tini
# ENTRYPOINT ["/tini", "--"]

# Create app directory
WORKDIR /src

# Install app dependencies (package.json and package-lock.json)
COPY package*.json ./
RUN npm install

# Bundle app source (server.js)
# COPY . .

# Listen port
# EXPOSE 8080

# Run Node.js
# CMD [ "node", "server.js" ]