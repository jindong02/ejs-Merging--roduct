const express = require('express');

const router = express.Router();

router.get('/404', async (req, res) => {
  res.render('Pages/docsErrorPages/404');
});

module.exports = router;
