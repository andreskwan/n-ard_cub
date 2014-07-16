#include <math.h>

unsigned long UpdateDelay = 1000UL * 60 * 5;	//Update frequency (5 minutes)

const byte Temperature1Pin = 0;	//Thermistor 1 (Outdoor)
const byte Temperature2Pin = 1;	//Thermistor 2 (Indoor)
const int Resistance1 = 9900;	//Ohms (measured from R10K of voltage divider 1)
const int Resistance2 = 9980;	//Ohms (measured from R10K of voltage divider 2)
const byte NbSamples = 8;	//Averaging

int led = 13;

void setup()
{
  
        //pin13
        pinMode(led, OUTPUT);     
        
        //example
	delay(1000);
	Serial.begin(9600);	//Start serial port

	pinMode(Temperature1Pin, INPUT);
	pinMode(Temperature2Pin, INPUT);
	digitalWrite(Temperature1Pin, LOW);
	digitalWrite(Temperature2Pin, LOW);
	analogRead(Temperature1Pin);
	analogRead(Temperature2Pin);
}

void loop()
{
        strove(500);
        
	float rawADC1 = 0.0;
	float rawADC2 = 0.0;
	
        for (byte i = NbSamples; i > 0; i--)
	{//Averaging over several readings
		rawADC1 += analogRead(Temperature1Pin);
		rawADC2 += analogRead(Temperature2Pin);
		delay(100);
	}
	rawADC1 /= NbSamples;
	rawADC2 /= NbSamples;

	//Sending a JSON string over Serial/USB like: {"ab":"123","bc":"234","cde":"3546"}
	Serial.println("{\"adc\":\"" + String((long)round(100.0 * rawADC1)) +
			"\", \"celsius\":\"" + String((long)round(100.0 * thermistor(rawADC1, Resistance1))) +
			"\", \"adc2\":\"" + String((long)round(100.0 * rawADC2)) +
			"\", \"celsius2\":\"" + String((long)round(100.0 * thermistor(rawADC2, Resistance2))) +
			"\"}");

	delay(UpdateDelay);
}

void strove(int lightDelay)
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

