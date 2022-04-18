var express = require('express');
var router = express.Router();
const sequelize = require('sequelize');
const {Op} = require('sequelize');
const { QueryTypes } = require('sequelize');
let db = null;

/* GET sale report */
router.get('/sale', async (req, res, next) => {
  db = req.app.get('db');

  let report = null;
  if(req.query.month || req.query.year){
    report = await getByMonthAndYear(req.query.month, req.query.year);
  }
  else if(req.query.from_date || req.query.to_date){
    report = await getByFromTo(req.query.from_date, req.query.to_date)
  }
  console.log(report);
 
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  res.send({
    total_amount: report
  });
});

/* GET sale report */
router.get('/shipping_dock', async (req, res, next) => {
  db = req.app.get('db');

  let year = req.query.year;
  let shipping_dock_id = req.query.shipping_dock_id;

  const query = "SELECT `t`.`order_id`, `t`.`shipping_dock_id`, `o`.`id`, \
                 DATE_FORMAT(`o`.`created_at`, '%M') AS `month`, DATE_FORMAT(`o`.`created_at`, '%m') AS `month_no`,\
                 SUM(`o`.`amount`) AS `total` FROM `order` AS `o` \
                 LEFT JOIN `transaction` AS `t` ON `t`.`order_id` = `o`.`id`   \
                 WHERE ((DATE_FORMAT(`o`.`created_at`, '%Y') = $year) AND `t`.`shipping_dock_id` = $shipping_dock_id) \
                 GROUP BY `month` ORDER BY month_no ASC";

  let report = await db.sequelize.query(query, {
    bind:{
      year: year,
      shipping_dock_id: shipping_dock_id
    },
    type: QueryTypes.SELECT
  })
 
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  res.send({
    total_amount: report
  });
});

/* GET monthly report */
router.get('/monthly', async (req, res, next) => {
  db = req.app.get('db');

  let report = null;
  let year = req.query.year
  report = await db.order.findAll({
    attributes: [
      [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%M'), 'month'],
      [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%m'), 'month_no'],
      [sequelize.fn('SUM', sequelize.col('amount')), 'total']


    ],
    where: sequelize.where( 
                      sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y'),  
                      year//sequelize.fn('DATE_FORMAT', year, '%Y')
                    ),
    order:  sequelize.literal('month_no ASC' ),
    group: 'month'

  });
 
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  res.send({
    total_amount: report
  });
});

/* GET user monthly report */
router.get('/user', async (req, res, next) => {
  db = req.app.get('db');

  let report = null;
  let year = req.query.year;
  let user_id = req.query.user_id ? req.query.user_id : null ;
  report = await db.order.findAll({
    attributes: [
      [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%M'), 'month'],
      [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%m'), 'month_no'],
      [sequelize.fn('SUM', sequelize.col('amount')), 'total']


    ],
    where: {
      [Op.and]:[
        [sequelize.where( 
          sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y'),  
          year
        )],
        {user_id: user_id}
        
        ]

    },
    order:  sequelize.literal('month_no ASC'),
    group: 'month'

  });
 
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  res.send({
    total_amount: report
  });
});

/* GET user monthly  order count report */
router.get('/user/count', async (req, res, next) => {
  db = req.app.get('db');

  let report = null;
  let year = req.query.year;
  let user_id = req.query.user_id ? req.query.user_id : null ;
  report = await db.order.findAll({
    attributes: [
      [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%M'), 'month'],
      [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%m'), 'month_no'],
      [sequelize.fn('COUNT', sequelize.col('*')), 'no_of_orders']


    ],
    where: {
      [Op.and]:[
        [sequelize.where( 
          sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y'),  
          year
        )],
        {user_id: user_id}
        
        ]

    },
    order:  sequelize.literal('month_no ASC'),
    group: 'month'

  });
 
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  res.send({
    total_amount: report
  });
});




const getByMonthAndYear = async (month = null, year = null)=>{
  date = new Date()
  month = month == null ? date.getMonth() : parseInt(month);
  year = year == null ? date.getFullYear() : parseInt(year);
  date.setMonth(month);
  date.setFullYear(year);

  let report = await db.order.sum('amount', {
    where: sequelize.where( 
                      sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m'),  
                      sequelize.fn('DATE_FORMAT', date, '%Y-%m')
                    )
      
  });
  return report;
}


const getByFromTo = async(from = 0000-00-00, to = 0000-00-00 )=>{
    dateFrom = from;
    dateTo = to;

    if(Date.parse(from) > Date.parse(to)){
      dateFrom = to;
      dateTo = from;
    }

    let report = await db.order.sum('amount', {
      where: {
        [Op.and]:[
            [sequelize.where( 
                        sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m-%d'),{
                          [Op.gte]: sequelize.fn('DATE_FORMAT', dateFrom, '%Y-%m-%d')
                        })],
            [sequelize.where( 
              sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m-%d'),{
                [Op.lte]: sequelize.fn('DATE_FORMAT', dateTo, '%Y-%m-%d')
              })]
        ]
      }
        
    });
    return report;
    

}

module.exports = router;
