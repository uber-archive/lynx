var macros  = require('./macros');

//
// Our `timing` fixture tests
// Should match `tests/fixtures/timing.json`
//
macros.matchFixturesTest('timings', function runTest(connection) {
  //
  // Basic Tests
  //
  connection.timing('foo.baz.time', 10);
  connection.timing('foo.bar.time', 500);

  //
  // Constructing a timer object
  //
  var timer = connection.Timer("foo.interval");
  
  //
  // Wait 10ms
  //
  setTimeout(function () {
    //
    // Stop the timer
    //
    timer.stop();
  }, 100);
});
