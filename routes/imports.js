var express = require('express');
var router = express.Router();
const multer  = require('multer');
const upload = multer({ dest: '/public/data/uploads/' });
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { dirname } = require('path');

router.post('/', upload.single('transaction'), async (req, res, next)=> {
    const db = req.app.get('db');
    
    // const uploadedFileReadStream = fs.createReadStream(path.join(__dirname, 'public/data/uploads', req.file.filename));

    const uploadedFileReadStream = fs.createReadStream(req.file.path);
    const fileLineReadStream = readline.createInterface( uploadedFileReadStream);

    let lineCount = 0;
    let done = true;
    fileLineReadStream.on('line', async (row)=>{
        lineCount++;
        let cells = row.split(',');

        if(lineCount == 1) return;
        if(cells.length != 6) return;
            
        // csv format s/n, order_id, user_id, shipping_dock_id, amount, notes
        // it skips s/n
        let data = {
            order_id            : cells[1],
            user_id             : cells[2],
            shipping_dock_id    : cells[3],
            amount              : cells[4],
            notes               : cells[5]
        }
            result = await db.transaction.create(data)
        
        
    });

    res.statusCode = 200;
  
    res.render('import', {title : 'Import Transaction', status : 'Imported successfully'});

  });

  module.exports = router;