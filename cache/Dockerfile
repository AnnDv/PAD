FROM node:14-alpine
WORKDIR /cache
COPY ["package.json", "package-lock.json", "./"]
RUN npm install 
COPY . .
EXPOSE 3000
RUN chown -R node /cache
USER node
CMD ["npm", "start"]