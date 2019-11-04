FROM node:12

WORKDIR /app

RUN npm install pouchdb-server

EXPOSE 5984

# RUN npm install mongodown inherits

# COPY wrappedmongodown.js .

# CMD npx pouchdb-server --host 0.0.0.0 --level-backend ./../../../wrappedmongodown.js

CMD npx pouchdb-server --host 0.0.0.0 -d /poigoi/data
