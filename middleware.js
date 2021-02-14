module.exports.isLoggedIn = (req,res,next) => {
    // console.log('req.user...', req.user);
    // console.log(req.path, req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}