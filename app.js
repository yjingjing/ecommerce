var express=require('express');
var session=require('express-session');
var MongoStore=require('connect-mongo')(session);
var bodyParser=require('body-parser');
var flash=require('connect-flash');
var path=require('path');
var config=require('config-lite')(__dirname);
var route=require('./routes');
var CatagoryModel=require('./models/commoditycatagory');
var CommodityCatagory=require('./common/mongo').Commoditycatagory;
var app=express();
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));
app.use(session({
	//设置cookie中保存session id的字段名称
	name:'ecommerce',
	//通过设置secrect来计算hash值并放在cookie中，使产生的signedCookie防篡改
	secret:'ecommerce',
	//强制更新session
	resave:true,
	//设置为false,强制创建一个session，即使用户未登录
	saveUninitialized:false,
	cookie:{
		//过期时间，过期后cookie中的session id自动删除
		maxAge:2900000
	},
	store:new MongoStore({
		url:config.mongodb
	})
}));
app.use(flash());
//处理表单及文件上传的中间件
app.use(require('express-formidable')({
	//上传文件目录
	uploadDir:path.join(__dirname,'public/images'),
	//保留后缀
	keepExtensions:true
}));
// 没有挂载路径的中间件，应用的每个请求都会执行该中间件
app.use(function(req,res,next){
	res.locals.rootPath='http://localhost:8080';
	res.locals.user=req.session.user;    
	res.locals.catagorys=req.session.catagories;

	res.locals.cId=req.flash('cId').toString();
	res.locals.success=req.flash('success').toString();
	res.locals.error=req.flash('error').toString();
	next();
});
route(app);
app.listen(8080,function(){
	console.log('服务启动');
});
