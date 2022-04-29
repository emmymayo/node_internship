var express = require('express');
const fs = require('fs');
const readline = require('readline');
const path = require("path");
var router = express.Router();
const { dirname } = require('path');
const {HasOne} = require('sequelize');


router.get('/', async (req, res, next)=> {
    const exportFileName = './public/exports/export.csv';
    const db = req.app.get('db');
    
    let transactions = await db.transaction.findAll();
    let filename = (new Date()).toISOString()
                    .replace(':', '-')
                    .replace('.', '-');
    filename = filename + '.csv';


    
    // Append csv heading
    let data = `id, order_id, user_id, shipping_dock_id, amount, notes \r\n`;
    fs.writeFileSync(exportFileName, data);
    
    transactions.forEach(transaction => {
        data = `${transaction.id}, ${transaction.order_id}, ${transaction.user_id}, ${transaction.shipping_dock_id} , ${transaction.amount},  ${transaction.notes}\r\n`;
        console.log(`writing ${data}`)
        fs.appendFileSync(exportFileName, data);

    });

    
    res.download(exportFileName);

  });


  module.exports = router;