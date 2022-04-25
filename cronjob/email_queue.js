var express = require('express')
const db = require("../models");

// 1.Loop through all active users
// 2.Loop through all odd id emails if today is monday, wednesday, friday. Otherwise do all even id for other days.
// 3.Write into email queue what email to send from step 2. Set status as not sent. Set send_at as next day.

async function handle(){

    let date = new Date();
    let emails = null; let meta = null;
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate()+1);

    let users = await  db.user.findAll({
        where:{
            status : "1"
        }
    });


    if(date.getDay() % 2){
        [emails, meta] = await db.sequelize.query("SELECT * FROM `email` WHERE id % 2 = 1");
    }else{
        [emails, meta] = await db.sequelize.query("SELECT * FROM `email` WHERE id % 2 = 0");
    }


    users.forEach(async (user) => {
        emails.forEach(async (email) => {
            await db.email_queue.create({
                user_id     : user.id,
                email_id    : email.id,
                status      : "0",
                send_at     : tomorrow
            });
        });
    });
 


}

handle().then(()=>{
    console.log('cron job done');
});