const User = require("../models/user");

module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup= async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        const NU = new User({email,username});
        const registeredUser = await User.register(NU,password);
        console.log(registeredUser);
        req.login(registeredUser,(e)=>{
            if(e){
                return next(e);
            }
            req.flash("success","Welcome to Stay");
            res.redirect("/listings")
        })
       
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
   
}

module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.login= async (req,res)=>{
    req.flash("success","Welcome back!");
    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo;
    res.redirect(redirectUrl);  
}

module.exports.logout = (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
};