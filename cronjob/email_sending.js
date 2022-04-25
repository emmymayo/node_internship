var express = require('express')
const nodemailer = require("nodemailer");
const db = require("../models");
const { QueryTypes, Op } = require('sequelize');
const { sequelize } = require('../models');

// 1.Loop through all email_queue table that have send_at as today.
// 2.Query user table to collect email and name. In email template selected, replace {{{NAME}}} and {{{EMAIL}}} with user email and name.
// 3.Send email to user. Use https://mailtrap.io/ to send the email
// 4.Mark Email status as sent

async function handle(){

    let date = new Date();

    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "6b6b180909cb57",
          pass: "e7d7428fa8c621"
        }
      });

    let email_queues = await db.email_queue.findAll({
        where: {
            [Op.and]: [
                {status: "0"},
                sequelize.where(sequelize.fn('DATE_FORMAT', sequelize.col('send_at'), '%Y-%m-%d'), 
                sequelize.fn('DATE_FORMAT', date, "%Y-%m-%d"))
            ]
        } 
    });

    console.log(email_queues);

    for (const email_queue of email_queues) {
        let user = await db.user.findByPk(email_queue.user_id);
        let email = await db.email.findByPk(email_queue.email_id);

        let body = '';
        body = subEmailTemplateValues(email.body, {name: user.name, email: user.email} );
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <emmytest@mailinator.com>', // sender address
            to: user.email, // list of receivers
            subject: email.subject, // Subject line
            text: body, // plain text body
            // html: "<b>Hello world?</b>", // html body
          });
        
        await db.email_queue.update({
            status: "1"
        }, 
        {where:{
            id: email_queue.id}
        });
    }


}

function subEmailTemplateValues(template, data = {} ){
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            const element = data[key];
            template = template.replace(`{{{${key}}}}`, data[key]);
            
        }
    }
    return template;
}
handle().then(()=>{
    console.log('cron job done');
});