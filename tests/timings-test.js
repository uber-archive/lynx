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
  var timer = connection.createTimer('foo.interval');

  //
  // Wait 100ms
  //
  setTimeout(function () {
    //
    // Stop the timer
    //
    timer.stop();
  }, 200);

  //
  // A second timer
  //
  var second_timer = connection.createTimer('bar.comes.first');

  setTimeout(function () {
    //
    // Stop the timer
    //
    second_timer.stop();
  }, 100);
});
