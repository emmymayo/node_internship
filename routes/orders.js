var express = require('express');
var router = express.Router();
const {Op} = require("sequelize");

/* GET orders listing. */
router.get('/', async (req, res, next)=> {
  const db = req.app.get('db');

  let page = req.query.page ? parseInt(req.query.page) : 1;
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
  let sort = req.query.sort ? req.query.sort : 'id';
  let direction = req.query.direction ? req.query.direction : 'ASC';
  let offset = (page * limit) - limit;

  let options = {
    limit:  limit,
    offset: offset,
    order:  [
      [sort, direction]
    ]
  };
  

  let orders = await db.order.findAll(options);

  let total = orders.length;

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  res.send({
    total:  total,
    page:   page,
    list:   orders 
  });
});

/* GET orders listing by cursor. */
router.get('/cursor', async (req, res, next)=> {
  const db = req.app.get('db');

  let id = req.query.id ? parseInt(req.query.id) : 1;
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
  let options = {
    where:{
      id:{
        [Op.gt]: id
      }
    },
    limit:  limit,
  };
  

  let orders = await db.order.findAll(options);

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  res.send({
    id:   id,
    list:   orders 
  });
});

/* GET odd orders listing. */
router.get('/odd', async (req, res, next)=> {
  const db = req.app.get('db');
  let [orders, meta] = await db.sequelize.query("SELECT * FROM `order` WHERE id % 2 = 1");

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  res.send({
      data: orders
  });
});

/* GET single order. */
router.get('/:id', async (req, res, next)=> {
  const db = req.app.get('db');
  const order = await db.order.findByPk(req.params.id);

  res.setHeader("Content-Type", "application/json");
  res.statusCode = order != null ? 200 : 404;

  res.send({
      data: order
  });
});

/* POST Add order. */
router.post('/', async (req, res, next)=> {
  const db = req.app.get('db');

  let data = {
    user_id:  req.body.user_id,
    amount:   req.body.amount,
    tax:      req.body.tax,
    notes:    req.body.notes,
    status:   req.body.status
  }
  await db.order.create(data);

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 201;
  
  res.send({
      data: ''
  });
});

/* PUT update order. */
router.put('/:id', async (req, res, next)=> {
  const db = req.app.get('db');

  let data = req.body;
  let where = {id: req.params.id}
  let order = await db.order.update(data, {where});

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 201;
  res.send({
      data: order
  });
});

/* DELETE destroy order. */
router.delete('/:id', async (req, res, next)=> {
  const db = req.app.get('db');

  let where = {id: req.params.id}
  await db.order.destroy({where});

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 204;
  res.send({
      data:''
  });
});


module.exports = router;
