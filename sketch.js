// let SERIAL
let serial; // variable to hold an instance of the serialport library
let portName = '/dev/tty.usbmodem14101'; // fill in your serial port name here
// let options = {baudrate: 9600}; // change the data rate to whatever you wish
// serial.open(portName, options);
let inData; // for incoming serial data

// let TROMBETTA
let stadioIcon, trombaIcon, tscuraIcon; //icone
let h = 20; //altezza barra %;//altezza barra percentuale
let pos; //posizione
let palette = ['#F9F9F9', '#D5D0D3', '#B7AEB5', '#877B85'];
//variabile suono trombetta
let alt = 1; //h dei rettangoli suono
let i = 0; //regola ogni quanto cambia alt
let p_coord = 0; //var coordinazione
let n_trombetta = 0; //var piattaforma: quando alt!=1 viene incrementata
let n_interazione = 0; //var utente usa la trobetta, preme bottone
//se faccio ntrombetta/niterazione trovo la coordinazione

/////////////////////////////////////////////////////////////////////////

function preload() {
  stadioIcon = loadImage("./assets/immagini/stadio.png"); //trombetta scura
  trombaIcon = loadImage("./assets/immagini/trombettaBianca.png"); //trombetta chiara
  tscuraIcon = loadImage("./assets/immagini/tscura.png"); //trombetta chiara
  tut1Icon = loadImage("./assets/immagini/Trombetta_tut_1.png") //trombetta tutorial 1
  tut2Icon = loadImage("./assets/immagini/Trombetta_tut_2.gif") //trombetta tutorial 2
}

/////////////////////////////////////////////////////////////////////////

function setup() {
  let myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.position(0, 0);
  frameRate(22); //rallenta
  // setup SERIAL
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

/////////////////////////////////////////////////////////////////////////

function draw() {
  background('#F9F9F9'); //chiaro
  imageMode(CENTER); //per pittogrammi
  pos = width / 6; //posizione oggetti
  noStroke();
  //testo caratteristiche
  textFont('quicksand');
  textAlign(CENTER, TOP);
  textStyle(BOLD);

  //testo centrale
  textSize(20);
  fill('#877B85'); //4° colore PALETTE
  text('COOD O1', width / 2, height / 11);

  textSize(16);
  fill('#B7AEB5'); //3 PALETTE
  text('SQUADRA1-SQUADRA2', width / 2, height / 8);

  //testo laterale
  textSize(14);
  text('CAPIENZA', pos * 5, height / 5);
  text('COORDINAZIONE', pos, height / 5);

  //percentuale
  text('63%', pos * 5, height / 5 * 4.5); //dx
  image(stadioIcon, pos * 5, height / 7, stadioIcon.width / 7, stadioIcon.height / 7); //stadio

  //BARRE GRIGIA E VIOLA
  fill('#D5D0D3');
  //barre grige
  rectMode(CENTER);
  rect(width / 6, height / 6 * 3.3, 20, width / 3.5, 20); //rect(x,y,w,h,[tl]) h tot= 439 =  width / 3.5
  rect(width / 6 * 5, height / 6 * 3.3, 20, width / 3.5, 20);

  h = ((width / 3.5) / 100) * p_coord; //altezza barra %
  push();
  //barre viola
  rectMode(CORNER);
  fill('#877B85');
  rect(width / 6 - 10, height / 6 * 3.3 + width / 7, 20, -h, 20); //BARRA SX
  rect(width / 6 * 5 - 10, height / 6 * 3.3 + width / 7, 20, -300, 20); //BARRA DX
  pop();

  //barre laterali suono trombetta
  if (frameCount % 50 == 0) { //multiplo di 50 incrementa i
    i++
  }

  //barrette lato sinistro
  for (var x = width / 6 * 1.5; x < width / 2.2; x += 40) {
    if (i % 2 != 0) { //quando i è dispari altezza deve diventare 1*random
      alt = 1 * random(2, 10);
      n_trombetta++;
    } else {
      alt = 1;
      n_trombetta = 0.1;
    }
    //liniette suono della trombetta
    noStroke();
    fill(135, 123, 133);
    rectMode(CENTER);
    rect(x, height / 2, 20, 20 * alt, 20);
    rect(x + width / 3.15, height / 2, 20, 20 * alt, 20);
  }


  text(p_coord + '%', pos, height / 5 * 4.5); //sx
  console.log(' interazione ' + n_interazione);
  console.log(' trombetta ' + n_trombetta);


  //PER LA BARRA DELLA PERCENTUALE
  //interazione utente, temporaneamente tasto trombetta
  if (alt != 1 & inData == 49) {
    n_interazione += 4; // per far tornare la percentuale in pai alla trombetta
    p_coord = round((n_interazione / n_trombetta) * 100) * 2;
  } else if (alt = 1) {
    n_interazione = 0;
    p_coord = 0;
  }

  textSize(16);
  fill('#B7AEB5'); //3 PALETTE
  //TUTORIAL TROMBETTA
  if (i == 0 || i == 2) {
    image(tut1Icon, width / 2, height / 2, tut1Icon.width / 7, tut1Icon.height / 7);
    text('TUTORIAL', width / 2, height / 6 * 3.5);
  } else if (i == 1 || i == 3) {
    image(tut2Icon, width / 2, height / 2, tut2Icon.width / 7, tut2Icon.height / 7);
    text('TUTORIAL', width / 2, height / 6 * 3.5);
  }

  //ICONE NORMALI
  if (inData == 49 && i > 3) {
    push();
    fill('#877B85');
    stroke('#877B85');
    strokeWeight(5);
    ellipse(width / 2, height / 2, 100); //cerchio centrale
    image(trombaIcon, width / 2, height / 2, trombaIcon.width / 7, trombaIcon.height / 7);
    pop();
  } else if (inData == 49 == false && i > 3) { //cambio colore dle bottone centrale: feedback utente
    push();
    noFill();
    stroke('#877B85');
    strokeWeight(5);
    ellipse(width / 2, height / 2, 100); //cerchio centrale
    image(tscuraIcon, width / 2, height / 2, tscuraIcon.width / 7, tscuraIcon.height / 7); // trombetta scura
    pop();
  }
}

// function SERIAL
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

// function TROMBETTA
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
