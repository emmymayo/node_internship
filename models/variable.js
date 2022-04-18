module.exports = (sequelize, DataTypes) => {
    const variable = sequelize.define(
      "variable",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: DataTypes.STRING,
        type: DataTypes.STRING,
        created_at: DataTypes.DATEONLY,
        updated_at: DataTypes.DATE,
      },
      {
        timestamps: true,
        freezeTableName: true,
        tableName: "variable",
      },
      {
        underscoredAll: false,
        underscored: false,
      }
    );
  
    return variable;
  };