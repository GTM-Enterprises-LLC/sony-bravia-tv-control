var bravia = require('./lib');
// Accepts two parameters: IP and PSKKey

bravia('192.168.1.28', '3553', function(client) {

  // List available commands
  client.getCommandNames(function(list) {
    console.log(list);
  });

  // Call a command
  // client.exec('PowerOff');

});
