# Use the official Nginx image
FROM nginx:alpine

# Remove the default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy your static website files into the Nginx web directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx (default command is already set in the base image)
