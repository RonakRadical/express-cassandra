const Users = require('../models/Users');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const cqlsh = `SELECT * FROM ${Users.table}`;
  const result = await Users.client.execute(cqlsh, []);

  res.status(200).json({
    status: 'success',
    rowLength: result.rowLength,
    data: result.rows
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { username } = req.params;
  const cqlsh = `SELECT * FROM ${Users.table} WHERE username = ?`;
  const result = await Users.client.execute(cqlsh, [username]);

  res.status(200).json({
    status: 'success',
    rowLength: result.rowLength,
    data: result.rows
  });
});

exports.addUser = catchAsync(async (req, res, next) => {
  const { username = '', email = '', name = '', password = '' } = req.body;

  const cqlsh = `INSERT INTO ${Users.table} (username, email, name, password) VALUES (?, ?, ?, ?)`;
  const result = await Users.client.execute(cqlsh, [
    username,
    email,
    name,
    password
  ]);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { username } = req.params;
  const { email = '', name = '', password = '' } = req.body;
  const paramsQueryList = [];
  const paramsList = [];

  if (email) {
    paramsQueryList.push(`email = ?`);
    paramsList.push(email);
  }
  if (name) {
    paramsQueryList.push(`name = ?`);
    paramsList.push(name);
  }

  if (password) {
    paramsQueryList.push(`password = ?`);
    paramsList.push(password);
  }

  // ['name = ?', 'email = ?'] => 'name = ?, email = ?'
  const params = paramsQueryList.reduce((acc, it) => {
    if (acc) {
      acc += `, ${it}`;
    } else {
      acc += it;
    }
    return acc;
  }, '');

  if (!params) {
    next(new AppError('Params empty!', 400));
  }

  const cqlsh = `UPDATE ${Users.table} SET ${params} WHERE username = '${username}'`;
  const result = await Users.client.execute(cqlsh, paramsList);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { username } = req.params;
  if (!username) {
    next(new AppError('username empty!', 400));
  }
  const cqlsh = `DELETE FROM ${Users.table} WHERE username = ?`;
  const result = await Users.client.execute(cqlsh, [username]);

  res.status(200).json({
    status: 'success',
    data: result
  });
});
