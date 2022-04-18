var express = require('express');
var router = express.Router();

/* GET shipping_docks listing. */
router.get('/', async (req, res, next)=> {
  const db = req.app.get('db');
  let shipping_docks = await db.shipping_dock.findAll();

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  res.send({
      data: shipping_docks
  });
});

/* GET single shipping_dock. */
router.get('/:id', async (req, res, next)=> {
  const db = req.app.get('db');
  const shipping_dock = await db.shipping_dock.findByPk(req.params.id);

  res.setHeader("Content-Type", "application/json");
  res.statusCode = shipping_dock != null ? 200 : 404;

  res.send({
      data: shipping_dock
  });
});

/* POST Add shipping_dock. */
router.post('/', async (req, res, next)=> {
  const ACTIVE = '1';
  const db = req.app.get('db');

  let data = {
    name:   req.body.name,
    status: ACTIVE
  }
  await db.shipping_dock.create(data);

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 201;
  
  res.send({
      data: ''
  });
});

/* PUT update shipping_dock. */
router.put('/:id', async (req, res, next)=> {
  const db = req.app.get('db');

  let data = req.body;
  let where = {id: req.params.id}
  let shipping_dock = await db.shipping_dock.update(data, {where});

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 201;
  res.send({
      data: shipping_dock
  });
});

/* DELETE destroy shipping_dock. */
router.delete('/:id', async (req, res, next)=> {
  const db = req.app.get('db');

  let where = {id: req.params.id}
  await db.shipping_dock.destroy({where});

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 204;
  res.send({
      data:''
  });
});


module.exports = router;
