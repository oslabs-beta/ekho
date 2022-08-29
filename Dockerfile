# DEVELOPMENT 
# installs base image of node - Active LTS (long-term support) - see https://nodejs.org/en/about/releases/
FROM --platform=linux/amd64 node:16.17.0 as base
# establishes a working directory inside the image
WORKDIR /code
# copy package.json AND package-lock.json into code directory so image knows what application dependencies are
COPY package*.json .
# installs all of the required dependencies based on the package*.json file
RUN npm install
# copies all files in the current directory into code directory (current WORKDIR)
COPY . .

# PRODUCTION
# extends the base image from development
FROM base as production
# set build path
ENV NODE_PATH = ./build
# build typescript code ready to run in production
RUN npm run build

# package.json changes:
# JEC: temporarily replacing build to handle the typescript->javascript conversion
# "build": "NODE_ENV=production webpack",
# build compiles typescript into javascript
# JEC: temporarily replacing dev to handle hot swapping with nodemon
# "dev": "concurrently \"NODE_ENV=development nodemon server/server.ts\" \"NODE_ENV=development webpack serve --open --hot\"",