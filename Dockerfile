# installs base image of node built on small linux distribution
FROM node:alpine 
# copies all files in the current directory into a directory called app created on the image
COPY . /app 
# runs the app.js file with node (note: found within the app directory)
CMD node app/app.js 