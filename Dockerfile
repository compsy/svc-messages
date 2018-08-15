FROM compsy/svc-server:latest
WORKDIR /service
COPY package*.json ./

RUN npm install

COPY . ./
RUN make build

WORKDIR /app
