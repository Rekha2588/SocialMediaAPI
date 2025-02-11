const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUser, deleteUser, unlockUserAccount } = require('./../controllers/userDetailsController')
const validateToken = require('./../middleware/validateTokenHandler');

router.route('/signup').post(registerUser);
router.route('/signin').post(loginUser);
router.route('/unlock').post(unlockUserAccount);
router.route('/:id').put(validateToken, updateUser).delete(validateToken, deleteUser);

module.exports = router;