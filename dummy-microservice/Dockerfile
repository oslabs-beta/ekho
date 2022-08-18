# installs base image of node - Active LTS (long-term support) - see https://nodejs.org/en/about/releases/
FROM node:16.17.0
# creates working directory and sets for subsequent commands
WORKDIR /code
# environment variable to allow for data transmission via HTTP (80); may want to switch to HTTPS (443)?
ENV PORT 80
# copy package.json into code directory so image knows what application dependencies are
# JEC: what if different images require different dependencies? do we need to install all dependencies on all images? should we have a local package.json for each microservice?
COPY ../package.json /code/package.json
# install all dependencies
RUN npm install
# copies all files in the current directory into code directory
COPY . /code
# default command when the container spins up - run node and pass in server/server.js
CMD ["node", "server/server.js"]