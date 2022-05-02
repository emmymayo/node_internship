const db = require("../models");
const { QueryTypes, Op } = require('sequelize');
const { sequelize } = require('../models');
const { Curl } = require('node-libcurl');

const access_token = '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';

const curl = new Curl();
const close = curl.close.bind(curl);

curl.setOpt(Curl.option.URL, 'https://emmy-test.myshopify.com/admin/api/2022-04/customers.json');
curl.setOpt(Curl.option.HTTPHEADER, [`X-Shopify-Access-Token: ${access_token} `]);
curl.setOpt(Curl.option.SSL_VERIFYHOST, false);
curl.setOpt(Curl.option.SSL_VERIFYPEER, false);

curl.on('end', function (statusCode, data, headers) {
  console.info(statusCode);
  console.info('---');
  console.info(data.length);
  console.info('---');
  console.info(data);
  console.info(this.getInfo( 'TOTAL_TIME'));

  if(statusCode == 200){
    let customers = JSON.parse(data).customers;
    customers.forEach( async customer =>{
      let data = {
        shopify_customer_id     : customer.id,
        shopify_customer_email  : customer.email
      }
      // skip if customer exist
      let user_exists = await db.customer.count({
        where : data
      });
      if(user_exists){ return; }

      //insert
      await db.customer.create(data);


    });
  }
  
  this.close();
});

curl.on('error', (err)=>{
    console.log(err);
    close();
});
curl.perform();



// https://emmy-test.myshopify.com/admin/oauth/authorize?client_id=c3d9ffd70a5b676f8fc40759323e94b8&scope=read_customers,write_customers,read_products,write_products&redirect_uri=http://localhost:3000&state=a123456&grant_options[]=value

// http://localhost:3000/?hmac=6dd75365a654c7760e6a893cedbcf08eb5085b7a1606a293044011751c295a8c&host=ZW1teS10ZXN0Lm15c2hvcGlmeS5jb20vYWRtaW4&shop=emmy-test.myshopify.com&timestamp=1651404839

//http://localhost:3000/?code=377144e0a52ef960b96631643a8bf1e5&hmac=b0b4d51ca2a9020ffc6612cf587a301a434c7a8a3063e76e9865343353a27de7&host=ZW1teS10ZXN0Lm15c2hvcGlmeS5jb20vYWRtaW4&shop=emmy-test.myshopify.com&state=a123456&timestamp=1651408807

// {"access_token":"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","scope":"write_customers,write_products"}