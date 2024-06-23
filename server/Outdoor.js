const { DataTypes } = require("sequelize");
const sequelize = require("../database"); 
 
const Outdoor = sequelize.define(
  "Outdoor",
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
    },
  },
  {
    timestamps: true, 
  }
);
 
module.exports = Outdoor;
