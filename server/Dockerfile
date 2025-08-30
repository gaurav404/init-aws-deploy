# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# If package.json doesnot exist, create it with npm init -y
RUN if [ ! -f package.json ]; then npm init -y; fi

# Install dependencies if package.json exists or was created
RUN npm install express prisma @prisma/client
