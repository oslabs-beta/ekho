# DEVELOPMENT 
# installs base image of node - Active LTS (long-term support) - see https://nodejs.org/en/about/releases/
FROM node:16.17.0 as base
# establishes a working directory inside the image
WORKDIR /code
# install typescript
# RUN npm install -D typescript
# RUN npm install -D ts-node
# copy package.json AND package-lock.json into code directory so image knows what application dependencies are
COPY package*.json .
COPY tsconfig.json .
RUN npm install -D typescript
# installs all of the required dependencies based on the package*.json file
RUN npm install
# copies all files in the current directory into code directory (current WORKDIR)
COPY . .
# default command when the container spins up - similar to running “node server/server.js” in Node CLI 
CMD ["node", "server/server.ts"]