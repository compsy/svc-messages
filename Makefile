PROJECT_NAME := $(shell basename $(CURDIR))
image_name := compsy/$(PROJECT_NAME)
action_name := $(PROJECT_NAME)

exists := $(strip $(shell bx wsk action list | awk '{print $1}' | grep $(action_name)))

.DEFAULT_GOAL := all

all: build service example

install:
	npm install 

build:
	node_modules/.bin/rollup -c

service:
ifndef exists
	bx wsk action create --web true $(action_name) dist/service.js
else
	bx wsk action update --web true $(action_name) dist/service.js
endif

example:
	./action_example.sh | jq '.response.result.payload'


name:
	@echo $(PROJECT_NAME)
