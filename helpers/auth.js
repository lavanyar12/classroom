module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    } 
    req.flash('error_msg', 'Not Authorized')
    res.redirect('/users/login')
  },
  adminUser: function(req, res, next) {
    if (res.locals.user.accountType === 'ADMIN') {
      return next()
    } 
    req.flash('error_msg', 'Not Authorized')
    res.redirect('/home')
  },
}