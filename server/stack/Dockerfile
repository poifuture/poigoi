FROM node:12

WORKDIR /app

RUN mkdir -p /poigoi/data/

RUN npm install @poifuture/poigoi-server

# RUN npm install mongodown inherits

# COPY wrappedmongodown.js .

# CMD npx pouchdb-server --host 0.0.0.0 --level-backend ./../../../wrappedmongodown.js

ENV PORT 3000

ENV POUCHDB_PREFIX /poigoi/data/

ENV POIGOI_USER_REGISTRATION_SERVICE_POUCHDB_PASSWORD UNSAFE_PASSWORD

EXPOSE 80 443 3000 5984

CMD npx poigoi-server
