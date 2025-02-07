const express = require('express');
const router = express.Router();
const {addProvider, getProviders, getProvider, updateProvider, deleteProvider} = require('../controllers/marketPlaceController');

router.route('/').get(getProviders);
router.route('/').post(addProvider);
router.route('/:id').get(getProvider).put(updateProvider).delete(deleteProvider);

module.exports = router;