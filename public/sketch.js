let socket = io();
let myColor = "white";

socket.on("connect", newConnection); //quando mi connetto, chiama funzione newConnection
socket.on("mouseBroadcast", drawOtherMouse); //quando arriva messaggio "mouseBroadcast", drawOtherMouse()
socket.on("color", setColor) //quando arriva sms "color", ssetColor();

function newConnection(){
  console.log("your ID: " + socket.id) //mostra mio codice connessione
}

function drawOtherMouse(data){  //disegna ellissi di altri client
  fill(data.color);
  ellipse(data.x, data.y, 10)
}

function setColor(assignedColor){ //assegna un  colore a variabile new color
  myColor = assignedColor;
}

function preload(){
}

function setup() {
  createCanvas(windowWidth,windowHeight)

  background("red")
}

function draw() {
}

function mouseMoved(){
  push();
    fill(myColor);
    ellipse(mouseX, mouseY, 20);
  pop();
    //crea messaggio
    let message = {
      x: mouseX,
      y: mouseY,
      color: myColor
    };
  //send to the server
  socket.emit("mouse", message);
}
