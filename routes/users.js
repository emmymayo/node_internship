var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const db = req.app.get('db');
  const users = await db.user.findAll();

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  res.send({
      data: users
  });
});

/* GET single user. */
router.get('/:id', async (req, res, next)=> {
  const db = req.app.get('db');
  const user = await db.user.findByPk(req.params.id);

  res.setHeader("Content-Type", "application/json");
  res.statusCode = user != null ? 200 : 404;

  res.send({
      data: user
  });
});

/* POST Add user. */
router.post('/', async (req, res, next)=> {
  const db = req.app.get('db');

  let data = {
    name:  req.body.name,
  }
  await db.user.create(data);

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 201;
  
  res.send({
      data: '',
      message: 'User created successfully.'
  });
});

/* PUT update user. */
router.put('/:id', async (req, res, next)=> {
  const db = req.app.get('db');

  let data = req.body;
  let where = {id: req.params.id}
  let user = await db.user.update(data, {where});

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 201;
  res.send({
      data: '',
      message: 'User updated successfully.'
  });
});

/* DELETE destroy user. */
router.delete('/:id', async (req, res, next)=> {
  const db = req.app.get('db');

  let where = {id: req.params.id}
  await db.user.destroy({where});

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 204;
  res.send({
      data:'',
      message: 'User deleted successfully.'
  });
});


module.exports = router;
