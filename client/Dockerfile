FROM node:latest

COPY ["package.json", "package-lock.json", "/usr/src/"]

WORKDIR /usr/src/

RUN npm install

COPY ["src", "/usr/src/src/"]

COPY ["locales", "/usr/src/locales"]

COPY ["media", "/usr/src/media"]

COPY [".env", "/usr/src/"]

#COPY [".", "/src/usr"]

EXPOSE 1234

CMD [ "npx", "parcel", "src/index.html"]
