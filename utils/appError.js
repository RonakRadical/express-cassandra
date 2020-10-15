// error handle 錯誤處理封裝
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // 如果錯誤代碼開頭是 4 (404, 405 ...) 就設定為 'fail', 否則 'error'
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // 標記為此錯誤是自訂的操作錯誤, 與代碼錯誤產生的 error 當區隔, 代碼錯誤不會進到這
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
