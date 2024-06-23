const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 9600 });
const sequelize = require("./database");
const Outdoor = require("./models/Outdoor");
const Indoor = require("./models/Indoor");
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

const { Op ,fn, col } = require('sequelize');
 
async function getUniqueIndoorDates() {
    try {
        const uniqueDates = await Indoor.findAll({
            attributes: [
                [fn('date', col('measuredAt')), 'uniqueDate'] 
            ],
            group: [fn('date', col('measuredAt'))], 
            order: [[fn('date', col('measuredAt')), 'DESC']] 
        });
 
        return uniqueDates.map(entry => entry.getDataValue('uniqueDate'));
    } catch (error) {
        console.error('Error fetching unique dates:', error);
        return [];
    }
}

 
async function getUniqueOutdoorDates() {
    try {
        const uniqueDates = await Outdoor.findAll({
            attributes: [
                [fn('date', col('measuredAt')), 'uniqueDate']
            ],
            group: [fn('date', col('measuredAt'))], 
            order: [[fn('date', col('measuredAt')), 'DESC']] 
        });
 
   
        return uniqueDates.map(entry => entry.getDataValue('uniqueDate'));
    } catch (error) {
        console.error('Error fetching unique dates:', error);
        return [];
    }
}


async function getIndoorEntriesByDate(dateString) {
    try {
        const startDate = new Date(dateString);
        const endDate = new Date(dateString);
        endDate.setDate(endDate.getDate() + 1);

        const entries = await Indoor.findAll({
            where: {
                measuredAt: {
                    [Op.gte]: startDate,
                    [Op.lt]: endDate
                }
            }
        });

        return entries;
    } catch (error) {
        console.error('Error fetching indoor entries:', error);
        return [];
    }
}

async function getOutdoorEntriesByDate(dateString) {
    try {
        const startDate = new Date(dateString);
        const endDate = new Date(dateString);
        endDate.setDate(endDate.getDate() + 1);

        const entries = await Outdoor.findAll({
            where: {
                measuredAt: {
                    [Op.gte]: startDate,
                    [Op.lt]: endDate
                }
            }
        });

        return entries;
    } catch (error) {
        console.error('Error fetching outdoor entries:', error);
        return [];
    }
}


 

 
parser.on("data", (data) => {
    console.log("Data received:", data);
    io.emit("fromArduino", data);
    let tempData = data.split(",");
    if(tempData.length == 4){
        const indoorTemperature = parseFloat(tempData[0]);
        const indoorHumidity = parseFloat(tempData[1]);
        const outdoorTemperature = parseFloat(tempData[2]);
        const outdoorHumidity = parseFloat(tempData[3].slice(0,-1));
        const date = new Date();
        const currentMinute = date.getMinutes();


        if(currentMinute === 30 || currentMinute === 0)
        {
            Indoor.create({ temperature: indoorTemperature , humidity: indoorHumidity }).then(() => console.log("Indoor data saved.")).catch((err) => console.log("Error saving indoor data:", err));
            Outdoor.create({ temperature: outdoorTemperature , humidity: outdoorHumidity }).then(() => console.log("Outdoor data saved.")).catch((err) => console.log("Error saving outdoor data:", err));
        }
    }
});
 
io.on("connection", (socket) => {
  console.log("A user connected");

 
  socket.on("command_to_arduino", (command) => {
    console.log("Command to Arduino:", command);
    port.write(command + "\n", (err) => {
      if (err) {
        return console.log("Error on write:", err.message);
      }
      console.log("Command sent to Arduino");
    });
  });
    socket.on("requestIndoorDates", async () => {
    const dates = await getUniqueIndoorDates();
    socket.emit("responseData" , dates);
  });
      socket.on("requestOutdoorDates", async () => {
    const dates = await getUniqueOutdoorDates();
    socket.emit("responseData" , dates);
  });
    socket.on("requestIndoorDataFromDates", async (dateString) => {
    const data = await getIndoorEntriesByDate(dateString.date);
    console.log(data);
    socket.emit("responseData" , data);
  })
    socket.on("requestOutdoorDataFromDates", async (dateString) => {
    const data = await getOutdoorEntriesByDate(dateString.date);
    console.log(data);
    socket.emit("responseData" , data);
  })
 
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
 
server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
