console.log("node is running")


// crea local server
let express = require("express"); //Load the express code
let socket = require("socket.io"); //Load the socket package
let app = express(); //create local host
let port = 3000;  //dichiara server port (3000 standard)
let server = app.listen(port);  //aspetta che qualcuno si connetta (da browser "localhost:3000")
                                //per stoppare (ctrl+c); per riavviare "node server.js" (da terminale)

//crea folder per client ("public")
app.use(express.static("public")); //mostra ai clienti la certella public


//crea connessione input/output
let io = socket(server)//variabile input output: crea connessione input (da cliente to server)
io.on("connection", newConnection) //all'evento "connection" esegui "newConnection()"
                                   // = esegui ogni volta che si crea una nuova connessione

function newConnection(socket){
  console.log("new connection: " + socket.client.id)   //mostra codice connessione cliente

  let clienColor = getRandomColor();
  socket.emit("color", clienColor);   //manda messaggio "color" con result di getRandomColor

  socket.on("mouse", mouseMessage);  //se arriva un messaggio di tipo "mouse" dal client(nello sketch), mouseMessage()

  function mouseMessage(dataReceived){
    console.log(socket.client.id, dataReceived);
    socket.broadcast.emit("mouseBroadcast", dataReceived) //crea nuovo messaggio da emettere a ogni client
  }
}


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
