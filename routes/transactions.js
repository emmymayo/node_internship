var express = require('express');
var router = express.Router();

/* GET transaction listing. */
router.get('/', async (req, res, next)=> {
  const db = req.app.get('db');
  let transactions = await db.transaction.findAll();

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  res.send({
      data: transactions
  });
});

/* GET single transaction. */
router.get('/:id', async (req, res, next)=> {
  const db = req.app.get('db');
  const transaction = await db.transaction.findByPk(req.params.id);

  res.setHeader("Content-Type", "application/json");
  res.statusCode = transaction != null ? 200 : 404;

  res.send({
      data: transaction
  });
});

/* POST Add transaction. */
router.post('/', async (req, res, next)=> {
  const db = req.app.get('db');

  let data = {
    order_id:           req.body.order_id,
    user_id:            req.body.user_id,
    shipping_dock_id:   req.body.shipping_dock_id,
    amount:             req.body.amount,
    notes:              req.body.notes
  }
  await db.transaction.create(data);

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 201;
  
  res.send({
      data: ''
  });
});

/* PUT update transaction. */
router.put('/:id', async (req, res, next)=> {
  const db = req.app.get('db');

  let data = req.body;
  let where = {id: req.params.id}
  let transaction = await db.transaction.update(data, {where});

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 201;
  res.send({
      data: transaction
  });
});

/* DELETE destroy transaction. */
router.delete('/:id', async (req, res, next)=> {
  const db = req.app.get('db');

  let where = {id: req.params.id}
  await db.transaction.destroy({where});

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 204;
  res.send({
      data:''
  });
});


module.exports = router;
