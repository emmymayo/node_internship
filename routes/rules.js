var express = require('express');
var router = express.Router();

/* GET rule listing. */
router.get('/', async (req, res, next)=> {
  const db = req.app.get('db');
  let rules = await db.rule.findAll();

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  res.send({
      data: rules
  });
});

/* GET single rule. */
router.get('/:id', async (req, res, next)=> {
  const db = req.app.get('db');
  const rule = await db.rule.findByPk(req.params.id);

  res.setHeader("Content-Type", "application/json");
  res.statusCode = rule != null ? 200 : 404;

  res.send({
      data: rule
  });
});

/* POST Add rule. */
router.post('/', async (req, res, next)=> {
  const db = req.app.get('db');

  let data = {
    name:       req.body.name,
    condition:  req.body.condition,
    action:     req.body.action,
  }
  await db.rule.create(data);

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 201;
  
  res.send({
      data: ''
  });
});

/* PUT update rule. */
router.put('/:id', async (req, res, next)=> {
  const db = req.app.get('db');

  let data = req.body;
  let where = {id: req.params.id}
  let rule = await db.rule.update(data, {where});

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 201;
  res.send({
      data: rule
  });
});

/* DELETE destroy rule. */
router.delete('/:id', async (req, res, next)=> {
  const db = req.app.get('db');

  let where = {id: req.params.id}
  await db.rule.destroy({where});

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 204;
  res.send({
      data:''
  });
});


module.exports = router;
