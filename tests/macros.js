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
//
// Start a `udp` server that will expect a certain order of events that is
// mocked in `fixtures`
//
macros.udpServer = function udpServer(testName, onTest) {
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
  // The number of requests we expect to get
  //
  var nrRequests = fixture.length
    , iRequests  = 0
    ;

  //
  // Create a UDP Socket
  //
  var socket = dgram.createSocket("udp4", function (message, remote) {
    //
    // We got another one
    //
    iRequests++;

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

    //
    // Return our test results
    //
    onTest(actual === expected, { expected: expected, actual: actual });

    //
    // If we are done close the server
    //
    if(iRequests === nrRequests) {
      socket.close();
    }
  });

  //
  // Listen in some (not so) random port
  //
  socket.bind(macros.udpServerPort, 'localhost');
};