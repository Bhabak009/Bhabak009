#include <ArduinoJson.h>
#include "AsyncJson.h"
#include <ArduinoJson.hpp>
#include "WiFi.h"
#include "ESPAsyncWebServer.h"
#include <Preferences.h>

AsyncWebServer server1(80);
AsyncWebServer server2(8000);
Preferences preferences;

String ssid;
String password;
String uid;
bool iswifiset;

void setwifi(){
  WiFi.softAP("smart_energy","");
  Serial.print("AP IP address: ");
  Serial.println(WiFi.softAPIP());

  server1.on("/scan", HTTP_GET,[](AsyncWebServerRequest *request){    
    int n = WiFi.scanNetworks(false,true);
    AsyncResponseStream *response = request->beginResponseStream("application/json");
    // response->addHeader("Access-Control-Allow-Origin", "*");
    // response->addHeader("Access-Control-Allow-Headers", "*");
    // response->addHeader("Access-Control-Allow-Private-Network", "true");
    // response->addHeader("Access-Control-Expose-Headers", "origin, x-requested-with, content-type");
    // response->addHeader("Access-Control-Allow-Credentials", "true");
    // response->addHeader("hello", "hi");
    DynamicJsonBuffer jsonBuffer;
    JsonObject &root = jsonBuffer.createObject();
    for(int i=0;i<n;i++){
      root[WiFi.SSID(i)] = WiFi.RSSI(i);
      Serial.println(WiFi.SSID(i));
    }
    root.printTo(*response);
    root.printTo(Serial);

    request->send(response);
  });

  server1.on("/wifi", HTTP_POST, [](AsyncWebServerRequest *request){
    AsyncResponseStream *response = request->beginResponseStream("application/json");
    // response->addHeader("Access-Control-Allow-Origin", "http://smart-energy-bpp.herokuapp.com/new-device");
    // response->addHeader("Access-Control-Allow-Headers", "*");
    // response->addHeader("Access-Control-Allow-Private-Network", "true");
    // response->addHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    // response->addHeader("Access-Control-Expose-Headers", "origin, x-requested-with, content-type");
    // response->addHeader("Access-Control-Allow-Credentials", "true");
    int headers = request->headers();
    int i;
    for(i=0;i<headers;i++){
      AsyncWebHeader* h = request->getHeader(i);
      Serial.printf("HEADER[%s]: %s\n", h->name().c_str(), h->value().c_str());
    }

    if(request->hasHeader("ssid")){
    AsyncWebHeader* h = request->getHeader("ssid"); 
    ssid=h->value().c_str();
    Serial.printf("ssid: %s\n", h->value().c_str());
    }

    if(request->hasHeader("password")){
    AsyncWebHeader* h = request->getHeader("password");
    password=h->value();
    Serial.printf("password: %s\n", h->value().c_str());
    }

    if(request->hasHeader("uid")){
    AsyncWebHeader* h = request->getHeader("uid");
    uid=h->value();
    Serial.printf("uid %s\n", h->value().c_str());
    }    

    WiFi.begin(ssid.c_str(),password.c_str());
    for(int i=0;i<20;i++) {
      delay(500);
      Serial.println("Connecting to WiFi..");
      if(WiFi.status()==WL_CONNECTED)break;
    }
    
    if(WiFi.status()==WL_CONNECTED){  
      delay(100);

      request->send(response);
      delay(200);
      Serial.println("connected");
      response->addHeader("connection_status", "connected");
      Serial.println(WiFi.localIP());
      preferences.putString("ssid",ssid);
      preferences.putString("password",password);
      preferences.putString("uid",uid);
      iswifiset=1;
      preferences.putBool("iswifiset",iswifiset);
      WiFi.softAP("esp_internal_hidden","esp32_smart_energy",1,1,8);    
      server1.end();
    }
    else{
      response->addHeader("connection_status", "not connected");
      request->send(response);
      Serial.println("not connected");
    }
  });

  server1.onNotFound([](AsyncWebServerRequest *request) {
  if (request->method() == HTTP_OPTIONS) {
    request->send(200);
  } else {
    request->send(404);
  }
  }); 
  server1.begin();
}

// void task2(){
//     server2.onNotFound([](AsyncWebServerRequest *request) {
//   if (request->method() == HTTP_OPTIONS) {
//     request->send(200);
//   } else {
//     request->send(404);
//   }
// });

//     server2.on("/test", HTTP_POST, [](AsyncWebServerRequest *request){
//       int headers = request->headers();
//       Serial.println(headers);
//       request->send(200,"text/plain","ok");
//     });

//     server2.begin();
// }

void setup() {
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Private-Network", "true");  
  preferences.begin("myfile", false);	
  ssid = preferences.getString("ssid","");
  password = preferences.getString("password","");
  uid = preferences.getString("uid","");  
  iswifiset = preferences.getBool("iswifiset",false);
  WiFi.mode(WIFI_MODE_APSTA);
  Serial.begin(115200);
  if(iswifiset==false)setwifi();
  else{ 
    password.replace(" ", "");
    ssid.replace(" ", "");
    uid.replace(" ", "");
    Serial.println(password);
    Serial.println(ssid);
    Serial.println(uid);    
    WiFi.begin(ssid.c_str(),password.c_str());
    for(int i=0;i<20;i++) {
      delay(500);
      Serial.println("Connecting to WiFi..");
      if(WiFi.status()==WL_CONNECTED)break;
    }
    if(WiFi.status()==WL_CONNECTED){  
      Serial.println("connected");
      Serial.println(WiFi.localIP());
    }
  }
  // task2();
}

void reset() {
  if (Serial.available() > 0) {
    // read the incoming byte:
    int incomingByte = Serial.read();

    preferences.clear();
    ESP.restart();

  }
}
