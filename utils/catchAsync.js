// 異步錯誤處理封裝
module.exports = fn => {
  // 因為不能立即調用, 需要 return 匿名函式來跳脫立即執行
  return (req, res, next) => {
    // fn(req, res, next).catch(err => next(err));
    // 直接 next 作用跟上方一樣, 短寫法
    fn(req, res, next).catch(next);
  };
};
