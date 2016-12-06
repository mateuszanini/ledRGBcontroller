#include <SoftwareSerial.h>
//bibliotecas para o HDC1080
#include <Wire.h>
#include "ClosedCube_HDC1080.h"

ClosedCube_HDC1080 hdc1080;

//RX pino 2, TX pino 3
SoftwareSerial esp8266(2, 3);

//pinos do led:
const int redPin = 9;
const int greenPin = 10;
const int bluePin = 11;

//modo e cor do led
int modo = 0;
int tempo = 0;
int red = 255;
int green = 0;
int blue = 0;

//umidade e temperatura
float temperatura = 0;
float umidade = 0;

//millis para enviar temperatura
unsigned long millisAnteriorTemperatura = 0;
const long intervaloTemperatura = 1000;

void setup() {
  Serial.begin(9600);
  esp8266.begin(9600);

  hdc1080.begin(0x40);

  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
}

void loop() {
  //lê os dados da serial do ESP
  lerDados();

  //lê temperatura e umidade e envia para o WebSocket
  unsigned long millisAtualTemperatura = millis();
  if (millisAtualTemperatura - millisAnteriorTemperatura >= intervaloTemperatura) {
    millisAnteriorTemperatura = millisAtualTemperatura;
    temperatura = hdc1080.readTemperature();
    umidade = hdc1080.readHumidity();
    //envia para o WebSocket
    esp8266.print("{\"t\":");
    esp8266.print(temperatura);
    esp8266.print(",\"u\":");
    esp8266.print(umidade);
    esp8266.println("}");

    //imprime na serial
    /*Serial.print("T= ");
      Serial.print(temperatura);
      Serial.print(" C\tU= ");
      Serial.print(umidade);
      Serial.println(" %");*/

    //se o modo for temperatura, chama a função temperatura
    if (modo == 1) {
      modoTemperatura();
    }
  }
}

//lê os dados da serial do ESP
void lerDados() {
  while (esp8266.available() > 0) {

    modo = esp8266.parseInt();
    /*
        modo 1 = temperatura (1 0 0 0 0)
        modo 2 = rgb (2 0 red green blue)
        modo 3 = fade (3 20 0 0 0)
        modo 4 = strobo (4 tempo red green blue) //irá pegar a cor definida no modo 2
    */
    tempo = esp8266.parseInt();
    red = esp8266.parseInt();
    green = esp8266.parseInt();
    blue = esp8266.parseInt();

    if (esp8266.read() == '\n') {

      //modo = constrain(modo, 0, 2);
      red = 255 - constrain(red, 0, 255);
      green = 255 - constrain(green, 0, 255);
      blue = 255 - constrain(blue, 0, 255);

      switch (modo) {
        case 1:
          modoTemperatura();
          break;
        case 2:
          modoRgb();
          break;
        case 3:
          modoFade();
          break;
        case 4:
          modoStrobo();
          break;
        default:
          Serial.println("Modo invalido\n");
          break;
      }
    }
  }
}
/*LIGA E DESLIGA O LED*/
void ligaLed() {
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);
}
void desligaLed() {
  analogWrite(redPin, 255);
  analogWrite(greenPin, 255);
  analogWrite(bluePin, 255);
}

/*MODO STROBO [4]*/
void modoStrobo(){
  debug();
  while(modo == 4){
    ligaLed();
    delay(tempo);
    desligaLed();
    delay(tempo);
    lerDados();//a cada execução lê os dados da serial para verificar se o modo não foi alterado
  }
}

/*MODO RGB [2]*/
void modoRgb() {
  debug();
  ligaLed();
}

/*MODO FADE [3]*/
void modoFade() {
  red = 255;
  blue = 0;
  green = 0;
  int delayTime = 20;

  for (int i = 0 ; i < 255 ; i += 1 ) {
    green += 1;
    red -= 1;
    analogWrite(greenPin, 255 - green);
    analogWrite(redPin, 255 - red);
    delay(delayTime);
    lerDados();
  }

  red = 0;
  blue = 0;
  green = 255;
  for (int i = 0 ; i < 255 ; i += 1 ) {
    blue += 1;
    green -= 1;
    analogWrite(bluePin, 255 - blue);
    analogWrite(greenPin, 255 - green);
    delay(delayTime);
    lerDados();
  }

  red = 0;
  blue = 255;
  green = 0;
  for (int i = 0 ; i < 255 ; i += 1 ) {
    red += 1;
    blue -= 1;
    analogWrite( redPin, 255 - red );
    analogWrite( bluePin, 255 - blue );
    delay( delayTime );
    lerDados();
  }

  modoFade();
}

/*MODO TEMPERATURA [1]*/
void modoTemperatura() {
  //debug();
  if (temperatura <= -5.00) {
    red = 102;
    green = 2;
    blue = 232;
    ligaLed();
  }
  if (temperatura > -5.00 && temperatura <= 0.00) {
    red = 0;
    green = 138;
    blue = 255;
    ligaLed();
  }
  if (temperatura > 0.00 && temperatura <= 5.00) {
    red = 18;
    green = 233;
    blue = 255;
    ligaLed();
  }
  if (temperatura > 5.00 && temperatura <= 10.00) {
    red = 6;
    green = 255;
    blue = 138;
    ligaLed();
  }
  if (temperatura > 10.00 && temperatura <= 15.00) {
    red = 0;
    green = 232;
    blue = 0;
    ligaLed();
  }
  if (temperatura > 15.00 && temperatura <= 20.00) {
    red = 192;
    green = 255;
    blue = 0;
    ligaLed();
  }
  if (temperatura > 20.00 && temperatura <= 25.00) {
    red = 255;
    green = 248;
    blue = 0;
    ligaLed();
  }
  if (temperatura > 25.00 && temperatura <= 30.00) {
    red = 255;
    green = 146;
    blue = 0;
    ligaLed();
  }
  if (temperatura > 30.00 && temperatura <= 35.00) {
    red = 232 ;
    green = 66 ;
    blue = 0;
    ligaLed();
  }
  if (temperatura > 35.00) {
    red = 255;
    green = 0;
    blue = 0;
    ligaLed();
  }
}

void debug() {
  Serial.print("Modo: ");
  Serial.print(modo);
  Serial.print("\tTempo: ");
  Serial.println(tempo);
  Serial.print("Red: ");
  Serial.print(red);
  Serial.print("\tGreen: ");
  Serial.print(green);
  Serial.print("\tBlue: ");
  Serial.println(blue);
}
