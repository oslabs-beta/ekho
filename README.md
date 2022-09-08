# Ekho Microservice

Does your organization need help refactoring a monolithic application to a microservice architecture? Ekho can help!

## What is Ekho?

Ekho is an extension of the GitHub Scientist concept, specifically designed and packaged up for use when refactoring legacy monolithic modules into microservices. 

## Features

* Easily integrated: Ekho is built as a microservice. Simply spin up a container instance locally or in your cloud provider. 
* Easy to Use: If you're using JS, install the Ekho-JS NPM package to utilize a wrapper function that envelops your monolith module and sends a request to Ekho for testing. Otherwise, it's easy to create your own abstraction layer for use with Ekho.
* Performant: The provided wrapper function immediately returns the invoked result of the monolith module, and asynchronously builds the request object to send to Ekho. This provides users with the opportunity to integrate Ekho into production codebases without affecting performance and throughput. 
* Scalable: Spin up as many Ekho instances as needed. Simply pass the appropriate MongoDB connection URI into each instance to ensure Ekho is publishing to the appropriate database.
* Meaningful Data: Ekho also comes with a browser-accessed visualization tool. You can see the differences between your monolith modules and microservices to easily make impactful design decisions.
* Customizable: Ekho comes with a yaml file to configure each container instance to fit your testing needs. Additionally, the provided wrapper function allows users to include context into their experiments. 

## Let’s get testing!

Using Ekho requires a bit of setup, although we’ve simplified and documented the process to help you along. There are 3 basic steps to get your first experiment started:
1. Configure Ekho to call your candidate microservice
2. Deploy Ekho to your cloud environment
3. Write your wrapper function

To avoid confusion monolith module and legacy are used interchangeably in this README.

Prerequisites:
Ekho is run as a container instance and accessed via HTTP requests. Here’s how to get started: 

You will need to have Docker installed. You can get started [here](https://docs.docker.com/get-docker/).

## 1. Configure your first experiment:
To get started, fork and clone this repo.

Configuring Ekho is fairly simple, and we’ve abstracted as much configuration as possible into a YAML file to allow you to control your experiments without complicated code changes. There are also a couple of sample experiments set up to get you started. Set up your experiments [here](./experiments.yaml).

Every experiment needs just a few fields:
* **name**: must match the experiment name from the request
* **enabledPct**: a number between 0 and 1 representing the proportion of monolith module calls that result in a trial being conducted.
* **method**: the method we should use to make the API request to the candidate microservice
* **apiEndpoint**: the URI of the candidate microservice
* **ignoreMismatchRules**: An array of rule objects. Every rule object has a name attribute and an array of 1 or more criteria. We’ll talk about these a little later.

## 2. Deploy Ekho to your cloud environment: 
### a. Build a Docker image in the root directory of the cloned repo:
The Dockerfile is pre-configured to expose server port 443. Make sure to build your Docker image for the Operating System/architecture platform of the machine where you will be deploying Ekho. You can do this using the following commands:

Create a new builder instance:
  ‘Docker buildx create –name <name-of-this-buildx-instance>’

Specify Docker to use the created buildx instance:
  ‘Docker buildx use <name-of-this-buildx-instance>’

Building your image to deploy on a linux/amd64 machine:
  ‘docker buildx build --platform linux/amd64 -t <image-name>:<tag> .’

Building your image to deploy on a linux/arm64 machine:
  ‘docker buildx build --platform linux/arm64 -t <image-name>:<tag> .’

Building your image to deploy on a linux/arm/v7 machine:
  ‘docker buildx build --platform linux/arm/v7 -t <image-name>:<tag> .’


### b. Create a MongoDB instance
Ekho publishes experiment results to MongoDB, a NoSQL database. Make sure to create a MongoDB database before moving on to the next steps. If you already have a MongoDB service available, skip this step.

Create an instance using Docker:
  ‘docker run -d --name <container-name> -p 27017:<PORT> \
  -e MONGO_INITDB_ROOT_USERNAME=<username> \
  -e MONGO_INITDB_ROOT_PASSWORD=<password> \
  mongo’ 

Create an instance using MongoDB Atlas:
  You can refer to the MongoDB Atlas documentation to quickly create a free cluster to host a MongoDB instance: https://www.mongodb.com/docs/atlas/getting-started/

### c. Deploy Ekho microservice (Locally):
Manual Deployment:
You can run Docker container instances individually for your candidate microservice and Ekho. 
To run Ekho you can execute the following command:
  ‘Docker run -d <repository>:<tag> -e MONGO_URI=<mongo-uri> .’

  The <mongo-uri> if using a Docker container instance:
    ‘mongodb://localhost:<PORT>’
	
  The <mongo-uri> if using a MongoDB Atlas instance:
    ‘mongodb://\[username:password@]host1\[:port1][,...hostN\[:portN]][/\[defaultauthdb][?options]]’

Further documentation for accessing a MongoDB Atlas instance: 
  https://www.mongodb.com/docs/manual/reference/connection-string/

Using docker compose:
If you have already orchestrated a container pipeline with docker-compose, you can simply add Ekho and mongo as services in your yml file. 

Ensure the following dictionaries and values are included in your configuration for Ekho:
  image: <image name>
    container_name: <container-name>
    # port format - host port : container port
    ports:
      - "443:<PORT>"
    command: npm run start
    volumes:
      - .:/usr/src/app
      - node_modules:/usr/src/app/node_modules
    depends_on:
      - <mongo-service>
      - <candidate-microservice-service>

For more information, please refer to the Docker docs: https://docs.docker.com/compose/

Ekho is now running on your local machine! Save the endpoint of your running Ekho container instance and proceed to Step 5! Additionally, you can enter the Ekho endpoint in your browser to access the data visualization of your experiments!

Ex. http://localhost:443/

### d. Deploy Ekho microservice in the Cloud (AWS):
You will need to push your Ekho image to AWS ECR. To prevent any container failures, we can use the previously created buildx instance which should still be running. You can check by running the command ‘docker ps -a’. Run the following command to build your Ekho image in all three OS/architecture platforms and push to your AWS ECR. This will create three images and one image index. Copy the image index URI for use in Create Your Task Definition.

docker buildx build \
   --platform linux/amd64,linux/arm64,linux/arm/v7 \
   -t <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<my-repository>:<tag> \
   --push \
   .

For more information, please refer to the AWS ECR docs: 
https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html

Next you will deploy the Ekho image in a container on an ECS cluster. If you already have an existing cluster, continue to configure your Task Definition for Ekho. To create your ECS cluster navigate to the ECS service and click on Clusters → Create Cluster. For more information on cluster configuration, please refer to the AWS ECS docs: 
https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create_cluster.html

Once your cluster is running, you will create your Task Definition. This is where you define the configurations for your container instance as well as the container that will be launched. When adding your container to the task definition, the image to be entered is the image index URI we created earlier. Additionally, make sure to add an environment variable for your Mongo connection URI you created earlier in your container. Ekho needs this to publish your experiment results! For more information on configuring Task Definitions, please refer to the AWS ECS docs: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html

Now we can navigate back to our cluster and check that our container is running under the ECS Instances Tab. Next, navigate to the Tasks tab and we will run this container as a task in our cluster! Please refer to the AWS ECS docs for configuring your task: 
https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_run_task.html

Ekho is now running on AWS! Save the public IP of your running Ekho container instance and proceed to Step 6! Additionally, you can enter the Ekho endpoint in your browser to access the data visualization of your experiments!

Ex. http://54.215.93.31:443/

## 3. Wrap your monolith module code block:
Run the following command to use the wrapper function:
‘Npm install ekho-js’

The wrapper function is going to accomplish 2 goals:
  1. Delegating to the monolith module so that the result can be returned
  2. Making the call to your Ekho instance with the necessary information

So your wrapper function will do the following:
  * Start a timer
  * Call the monolith module code block and store the result
  * Stop the timer and calculate the runtime
  * Asynchronously call the Ekho microservice using the URI from Step 3
  * Return the result to the monolith module

The API call to the Ekho microservice takes the following form:

**Method**: POST
**Request body**: 
{ 
	name: required string
	context: optional object
	args: required object with at least one of the following properties
		params: array of strings
		query: object
		body: any
	runtime: required number
	result: required any
}

Here’s what all those properties should represent:
  * **name**: The name of the experiment. This must match the experiment name configured in the YAML file.
  * **context**: Any properties provided as context will be recorded when the experiment is published and can be used to ignore mismatches.
  * **args**: This is everything Ekho needs to make a call to your candidate microservice. Args can also be used to ignore mismatches
  * **params** get swapped into designated placeholders in the URI. If there are more placeholders than params, extra placeholders will be removed.
  * **query**: Query parameters that get added at the end of the URI
  * **body**: This will be the request body in the call to your candidate microservice.
  * **runtime**: the runtime of your legacy function call
  * **result**: the result of your legacy function call

No need to wait for a response back from Ekho before returning the result from the wrapper function - Ekho always returns a 200 status code and handles errors separately.

(We should have a link to a sample wrapper function, but I don’t think we have a single file where we could show one off.)

## Configuring ignore mismatch rules

As you’re investigating mismatches between your legacy result and the candidate microservice result, you may realize that certain classes of mismatches should be ignored. For instance, you may find bugs in your legacy code that you don’t want to fix, or you may start testing your microservice knowing that you’re not yet handling certain corner cases.

To assist you in focusing on just the mismatches that require your attention, you can automatically identify mismatches that you can ignore. This involves 2 steps:
  1. **Defining criteria to ignore**: In the criteria.ts file, define new properties whose values are functions that should test some properties of context and args and return a boolean.
  2. **Assigning criteria to experiments**: In the experiments.yaml file, define a new rule in the ignoreMismatchRules array. Each rule is an object with 2 properties:
    a. **name**: this will be published to the database on trials that result in mismatches that meet the criteria.
    b. **criteria**: an array of 1 or more criteria from criteria.ts

If there is no mismatch between results, ignoreMismatchRules will be ignored.

## How to Contribute:
Please reach out to any member of the core team! We’d love to hear from you.

Built With
* [Typescript](https://www.typescriptlang.org/)
* [React](https://reactjs.org/docs/getting-started.html)
* [Chart.js](https://www.chartjs.org/)
* [Node.js](https://nodejs.org/en/docs/)/[Express](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Docker](https://docs.docker.com/)
* [AWS](https://aws.amazon.com/)
* [Jest](https://jestjs.io/) / [Supertest](https://www.testim.io/blog/supertest-how-to-test-apis-like-a-pro/)
* [webpack](https://webpack.js.org/)

Connect With the Core Team:
* Nick Krug - [GitHub](https://github.com/nekrug) | [LinkedIn](https://www.linkedin.com/in/nicholas-e-krug/)
* Alexander Cheung - [GitHub](https://github.com/awcheung1213) | [LinkedIn](https://www.linkedin.com/in/alexandercheung1213/)
* Ben Rhee - [GitHub](https://github.com/bprhee01) | [LinkedIn](https://www.linkedin.com/in/thebenrhee/)
* Jason Clark  - [GitHub](https://github.com/clarkjasone) | [LinkedIn](https://www.linkedin.com/in/clarkjasonee/)