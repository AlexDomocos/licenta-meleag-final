const sequelize = require('./database');
const Indoor = require('./models/Indoor');
const Outdoor = require('./models/Outdoor');
 
sequelize.sync({ force: true }) 
  .then(() => {
    console.log("Database and tables created!");
  })
  .catch(error => {
    console.error("Failed to create database and tables:", error);
  })
