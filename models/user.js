module.exports = (sequelize, DataTypes)=>{
    const user = sequelize.define("user", 
    {
        id: {
            type:           DataTypes.INTEGER,
            primaryKey:     true,
            autoIncrement:  true,
        },

        name:       DataTypes.STRING,

        email:      DataTypes.STRING,

        status:     DataTypes.ENUM('0', '1'),

        created_at: DataTypes.DATEONLY,
        
        updated_at: DataTypes.DATE

    },{
        timestamps:      true,
        freezeTableName: true
    });

    return user;
};