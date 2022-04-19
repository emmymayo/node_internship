var express = require('express');
var router = express.Router();

/* GET emails listing. */
router.get('/', async (req, res, next) => {
  const db = req.app.get('db');
  const emails = await db.email.findAll();

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  res.send({
      data: emails
  });
});

/* GET single email. */
router.get('/:id', async (req, res, next)=> {
  const db = req.app.get('db');
  const email = await db.email.findByPk(req.params.id);

  res.setHeader("Content-Type", "application/json");
  res.statusCode = email != null ? 200 : 404;

  res.send({
      data: email
  });
});

/* POST Add email. */
router.post('/', async (req, res, next)=> {
  const db = req.app.get('db');

  let data = {
    slug:       req.body.slug,
    subject:    req.body.subject,
    body:       req.body.body,
    status:     req.body.status,
  }
  await db.email.create(data);

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 201;
  
  res.send({
      data: '',
      message: 'email created successfully.'
  });
});

/* PUT update email. */
router.put('/:id', async (req, res, next)=> {
  const db = req.app.get('db');

  let data = req.body;
  let where = {id: req.params.id}
  let email = await db.email.update(data, {where});

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 201;
  res.send({
      data: '',
      message: 'email updated successfully.'
  });
});

/* DELETE destroy email. */
router.delete('/:id', async (req, res, next)=> {
  const db = req.app.get('db');

  let where = {id: req.params.id}
  await db.email.destroy({where});

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 204;
  res.send({
      data:'',
      message: 'email deleted successfully.'
  });
});


module.exports = router;
