var express=require('express');
var path=require('path');
var sha1=require('sha1');
var fs=require('fs');
var userModel=require('../models/users');
var router=express.Router();
router.get('/',function(req,res,next){
	res.render('register');
});
router.post('/',function(req,res,next){
	var name=req.fields.name;
	var password=req.fields.password;
	var repassword=req.fields.repassword;
	var gender=req.fields.gender;
	var resume=req.fields.resume;
	var portrait=req.files.portrait.path.split(path.sep).pop();
	try{
		if(!(name.length>=1 && name.length<=10)){
			throw new Error('名字请限制再1-10个字符');
		}
		if(['m','f','x'].indexOf(gender)===-1){
			throw new Error('性别只能是m、f、x');
		}
		if(!(resume.length>=1 && resume.length<=30)){
			throw new Error('个人简介请限制在1-30个字符');
		}
		if(!(req.files.portrait.name)){
			throw new Error('缺少头像');
		}
		if(password.length<6){
			throw new Error('密码至少6个字符');
		}
		if(password!==repassword){
			throw new Error('两次输入密码不一致');
		}
	}catch(e){
		//注册失败，异步删除上传的头像
		fs.unlink(req.files.portrait.path);
		req.flash('error',e.message);
		return res.redirect('/register');
	}
	var password=sha1(password);
	//待写入数据库的用户信息
	var user={
		name:name,
		password:password,
		gender:gender,
		resume:resume,
		portrait:portrait
	};
	userModel.create(user).then(function(result){
		user=result.ops[0];
		delete user.password;
		req.session.user=user;
		req.flash('success','注册成功');
		res.redirect('/home');
	}).catch(function(e){
		fs.unlink(req.files.portrait.path);
		//用户名被占用则跳回注册页，而不是错误页
		if(e.message.match('E11000 duplicate key')){
			req.flash('error','用户名已被占用');
			return res.redirect('/register');
		}
		next(e);
	});
});
module.exports=router;
