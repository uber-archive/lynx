# lynx

A minimalistic node.js client for [statsd] server. Fork of original work by [sivy]

`lynx` features:

* **Minimalistic** — there is only a minimum of abstraction between you and 
  statsd
* **Re-usable UDP Connections** – Keeps UDP connections open for a certain time
* **Errors** - Pluggable error handling, by default errors are ignored

## Quick Start

```
$ npm install lynx
$ node
> var lynx = require('lynx');
> var metrics = new lynx('localhost', 8125);
{ host: 'localhost', port: 8125 }
> metrics.increment('node_test.int');
> metrics.decrement('node_test.int');
> metrics.timing('node_test.some_service.task.time', 500); // time in ms
```

This is the equivalent to 

``` sh
echo "node_test.int:1|c"  | nc -w 0 -u localhost 8125
echo "node_test.int:-1|c" | nc -w 0 -u localhost 8125
echo "node_test.some_service.task.time:500|ms" | nc -w 0 -u localhost 8125
```

## API

## Advanced

Setting on error function

## tests

Run the tests with `npm`.

``` sh
npm test
```

## meta

           `\.      ,/'
            |\\____//|
            )/_ `' _\(
           ,'/-`__'-\`\
           /. (_><_) ,\
           ` )/`--'\(`'  atc
             `      '

* code: `git clone git://github.com/dscape/lynx.git`
* home: <http://github.com/dscape/lynx>
* bugs: <http://github.com/dscape/lynx/issues>

`(oo)--',-` in [caos]

[caos]: http://caos.di.uminho.pt
[sivy]: https://github.com/sivy/node-statsd
[statsd]: https://github.com/etsy/statsd
