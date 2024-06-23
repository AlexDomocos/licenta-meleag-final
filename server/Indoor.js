const { DataTypes } = require("sequelize");
const sequelize = require("../database"); 
 
const Indoor = sequelize.define(
  "Indoor",
  {
    temperature: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    humidity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    measuredAt: {  
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, 
    }
  },
  {
    timestamps: true, 
  }
);
 
module.exports = Indoor;
