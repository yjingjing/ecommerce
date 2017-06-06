var express=require('express');
var router=express.Router();
var Commodity=require('../models/commodity');
var Cart=require('../models/cart');
var Catagory=require('../models/catagory');
router.get('/:ctype',function(req,res,next){
	var ctype=req.params.ctype;
	req.flash('cId',ctype);
	res.locals.cId=req.flash('cId').toString();
	Commodity.getCommodityByCatagoryId(ctype).then(function(commodities){
		Catagory.getCatagoryById(ctype).then(function(catagory){
			res.render('commodity/index',{commodities:commodities,ctype:ctype,catagory:catagory});
		});
	}).catch(next);
});
router.get('/detail/:ctype/:id',function(req,res,next){
	var id=req.params.id;
	var ctype=req.params.ctype;
	req.flash('cId',ctype);
	res.locals.cId=req.flash('cId').toString();
	Commodity.getCommodityById(id).then(function(commodity){
		res.render('commodity/detail',{commodity:commodity});
	}).catch(next);
});
router.get('/addToCart/:id/:count',function(req,res,next){
	if(!req.session.user){
		req.flash('error','用户已过期，请重新登录');
		res.redirect('/login');
	}else{
		var id=req.params.id;
		var count=req.params.count;
		Cart.getCartCommodity(req.session.user._id,id).then(function(result){
			Commodity.getCommodityById(id).then(function(commodity){
				if(result==null){
					var cart={
						uId:req.session.user._id,
						cId:commodity._id,
						cName:commodity.name,
						cPrice:commodity.price,
						cImgSrc:commodity.imgSrc,
						cQuantity:parseInt(count),
						cStatus:true
					}
					Cart.createCartCommodity(cart).then(function(){
						Commodity.deleteCommodityStockNum(commodity,parseInt(count));
						req.flash('success','购买成功');
						res.redirect('/personal/mycart');
					});
				}else{
					Cart.addCartCommodityQuantity(result,parseInt(count));
					Commodity.deleteCommodityStockNum(commodity,parseInt(count));
					req.flash('success','购买成功');
					res.redirect('/personal/mycart');
				}
			});
		});
	}
});
router.get('/mycart',function(req,res,next){
	res.render('commodity/mycart');
});
module.exports=router;
