var test    = require('tap').test
  , lynx    = require('../lib/lynx')
  , macros  = require('./macros')
  , nrTests = require('./fixtures/counting').length
  ;

//
// All of our counting tests
//
test("Counting Test", function (t) {
  //
  // Plan for as many tests as we have fixtures
  // 
  t.plan(nrTests);

  //
  // Setup our server
  //
  macros.udpServer('counting', function onEachRequest(err, info) {
    //
    // On each response check if they are identical
    //
    t.equal(info.expected, info.actual);
  });

  //
  // Create our lynx client
  //
  var metrics = new lynx('localhost', macros.udpServerPort);

  //
  // Actual methods being tested
  // Order matters
  //
  // Needs to match fixture in `./fixtures/counting.json`.
  //
  metrics.increment("foo.bar");
  metrics.decrement("foo.baz");
});