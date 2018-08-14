FROM compsy/svc-server:latest

COPY package*.json /service/

RUN npm install

COPY . /service/

