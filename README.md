# lynx

A minimalistic node.js client for [statsd] server. Fork of original work by [sivy]

`lynx` features:

* **Minimalistic** — there is only a minimum of abstraction between you and 
  statsd
* **Re-usable UDP Connections** — Keeps UDP connections open for a certain time
* **Errors** — Pluggable error handling, by default errors are ignored

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
> metrics.gauge('gauge.one', 100);
> metrics.set('set.one', 10);
```

This is the equivalent to:

``` sh
echo "node_test.int:1|c"  | nc -w 0 -u localhost 8125
echo "node_test.int:-1|c" | nc -w 0 -u localhost 8125
echo "node_test.some_service.task.time:500|ms" | nc -w 0 -u localhost 8125
echo "gauge.one:100|g"    | nc -w 0 -u localhost 8125
echo "set.one:10|s"       | nc -w 0 -u localhost 8125
```

The protocol is super simple, so feel free to check out the source code to understand how everything works.

## Advanced

### Timers

If you wish to measure timing you can use the `timer()` functionality.

``` js
var metrics = new lynx('localhost', 8125)
  , timer   = metrics.Timer('some.interval')
  ;

//
// Should send something like "some.interval:100|ms"
//
setTimeout(function () {
  timer.stop();
}, 100);
```

Timers use `Date.getTime()` which is known for being imprecise at the ms level. If this is a problem to you please submit a pull request and I'll take it.

### Batching

Batching is possible for `increment`, `decrement`, and count:

``` js
metrics.decrement(['uno', 'two', 'trezentos']);
```

If you want to mix more than one type of metrics in a single packet you can use `send`, however you need to construct the values yourself. An example:

``` js
//
// This code is only to exemplify the functionality
//
// As of the current implementation the sample rate is processed per group
// of stats and not per individual stat, meaning either all would be send
// or none would be sent.
//
metrics.send(
  { "foo" : "-1|c"    // count
  , "bar" : "15|g"    // gauge
  , "baz" : "500|ms"  // timing
  , "boaz": "40|s"    // set
  , ""
  }, 0.1);            // sample rate at `0.1`
```

### Closing your socket

You can close your open socket when you no longer need it by using `metrics.close()`.

### Errors

By default `errors` get logged. If you wish to change this behavior simply specify a `onError` function when instantiating the `lynx` client.

``` js
function onError(err) {
  console.log(err.message);
}

var connection = new lynx('localhost', 1234, {onError: onError});
```

Source code is super minimal, if you want try to get familiar with when errors occur check it out. If you would like to change behavior on how this is handled send a pull request justifying why and including the alterations you would like to propose.

## Tests

Run the tests with `npm`.

``` sh
npm test
```

## Meta

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
