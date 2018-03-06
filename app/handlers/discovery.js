module.exports = (router) => {
  return (req, res, next)=>{
    res.send({
      "authenticate": router.render('authenticate', {details: true}),
      "status": router.render('status', {details: true}),
      "animals": router.render('animals', {details: true}),
      "heyyo": router.render('heyyo', {details: true}),
    });
  };
}
