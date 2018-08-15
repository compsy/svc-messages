FROM compsy/svc-server:latest
WORKDIR /service
COPY package*.json 

RUN npm install
RUN make build

COPY . /service/

