// models/Task.js

module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        dueDate: {
            type: DataTypes.DATE,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    Task.associate = (models) => {
        Task.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return Task;
};
