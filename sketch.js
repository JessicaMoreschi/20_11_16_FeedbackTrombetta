let serial; // variable to hold an instance of the serialport library
let portName = '/dev/tty.usbmodem14101'; // fill in your serial port name here
// let options = {baudrate: 9600}; // change the data rate to whatever you wish
// serial.open(portName, options);
let inData; // for incoming serial data
let colore = 'FFFFFF'; //per cambiare il colore dell'ellisse
let coloreStroke = "#887b86";


function setup() {
  let myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.position(0,0);
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing

  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port
}

function serverConnected() {
  console.log('connected to server.');
}

function portOpen() {
  console.log('the serial port opened.')
}

function serialEvent() {
  inData = Number(serial.read());
  console.log(inData)
}

function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}

function portClose() {
  console.log('The serial port closed.');
}

// get the list of ports:
function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    console.log(i + portList[i]);
  }
}

function draw() {
   background("#f9f9f8");
   // fill(255);
   push();
   if(inData == 49){
     colore = "#887b86";
     coloreStroke = "#887b86";
   console.log('on')}
   else {
     colore = "#f9f9f8";
     coloreStroke = "#887b86" ;
   console.log('off')};
   fill(colore);
   stroke(coloreStroke);
   strokeWeight(5);
   ellipse(windowWidth/2,windowHeight/2,100);
   pop();
}
