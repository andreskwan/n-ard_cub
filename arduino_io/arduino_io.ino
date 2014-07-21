#include <math.h>

unsigned long UpdateDelay = 10UL * 60 * 5;	//Update frequency (5 minutes)

const byte Temperature1Pin = 0;	//Thermistor 1 (Outdoor)
const byte Temperature2Pin = 1;	//Thermistor 2 (Indoor)
const int Resistance1 = 9900;	//Ohms (measured from R10K of voltage divider 1)
const int Resistance2 = 9980;	//Ohms (measured from R10K of voltage divider 2)
const byte NbSamples = 8;	//Averaging
int   chartSend = 0; 
int   blinkRate=0;     // blink rate stored in this variable

const int ledPin = 13;

void setup()
{
	Serial.begin(9600);	//Start serial port
        while (!Serial) {
            Serial.println("working"); // wait for serial port to connect. Needed for Leonardo only
        }
        //pin13
        pinMode(ledPin, OUTPUT);     
}

void loop()
{
  if ( Serial.available()) // Check to see if at least one character is available
  {
    char ch = Serial.read();
    if( isDigit(ch) ) // is this an ascii digit between 0 and 9?
    {
       blinkRate = (ch - '0');      // ASCII value converted to numeric value
       blinkRate = blinkRate * 100; // actual rate is 100ms times received digit”       
    }
  }
  blink();
}

// blink the ledPin with the on and off times determined by blinkRate
void blink()
{
  digitalWrite(ledPin,HIGH);
  delay(blinkRate); // delay depends on blinkrate value
  digitalWrite(ledPin,LOW);
  delay(blinkRate);
}

void strobe(int lightDelay)
{
  digitalWrite(ledPin, HIGH);   // turn the ledPin on (HIGH is the voltage level)
  delay(lightDelay);               // wait for a second
  digitalWrite(ledPin, LOW);    // turn the ledPin off by making the voltage LOW
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

