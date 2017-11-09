var express = require('express');
var router = express.Router();
var debtor = require('../app/controller/debtors');
var detail = require('../app/controller/details');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/add-debtor', debtor.addDebtor);
router.get('/get-all-debtors', debtor.getDebtors);
router.post('/update-debtor', debtor.updateDebtor);
router.post('/delete-debtor', debtor.deleteDebtor);
router.post('/get-debtor', debtor.getDebtor);

router.post('/add-detail', detail.addDetail);
router.post('/delete-detail', detail.deleteDetail);

module.exports = router;
