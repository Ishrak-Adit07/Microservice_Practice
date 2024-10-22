# Auth service Dockerfile
FROM node:20-alpine

# Install curl, bash, and other common utilities
RUN apk add --no-cache \
    curl \
    bash \
    git \
    vim \
    build-base \
    python3 \
    py3-pip  

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]