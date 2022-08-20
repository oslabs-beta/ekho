# installs base image of node - Active LTS (long-term support) - see https://nodejs.org/en/about/releases/
FROM node:16.17.0
# establishes a working directory inside the image
WORKDIR /code
# copy package.json AND package-lock.json into code directory so image knows what application dependencies are
# what if different images require different dependencies? do we need to install all dependencies on all images?
COPY package*.json .
# installs all of the required dependencies based on the package*.json file
RUN npm install
# copies all files in the current directory into code directory (current WORKDIR)
# JEC: this includes folders for all microservices - we don't really want that, right?
COPY . .
# environment variable to allow for data transmission via HTTP (80); may want to switch to HTTPS (443)?
# ENV PORT 443
# exposes the application port 3000 to the outside world
# EXPOSE 443
# default command when the container spins up - similar to running “node server/server.js” in Node CLI 
CMD ["node", "server/server.js"]

# the container server that i just spun up is listening on port 443 but it is a stand alone process not connected to the outside world
# -p 3000:443 in the run command binds port 3000 on the localhost to port 443 on the container 
# so when I go to localhost:3000 in my browser it loops back to the local port 3000 which is bound to the container port 443 so it serves up index.html
# NOTE: -p xxxx/xxxx overwrites anything exposed with EXPOSE above, however ENV PORT and EXPOSE don't seem to work on their own or together without -p??
# docker run -p 3000:443 --name testing clarkjasone/ekho