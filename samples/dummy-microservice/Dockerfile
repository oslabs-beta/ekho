# installs base image of node - Active LTS (long-term support) - see https://nodejs.org/en/about/releases/
FROM node:16.17.0
# establishes a working directory inside the image
WORKDIR /usr/src/app
# copy package.json AND package-lock.json into code directory so image knows what application dependencies are
COPY package*.json .
# installs all of the required dependencies based on the package*.json file
RUN npm install
# copies all files in the current directory into code directory (current WORKDIR)
COPY . /usr/src/app
EXPOSE 8000
ENTRYPOINT ["node", "server/server.js"]