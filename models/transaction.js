module.exports = (sequelize, DataTypes)=>{
    const transaction = sequelize.define("transaction", 
    {
        id: {
            type:           DataTypes.INTEGER,
            primaryKey:     true,
            autoIncrement:  true,
        },

        order_id: {
            type: DataTypes.INTEGER,
            references: {
                model:  "order",
                key:    "id"
            }  
        },

        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model:  "user",
                key:    "id"
            }  
        },

        shipping_dock_id: {
            type: DataTypes.INTEGER,
            references: {
                model:  "shipping_dock",
                key:    "id"
            }  
        },

        amount: DataTypes.DECIMAL(10,2),

        notes:  DataTypes.TEXT,

        created_at: DataTypes.DATEONLY,

        updated_at: DataTypes.DATE
        
        

    },{
        timestamps: true,
        freezeTableName: true
    });

    transaction.associate = (db)=>{
        db.transaction.belongsTo(db.order);
    }

    return transaction;
};