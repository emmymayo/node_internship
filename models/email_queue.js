module.exports = (sequelize, DataTypes) => {

    const email_queue = sequelize.define('email_queue', {
        id: {
            type:           DataTypes.INTEGER,
            primaryKey:     true,
            autoIncrement:  true
        },

        email_id: {
            type:       DataTypes.INTEGER,
            references: {
                model: 'email',
                key:    'id'
            }
        },

        user_id: {
            type:       DataTypes.INTEGER,
            references: {
                model: 'user',
                key:    'id'
            }
        },

        status:     DataTypes.ENUM('0', '1'),

        created_at: DataTypes.DATEONLY,

        send_at:    DataTypes.DATE,

        updated_at: DataTypes.DATE

    },
    {
        freezeTableName: true,
        timestamps:      true
    });

    return email_queue;
}