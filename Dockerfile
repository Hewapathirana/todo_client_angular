# Use the official Node.js image to build the app
FROM node:16 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app for production
RUN npm run build --prod

# Use a smaller web server image to serve the built app
FROM nginx:alpine

# Copy the built app from the previous stage to the nginx folder
COPY --from=build /app/dist/todo /usr/share/nginx/html

# Expose port 80 to access the app from the outside
EXPOSE 80

# Start nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
