var express=require('express');
var router=express.Router();
router.get('/',function(req,res,next){
	req.session.user=null;
	req.flash('success','退出成功');
	res.redirect('/home');
});
module.exports=router;
