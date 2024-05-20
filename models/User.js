const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class User extends Model {}

    User.init({
        // Define attributes
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize, // Pass the connection instance
        modelName: 'User', // Define the model name
        tableName: 'users' // Define the table name if different from the model name
    });

    return User;
};
