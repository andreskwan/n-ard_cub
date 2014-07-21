#include <math.h>

unsigned long UpdateDelay = 10UL * 60 * 5;	//Update frequency (5 minutes)

const byte Temperature1Pin = 0;	//Thermistor 1 (Outdoor)
const byte Temperature2Pin = 1;	//Thermistor 2 (Indoor)
const int Resistance1 = 9900;	//Ohms (measured from R10K of voltage divider 1)
const int Resistance2 = 9980;	//Ohms (measured from R10K of voltage divider 2)
const byte NbSamples = 8;	//Averaging
int   chartSend = 0; 
int   blinkRate=0;     // blink rate stored in this variable

const int led = 13;

void setup()
{
	Serial.begin(9600);	//Start serial port
        while (!Serial) {
            Serial.println("working"); // wait for serial port to connect. Needed for Leonardo only
        }
        //pin13
        pinMode(led, OUTPUT);     
}

void loop()
{
        
        strobe(500);
        chartSend = Serial.println("{\"p1o\":\"1\", \"p1c\":\"0\", \"p2o\":\" 100 \", \"celsius2\":\" 100 \"}");
        Serial.println(chartSend);
        delay(UpdateDelay);
}

void strobe(int lightDelay)
{
  digitalWrite(led, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(lightDelay);               // wait for a second
  digitalWrite(led, LOW);    // turn the LED off by making the voltage LOW
  delay(lightDelay);               // wait for a second
}

float thermistor(float rawADC, float rSeries)
{//http://arduino.cc/playground/ComponentLib/Thermistor2
	//This method is not very advanced
	long resistance = (1024 * rSeries / rawADC) - rSeries;
	float temp = log(resistance);
	temp = 1 / (0.001129148 + (0.000234125 * temp) + (0.0000000876741 * temp * temp * temp));
	return temp - 273.15;	//Kelvin to Celsius
}

