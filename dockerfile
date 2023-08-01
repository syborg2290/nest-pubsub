# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if using npm) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files from the current directory to the working directory inside the container
COPY . .

# Expose the port that your NestJS app is listening on
EXPOSE 4002

# Run the NestJS app
CMD ["npm", "start"]
