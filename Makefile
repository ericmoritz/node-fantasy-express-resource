.PHONY: test

SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=lib/%.js)

all: lib test

lib: $(LIB)
lib/%.js: src/%.js
	mkdir -p $(@D)
	babel $< -o $@

test:
	mocha --compilers js:babel/register
