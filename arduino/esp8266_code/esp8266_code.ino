#include <dummy.h>

#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include "EmonLib.h"
#include <ArduinoJson.h>
#include <FirebaseESP8266.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 19800);

String pathTime = "";
String pathPower = "";
EnergyMonitor emon1;
//const long utcOffsetInSeconds = 19800;
int last_index = 0;
const char* ssid = "Bappa_2.4_1";
const char* password = "souvik2001";

#define API_KEY "AIzaSyADCZSDj0wHLCkJU5W6HN2iyo7y978SRec"
#define FIREBASE_PROJECT_ID "smartenergyconservation"
#define FIREBASE_CLIENT_EMAIL "firebase-adminsdk-l04hs@smartenergyconservation.iam.gserviceaccount.com"
const char PRIVATE_KEY[] PROGMEM = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCfICzqZc4p1l2T\nH7Dex6MlPvV8Zbw2pj8AiZzGAPMOePn0UiX9dou4TpPLB+D7hD8cCnypReWPwx0E\nJV0tmSHHDWwF9eTpNxKI+mEOp2bbWJThxYpBcX4lZemNFz53rEEqnHSCXEp3oqnD\ng+tIKTPmQyO8AChducCjRlCJ1qWFHU1av+UoNxqr77j56KtTgTBYkqsPlbvT7UTH\nNoXsI3/hNN4TIPgPbt1nlb0HKbs0b/8E8oIlsq7Y+PyW5Fhj8RG5kUpruRbmPJbV\nfVqwCiVwOo95ZqHZHilbaBg0HaLbsDyhbntY/QZfbP+gN3uEMk5T4PgbTvaLNK47\nXSw1hyQlAgMBAAECggEACiR5oG4hRCro93v1YNnONQ1MheORKdWSXfUnhDpiw6kj\n23YR/FQeRz7g7jfAGB//isjDVeHB5lYsJwu/ouyoCcE6Aa5A6zmKqab14UJ7zJ7a\njIJ0E8RJY1ZZ2tegsG2PEMl8pqN9zp7UXcUujcCskXB1mmHTMNgqZm3Qq9x929xe\nyuvg4beZ72IikOBxhfjl77i55fT25TkIu6CQDQu3MKOc7mIsuDmBCXXAGk1GaFyJ\nCLyPMFBEBWsyKZ+uCH2IpIOzknq82fiHkSF08dD8VHSmlpeTqG39bx0ylX1Pc+TA\ndePRIU6HvgdY9L7AdspA+yqjT4MpXSIFBxrYgXqpgQKBgQDMLWaEVU7Utb464Xw7\nQ2KhgLH3UyL1gmP18r9sJLZDTUyT+vZIWcVjQnKD6D0a6P88bekwE2x9AtrlLAzG\nXOtTuOZ0V11LwU/3H114/2XVTESNxTAx6R4Ebj+jk8D8ZaOcfHRkJQYlm/sRtduN\nHaTErdBAWBx6y6bWsjNGBssvgQKBgQDHg4EiF+4KPbU2Bji4Sq5ttjUVUfmnvdCV\nlpC05fnWzwc36JKt+Bx2Dnm08U49QDavLUTsl6G3t08RaD9E69qixipo3BiLWYtR\nPglTCLJG49/B++e7m6I0JjC7bdL6gAawnwnPEFFUpgXmvVFU4XnVXtChkX9PlxU5\nedHXk7SGpQKBgQCFX1rKMteNxzJ+T/DQ3ZG+Ic0e3CXH7ebSMEGuqMSObh4JxDPA\nyzNPRYZ8d+YCgBTKKpnal7WUa5sFfKLTqLroM64GbVM6Owq7SLfMZDjm/i0B1r9G\nuxqqlkHn3op/1PztKbb1++FqC9wTk5HZOnX5K/kPLv9bj1BqinlH0wRDAQKBgQCr\nLKSKP8W3e6IRq9zWIRzufDmnBSIRTMW80eVtjzJ/njgvO5c9M3YXw+uf1ritzH4e\nZdSQuLfDC78GzE4cL87xgNu6A7v7MuRY28TcPMXYFIJRyHLVf333CB0fceZljZov\nxwN/aByfZ6IAicVR8fG5oxOUy2RTQOiw21eygcONEQKBgF298HH3Hc2TZQjQemh8\nt37as4NPs0DRiS9EzvEn4Uq+FbsD8Nh4AnkylyQOJHUMbLn62AKNvuawrmrgObpP\npFGrraXZRP85udtfCueXhZ8bQwIyd7irPHGHZylKjNzrnbkixZFTS0zaPMxTE8d8\nSEk39iz0dkMu9AdKzw3kabDY\n-----END PRIVATE KEY-----\n";
#define DATABASE_URL "https://smartenergyconservation-default-rtdb.asia-southeast1.firebasedatabase.app/" //<databaseName>.firebaseio.com or <databaseName>.<region>.firebasedatabase.app
#define DATABASE_SECRET "ni6lsLkaZzWgTqlPLRSraeO0lxWv6BwZ89Asy72n"
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;


unsigned long lastTime = 0;
unsigned long timerDelay = 10000;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println(WiFi.macAddress());
  WiFi.setAutoReconnect(true);
  WiFi.persistent(true);

  config.api_key = API_KEY;
  config.service_account.data.client_email = FIREBASE_CLIENT_EMAIL;
  config.service_account.data.project_id = FIREBASE_PROJECT_ID;
  config.service_account.data.private_key = PRIVATE_KEY;
  auth.token.uid = "Node1";

  //    FirebaseJson claims;
  //    claims.add("premium_account", true);
  //    claims.add("admin", true);
  //    auth.token.claims = claims.raw();

  config.database_url = DATABASE_URL;
  Firebase.reconnectWiFi(true);
  fbdo.setResponseSize(4096);
  String base_path = "/NewUser/";
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h
  config.max_token_generation_retry = 10;
  Firebase.begin(&config, &auth);
  
  String var = "$userId";
  String val = "($userId === auth.uid && auth.token.premium_account === true && auth.token.admin === true)";
  Firebase.setReadWriteRules(fbdo, base_path.c_str(), var.c_str(), val.c_str(), val.c_str(), DATABASE_SECRET);
  emon1.current(A0, 91);
  timeClient.begin();
}
int cnt = 0;
double Power = 0;
double Irms = 0;
int index_set = 0;

void loop() {
  if (Firebase.ready() && ((millis() - lastTime) > timerDelay) && index_set == 0) {
    if (Firebase.pushInt(fbdo, "/NewUser/node1/connectionlog", true)) {
      timeClient.update();
      int connection_time_epoch = timeClient.getEpochTime();
      String u_key = fbdo.pushName();

      String connection_time = "/NewUser/node1/connectiontime/" + u_key;

      Firebase.setInt(fbdo, connection_time.c_str(), connection_time_epoch);
      Serial.println("set log %s\n" + Firebase.getInt(fbdo, "/NewUser/node1/lastIndex", &last_index) ? "ok" : fbdo.errorReason().c_str());
      Serial.println(last_index);
      cnt = last_index + 1;
      index_set = 1;
      delay(500);
    }
    else fbdo.errorReason().c_str();

  }
  if (((millis() - lastTime) > timerDelay || lastTime == 0) && index_set == 1 && Firebase.ready()) {
    if (WiFi.status() == WL_CONNECTED) {
      //       WiFiClient client;
      //       HTTPClient http;

      Irms = emon1.calcIrms(1480);
      Power = Irms;
      //     Serial.print(Irms*235.0);
      //     Serial.print(" ");
      //     Serial.println(Irms);
      //     Serial.println("Sending " +String(Irms)+String(Irms*235.0));
      timeClient.update();
      int Time = timeClient.getEpochTime();
      pathTime = "/NewUser/node1" ;
      //     pathTime += auth.token.uid.c_str();
      pathTime += "/Time/";

      pathPower = "/NewUser/node1";
      //     pathPower += auth.token.uid.c_str();
      pathPower += "/Power/";

    

        pathTime += String(cnt);
        pathPower += String(cnt);
        Firebase.setInt(fbdo, pathTime.c_str(), Time);
        //        Serial.println("sending");
        Firebase.setDouble(fbdo, pathPower.c_str(), Power);
        Firebase.setDouble(fbdo, "/NewUser/node1/lastIndex", cnt);
        //        Serial.println("sent");
        //        Serial.printf("Set Time... %s\n", Firebase.setInt(fbdo, pathTime.c_str(), Time) ? "ok" : fbdo.errorReason().c_str());
        //        Serial.printf("Set Power... %s\n", Firebase.setDouble(fbdo, pathPower.c_str(), Power) ? "ok" : fbdo.errorReason().c_str());
        cnt++;
      


    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();

  }
}
