const dotenv = require('dotenv');

// 捕獲未處理的 error
process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception! Shutting down...');
  process.exit(1); // 0 表示成功, 1 表示失敗
});

const configName = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
dotenv.config({ path: `${__dirname}/config/${configName}.env` });

const app = require('./app');

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App start on port ${port}...`);
});

// 捕獲未處理的異步 error - 例如某 promise 沒有使用 .catch (Unhandled promise rejection)
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandler Rejection! Shutting down...');
  // 將 server 關閉
  server.close(() => {
    process.exit(1); // 0 表示成功, 1 表示失敗
  });
});
