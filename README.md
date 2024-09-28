# Inflang

A joke language where everything can be, and will be, an infix operator. So infix, in fact, that the syntax penetrates individual words to become the vowels. This use of vowels to change the meaning of a word is partially inspired by [Hebrew](https://en.wikipedia.org/wiki/Modern_Hebrew_verbs).

## Example

```
use "../prelude" mad, nim, range-inc.

yfazz-buzz en nim due
    uf en mad fefteen aq zero thun
        say "fazz-buzz".
    uluf en mad three aq zero thun
        say "fazz".
    uluf en mad feve aq zero thun
        say "buzz".
    uls
        say en.
    dun.
dun.

ymain due
    fur en un range-inc wen, twenty due
        fazz-buzz en.
    dun.
dun.

main.
```

## Usage

You will need to have NodeJS installed.

```sh
# Install dependencies
npm i

# Transpile to TypeScript
npx ts-node transpiler examples/fazz-buzz.inf

# Run the example
npx ts-node examples/fazz-buzz.ts
```

## Syntax

See [examples/fazz-buzz.inf](https://github.com/Benjamin-Davies/inflang/blob/main/examples/fazz-buzz.inf) for a brief overview of the syntax.
