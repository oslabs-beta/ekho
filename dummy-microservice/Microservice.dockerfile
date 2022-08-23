# installs base image of node - Active LTS (long-term support) - see https://nodejs.org/en/about/releases/
FROM node:16.17.0
# establishes a working directory inside the image
# this must be different than the working directory in other dockerfiles? why? since this is inside the image this dockerfile refers to, i don't understand
WORKDIR /app
# copy package.json AND package-lock.json into code directory so image knows what application dependencies are
COPY package*.json .
# installs all of the required dependencies based on the package*.json file
RUN npm install
# copies all files in the current directory into code directory (current WORKDIR)
COPY . .
# default command when the container spins up - similar to running “node server/server.js” in Node CLI 
CMD ["node", "server/server.js"]