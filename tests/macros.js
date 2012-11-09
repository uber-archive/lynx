var path   = require('path')
  , dgram  = require('dgram')
  , macros = exports
  ;

//
// Set the server port
//
macros.udpServerPort = 9753;

//
// ### function mockUdpServer(testName, onTest)
// #### @testName {String} The test that is calling this, so we can load
//      the respective fixture
// #### @onTest   {Function} Function that returns the result of a specific
//      test
// #### @timeout  {Number} Time after which we close the server
//
// Start a `udp` server that will expect a certain order of events that is
// mocked in `fixtures`
//
macros.udpServer = function udpServer(testName, timeout, onTest) {
  //
  // JavaScript how much we <3 you
  //
  if(typeof timeout === "function") {
    onTest  = timeout;
    timeout = null;
  }

  //
  // Set the path for the fixture we want to load
  //
  var fixturePath = path.join("fixtures", testName + ".json");

  //
  // Try to load the fixture.
  // This will break your program if you delete by mistake
  //
  var fixture = require("./" + fixturePath);

  //
  // Create a UDP Socket
  //
  var socket = dgram.createSocket("udp4", function (message, remote) {
    //
    // We expect the first item in our fixture
    //
    var expected = fixture.shift();

    //
    // `remote.address` for remote address
    // `remote.port` for remote port
    // `remote.size` for data lenght
    // `message.toString('ascii', 0, remote.size)` for textual contents
    //
    var actual  = message.toString('ascii', 0, remote.size);

    onTest(actual === expected, { expected: expected, actual: actual });
  });

  //
  // If we have set a timeout close the socket after that amount of ms
  //
  if (typeof timeout === "number") {
    setTimeout(socket.close, timeout);
  }

  //
  // Listen in some (not so) random port
  //
  socket.bind(macros.udpServerPort, 'localhost');
};