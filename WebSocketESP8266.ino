#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>
#include <Hash.h>

//#define DEBUG
const char *ssid = "NOME_DA_REDE";
const char *password = "SENHA_DA_REDE";

String inputString = "";         // a string to hold incoming data
boolean stringComplete = false;  // whether the string is complete
char saida[128];

WebSocketsServer webSocket = WebSocketsServer(81);
uint8_t numClient = 255;

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t lenght) {
  switch (type) {
    case WStype_DISCONNECTED:
      numClient = 255;
#ifdef DEBUG
      Serial.printf("[%u] Disconnected!\n", num);
#endif
      break;

    case WStype_CONNECTED: {
        numClient = num;
#ifdef DEBUG
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
#endif
        // send message to client
        webSocket.sendTXT(num, "{\"Connected\"}");
      }
      break;
    case WStype_TEXT:
      Serial.printf("%s", payload);//pode incluir `/n` depois do %s
      break;
  }
}

void envia() {
  if (numClient == 255) {
    inputString = "";
    return;
  }
  size_t tam = inputString.length();
  inputString.toCharArray(saida, tam + 1);

  webSocket.sendTXT(numClient, saida, tam);
  inputString = "";
}

void setup() {
  Serial.begin(9600);
#ifdef DEBUG
  Serial.println();
  Serial.println();
  Serial.println();
#endif
  inputString.reserve(128);

  /**
     Set up an access point
     @param ssid          Pointer to the SSID (max 63 char).
     @param passphrase    (for WPA2 min 8 char, for open use NULL)
     @param channel       WiFi channel number, 1 - 13.
     @param ssid_hidden   Network cloaking (0 = broadcast SSID, 1 = hide SSID)
  */
  WiFi.softAP(ssid, password, 3, 0);
  for (uint8_t t = 4; t > 0; t--) {
#ifdef DEBUG
    Serial.printf("[SETUP] BOOT WAIT %d...\n", t);
    Serial.flush();
#endif
    delay(500);
  }

#ifdef DEBUG
  IPAddress myIP = WiFi.softAPIP();
  Serial.println(myIP);
#endif

  // start webSocket server
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);

}

void loop() {
  webSocket.loop();
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    if (inChar == '\n') {
      envia();
    } else {
      inputString += inChar;
    }
  }
}
