const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    logging: console.log,
  }
);

const User = require("./User")(sequelize, Sequelize.DataTypes);
const Task = require("./Task")(sequelize, Sequelize.DataTypes);

User.associate = (models) => {
  User.hasMany(models.Task, { foreignKey: "userId", as: "tasks" });
};
Task.associate = (models) => {
  Task.belongsTo(models.User, { foreignKey: "userId", as: "user" });
};

const db = {
  sequelize,
  Sequelize,
  User,
  Task,
};

module.exports = db;
