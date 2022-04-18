const user = require("./user");

module.exports = (sequelize, DataTypes)=>{
    const order = sequelize.define("order", 
    {
        id: {
            type:           DataTypes.INTEGER,
            primaryKey:     true,
            autoIncrement:  true,
        },

        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "user",
                key:   "id"
            }
        },

        amount: DataTypes.DECIMAL(10,2),

        tax: DataTypes.DECIMAL(10,2),

        notes: DataTypes.TEXT,
        
        status: {
            type:   DataTypes.ENUM,
            values: ['0', '1']
        } ,

        created_at: DataTypes.DATEONLY,

        updated_at: DataTypes.DATE,
        

    },{
        timestamps: true,
        freezeTableName: true
    });


    return order;
};