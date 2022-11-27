FROM node:14-alpine
WORKDIR /history
COPY ["package.json", "package-lock.json", "./"]
RUN npm install 
COPY . .
EXPOSE 3030
RUN chown -R node /history
USER node
CMD ["npm", "start"]