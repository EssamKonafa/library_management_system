# Use Node.js 20 LTS
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json / yarn.lock
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build TypeScript (optional if using ts-node-dev in dev)
RUN npm run build || true

# Expose the port
EXPOSE 8080

# Start the server
CMD ["npm", "run", "dev"]
