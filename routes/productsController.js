var express = require('express');
var router = express.Router();
const { Curl } = require('node-libcurl');
const access_token = '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';

const curl = new Curl();
const close = curl.close.bind(curl);


/* GET products listing. */
router.get('/', closeCurl, async (req, res, next)=> {
  
    // Better approach cache response in a json file
    let prev = req.query.prev ? parseInt(req.query.prev) : 0 ;
    let limit = req.query.limit ? parseInt(req.query.limit) : 1 ;
    let cursor = req.query.cursor ? parseInt(req.query.cursor) : 0 ;

    curl.setOpt(Curl.option.URL, `https://emmy-test.myshopify.com/admin/api/2022-04/products.json/?limit=${limit}&since_id=${cursor}`);
    curl.setOpt(Curl.option.HTTPHEADER, [`X-Shopify-Access-Token: ${access_token} `]);
    curl.setOpt(Curl.option.SSL_VERIFYHOST, false);
    curl.setOpt(Curl.option.SSL_VERIFYPEER, false);

    let products = [];
    let lastId = 0;


    curl.on('end', function (statusCode, data, headers) {
        console.info(statusCode);
        console.info('---');
        console.info(data.length);
        console.info('---');
        console.info(data);
        console.info(this.getInfo( 'TOTAL_TIME'));

        if(statusCode == 200){
            products = JSON.parse(data).products;
            nextCursor = products[products.length - 1].id; 
            prevCursor = prev

            res.statusCode = 200;
            console.log('rendering');
            res.render('products', {
                    title: 'Products',
                    products: products,
                    nextCursor: nextCursor,
                    prevCursor: prevCursor
            });
        }
        console.log('closing');
        close();
    
    });

    curl.on('error', (err)=>{
        console.log(err.message);
        // res.statusCode = 500;

        res.render('error', {});
        close();
    });
    await curl.perform();
    console.log('the end of controller');

});

function closeCurl(req, res, next){

    next();
    close();
}



module.exports = router;
