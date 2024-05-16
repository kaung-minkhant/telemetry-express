from node:latest
WORKDIR /usr/src/app
copy package.json ./  
RUN npm install
copy . .
expose 8080
cmd [ "npm", "start" ]