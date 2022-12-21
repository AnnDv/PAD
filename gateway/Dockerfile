FROM node:14-alpine
WORKDIR /gateway
COPY ["package.json", "package-lock.json", "./"]
RUN npm install 
COPY . .
EXPOSE 8000
RUN chown -R node /gateway
USER node
CMD ["npm", "start"]