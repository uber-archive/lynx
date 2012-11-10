var macros     = require('./macros')
  , test       = macros.test
  , updServer  = macros.updServer
  , connection = macros.connection
  , count      = 0
  , finished   = false
  ;

//
// TOTAL is the number of iterations to do
// DESIRED is the minimum number of requests expected
// SAMPLE Number of samples to send, e.g. @0.1 (1 in 10)
//
var DESIRED = 90
  , TOTAL   = 1000
  , SAMPLE  = 0.1
  ;

//
// Try to do this a thousand times
// [1,2,3,...,1000]
//
var coll = [];
for(i=0; i<TOTAL; i++) {
  coll.push(i);
}

//
// We are going to do one thousand packets
// and see if we hit our minimums
//
// When you specify sampling `lynx` must track that it only send the amount
// of packages you are specifying (e.g. 1 in each 10 for @0.1)
//
// To do this we use random numbers, making our process not perfect but
// accurate enough
//
// Because of the randomness that is used to select which packets are sent
// this can never be an exact test and might break while the code is
// perfectly fine
//
test("sampling", function (t) {
  var server = updServer(function (message, remote) {
    //
    // do nothing if finished
    //
    if(finished) {
      return;
    }

    count++;

    //
    // We have hit our minimums
    //
    if(count > DESIRED) {
      finished = true;
      t.ok(true, "Reached " + DESIRED + " on " + (TOTAL - coll.length) + " packets.");
      t.end();
    }
  });

  //
  // Run all the iterations
  //
  var runAll = function(coll, callback) {
    (function iterate() {
      if (coll.length === 0) {
        return callback();
      }
      coll.pop();
      setTimeout(function send_packet() {
        //
        // Send a sample
        //
        connection.gauge("spl.foo", 500, SAMPLE);
        process.nextTick(iterate);
      }, Math.ceil(Math.random() * 10));
    })();
  };

  runAll(coll, function() {
    //
    // If we reached the end and this has not closed by having
    // the desired amount of requests
    //
    t.ok(false, "Didnt reach the desired amount of packets " + DESIRED +
      "/" + TOTAL + " was -> " + count);
    server.close();
    t.end();
  });
});