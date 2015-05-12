.PHONY: test

SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=lib/%.js)

all: README.md lib test

README.md:
	gcc -I. -P -C -xc -E src/README.md > README.md

lib: $(LIB)
lib/%.js: src/%.js
	mkdir -p $(@D)
	babel $< -o $@

test:
	mocha --compilers js:babel/register
