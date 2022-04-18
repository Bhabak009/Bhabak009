#include <Arduino.h>


int a=0;

void setup() {
Serial.begin(115200);
a=abc(10);
Serial.println(xPortGetCoreID());
}

void loop() {
Serial.println(a);
}
