module.exports = (sequelize, DataTypes)=>{
    const shipping_dock = sequelize.define("shipping_dock", 
    {
        id: {
            type:           DataTypes.INTEGER,
            primaryKey:     true,
            autoIncrement:  true,
        },

        name:   DataTypes.STRING,
        
        status: {
            type:   DataTypes.ENUM,
            values: ['0', '1']
        },
        
        created_at: DataTypes.DATEONLY,

        updated_at: DataTypes.DATE
        

    },{
        timestamps: true,
        freezeTableName: true
    });

    return shipping_dock;
};