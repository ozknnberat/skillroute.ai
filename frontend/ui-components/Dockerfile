FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install || echo "Package.json henuz yok, atliyorum"
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
