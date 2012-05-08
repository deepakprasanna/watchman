var http = require("http"),
    spawner = require("child_process").spawn,
    fs = require("fs")

log_path = "/home/deepak/ghetto/log/development.log"
http.createServer(function(request,response){

  var non_streaming_tail = spawner("tail",["-n 200", log_path]) 
  var streaming_tail = spawner("tail", ["-f", log_path]);

  response.writeHead(200, {
    "Content-Type": "text/plain"
  });

  non_streaming_tail.stdout.on("data", function(data) {
    response.write(data.toString());
  });

  streaming_tail.stdout.on("data", function(data) {
    response.write(data.toString());
  });

  response.connection.on("end", function() {
    non_streaming_tail.kill();
    streaming_tail.kill();
  });

}).listen(4000);
