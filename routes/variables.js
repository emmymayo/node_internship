var express = require('express');
var router = express.Router();

/* GET variable listing. */
router.get('/', async (req, res, next)=> {
  const db = req.app.get('db');
  let variables = await db.variable.findAll();

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  res.send({
      data: variables
  });
});

/* GET single variable. */
router.get('/:id', async (req, res, next)=> {
  const db = req.app.get('db');
  const variable = await db.variable.findByPk(req.params.id);

  res.setHeader("Content-Type", "application/json");
  res.statusCode = variable != null ? 200 : 404;

  res.send({
      data: variable
  });
});

/* POST Add variable. */
router.post('/', async (req, res, next)=> {
  const db = req.app.get('db');

  let data = {
    name:       req.body.name,
    type:       req.body.type
  }
  await db.variable.create(data);

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 201;
  
  res.send({
      data: ''
  });
});

/* PUT update variable. */
router.put('/:id', async (req, res, next)=> {
  const db = req.app.get('db');

  let data = req.body;
  let where = {id: req.params.id}
  let variable = await db.variable.update(data, {where});

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 201;
  res.send({
      data: variable
  });
});

/* DELETE destroy variable. */
router.delete('/:id', async (req, res, next)=> {
  const db = req.app.get('db');

  let where = {id: req.params.id}
  await db.variable.destroy({where});

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 204;
  res.send({
      data:''
  });
});


module.exports = router;
