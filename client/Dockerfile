FROM node:latest

COPY ["package.json", "package-lock.json", "/usr/src/"]

WORKDIR /usr/src/

RUN npm install

COPY [".env", "./locales", "media", "src", "/usr/src/"]

#COPY [".", "/usr/src/"]

EXPOSE 1234

CMD [ "npx", "parcel", "src/index.html"]
