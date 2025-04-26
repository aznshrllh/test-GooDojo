FROM node:22-slim

WORKDIR /app

COPY package*.json ./

# Use --legacy-peer-deps to resolve dependency conflicts
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]