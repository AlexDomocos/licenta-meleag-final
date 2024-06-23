#include <DHT.h>
#include <Stepper.h>

#define DHTPIN1 2   // Inside DHT sensor
#define DHTPIN2 3   // Outside DHT sensor
#define DHTTYPE DHT11

DHT dhtInside(DHTPIN1, DHTTYPE);
DHT dhtOutside(DHTPIN2, DHTTYPE);

#define IN1 8
#define IN2 9
#define IN3 10
#define IN4 11

const int stepsPerRevolution = 256;
const int stepsPerRevolutionSun = 128;
Stepper myStepper(stepsPerRevolution, IN1, IN3, IN2, IN4);

bool autonomousMode = false;
bool doorOpen = false;

unsigned long previousTempMillis = 0;
const long tempInterval = 60000; // Interval between temperature readings (60 seconds)

void setup() {
  Serial.begin(9600);
  dhtInside.begin();
  dhtOutside.begin();
  myStepper.setSpeed(100); // Adjust the speed of the motor as needed

}

void loop() {
  unsigned long currentMillis = millis();

  // Temperature readings every 60 seconds
  if (currentMillis - previousTempMillis >= tempInterval) {
    previousTempMillis = currentMillis;

    // Take the temperature reading
    takeTemperatureReading();
  }

  // Autonomous mode door control based on temperature
  if (autonomousMode) {
    float temperatureOutside = dhtOutside.readTemperature();
    if (temperatureOutside > 28.4 && !doorOpen) {
      Serial.println("Temperature above 28.4C. Opening door.");
      myStepper.step(-stepsPerRevolution); // Open the door
      doorOpen = true;
    } else if (temperatureOutside < 28.3 && doorOpen) {
      Serial.println("Temperature below 28.3C. Closing door.");
      myStepper.step(stepsPerRevolution); // Close the door
      doorOpen = false;
    }
  }

  // Check for commands
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    command.replace("\n", "");
    command.replace("\r", "");

    if (command == "READTEMP") {
      takeTemperatureReading();
    } else if (!autonomousMode) {
      if (command == "STARTSALCAM") {
        Serial.println("Received STARTSALCAM command. Starting motor.");
        myStepper.step(-stepsPerRevolution); // Rotate motor by 256 steps forward
        doorOpen = true;
      } else if (command == "STARTFLOAREASOARELUI") {
        Serial.println("Received STARTFLOAREASOARELUI command. Starting motor.");
        myStepper.step(-stepsPerRevolutionSun); // Rotate motor by 128 steps forward
        doorOpen = true;
      } else if (command == "STOPSALCAM") {
        Serial.println("Received STOPSALCAM command. Stopping motor.");
        myStepper.step(stepsPerRevolution); // Rotate motor by 256 steps backward
        doorOpen = false;
      } else if (command == "STOPFLOAREASOARELUI") {
        Serial.println("Received STOPFLOAREASOARELUI command. Stopping motor.");
        myStepper.step(stepsPerRevolutionSun); // Rotate motor by 128 steps backward
        doorOpen = false;
      } else if (command == "STARTAUTONOMOUS") {
        Serial.println("Autonomous mode activated.");
        autonomousMode = true;
      }
    }

    if (command == "STOPAUTONOMOUS") {
      Serial.println("Autonomous mode deactivated. Returning motor to original position.");
      autonomousMode = false;
      if (doorOpen) {
        myStepper.setSpeed(100);
        myStepper.step(stepsPerRevolution); // Close the door
        doorOpen = false;
      }
    }
  }
}

void takeTemperatureReading() {
 float temperatureInside = dhtInside.readTemperature();
  float humidityInside = dhtInside.readHumidity();
  float temperatureOutside = dhtOutside.readTemperature();
  float humidityOutside = dhtOutside.readHumidity();

  // Display sensor readings
  Serial.print(temperatureInside);
  Serial.print(",");
  Serial.print(humidityInside);
  Serial.print(",");
  Serial.print(temperatureOutside);
  Serial.print(",");
  Serial.println(humidityOutside);
}
