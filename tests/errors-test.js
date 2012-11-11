var macros     = require('./macros')
  , lynx       = macros.lynx
  , port       = macros.udpServerPort
  , test       = macros.test
  , fixture    = require("./fixtures/errors.json")
  ;

test('errors', function (t) {
  function onError(actual) {
    var expected = fixture.shift();
    //
    // Should return the function that invoked this and the arguments
    // for inspection
    //
    t.ok(actual.f, "should have a reference to the function");
    t.ok(actual.args, "args should be supplied");

    //
    // Message should match fixture
    //
    t.equal(actual.message, expected);

    //
    // No more tests to run
    //
    if(fixture.length === 0) {
      //
      // Nothing more to do.
      //
      t.end();
    }
  }

  //
  // Wrong host
  //
  var connection = new lynx('locahost', port, {onError: onError});

  connection.count(1);
  connection.count('foo', NaN);
  connection.count('foo', undefined);
  connection.send({'foo': '1|c'}, 0);
  connection.count('foo', 10);
});