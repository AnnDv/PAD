FROM node:14-alpine
WORKDIR /reco
COPY ["package.json", "package-lock.json", "./"]
RUN npm install 
COPY . .
EXPOSE 5001
RUN chown -R node /reco
USER node
CMD ["npm", "start"]