var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found.');
  response.end();
}

function sendFile(response, filePath, fileContents){
  response.writeHead(
    200,
    {"content-type": mime.getType(path.basename(filePath))}
  );
  response.end(fileContents);
}

function serveStatic(response, cache, absPath){
  if(cache[absPath]){
    console.log(cache);
    sendFile(response, absPath, cache[absPath]);
  } else {
    console.log(absPath);
    fs.exists(absPath, function(exists){
      if(exists){
        fs.readFile(absPath, function(err, data){
          if(err){
            send404(response);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data);
          }
        });
      } else {
        send404(response);
      }
    })
  }
}

var server = http.createServer(function(request, response){
  var filePath = false;
  console.log(filePath);
  if(request.url == '/'){
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + request.url;
  }

  var absPath = './' + filePath;
  console.log(absPath);
  serveStatic(response, cache, absPath);
});

server.listen(3000, function(){
  console.log("Server is listening on port 3000");
});

var chatServer = require('./lib/chat_server');
chatServer.listen(server);
