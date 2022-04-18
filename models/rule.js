module.exports = (sequelize, DataTypes) => {
    const rule = sequelize.define(
      "rule",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: DataTypes.STRING,
        condition: DataTypes.STRING,
        action: DataTypes.STRING,
        created_at: DataTypes.DATEONLY,
        updated_at: DataTypes.DATE,
      },
      {
        timestamps: true,
        freezeTableName: true,
        tableName: "rule",
      },
      {
        underscoredAll: false,
        underscored: false,
      }
    );
  
    return rule;
  };