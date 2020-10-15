const express = require('express');
const userController = require('../controllers/userController');

const Router = express.Router();

Router.route('/')
  .get(userController.getAllUsers)
  .post(userController.addUser);

Router.route('/:username')
  .get(userController.getUser)
  .post(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = Router;
