module.exports = (sequelize, DataTypes) =>{
    const customer = sequelize.define('customer', {

        id: {
            type            : DataTypes.INTEGER,
            primaryKey      : true,
            autoIncrement   : true
        },

        shopify_customer_id     : DataTypes.STRING,

        shopify_customer_email  : DataTypes.STRING

    },{
        freezeTableName: true
    });

    return customer;
}