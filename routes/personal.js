var express=require('express');
var router=express.Router();
var Cart=require('../models/cart');
var Commodity=require('../models/commodity');
var Order=require('../models/order');
var User=require('../models/users');
var path=require('path');
router.get('/index',function(req,res,next){
	User.getUserByName(req.session.user.name).then(function(user){
		res.render('personal/index',{user:user});
	});
});
router.get('/mycart',function(req,res,next){
	Cart.getCartCommodities(req.session.user._id).then(function(carts){
		res.render('personal/mycart',{carts:carts});
	}).catch(next);
});
router.post('/updatecart',function(req,res,next){
	var type=req.fields.type;
	var id=req.fields.id;
	Cart.getCartCommodityById(id).then(function(cart){
		Commodity.getCommodityById(cart.cId).then(function(commodity){
			if(type=="add"){
				//购物车商品数量增1
				Commodity.deleteCommodityStockNum(commodity,1);
				Cart.addCartCommodityQuantity(cart,1);
				res.send(200);
			}else if(type=="substr"){
				//购物车商品数量减1
				Commodity.addCommodityStockNum(commodity,1);
				Cart.deleteCartCommodityQuantity(cart,1);
				res.send(200);
			}
		});
	});
});
//购物车中删除商品
router.get('/delFromCart/:id',function(req,res,next){
	var id=req.params.id;
	Cart.getCartCommodityById(id).then(function(cart){
		Commodity.getCommodityById(cart.cId).then(function(commodity){
			Commodity.addCommodityStockNum(commodity,cart.cQuantity);
			Cart.updateStatus(id);
			res.redirect('/personal/mycart');
		});
	});
});
router.post('/clearing',function(req,res,next){
	var cartId=req.fields.cartId;
	var amount=req.fields.amount;
	var cartIds=cartId.split(",");
	var order={
		uId:req.session.user._id,
		cartId:cartId,
		amount:parseInt(amount),
		oStatus:0
	}
	Order.createOrder(order).then(function(result){
		var order=result.ops[0];
		res.redirect('/personal/myorderdetail/'+order._id);
	}).catch(function(e){
		next(e);
	});
});
router.get('/myorderdetail/:id',function(req,res,next){
	var id=req.params.id;
	Order.getOrderById(id).then(function(order){
		Promise.all(order.cartId.split(',').map(function(cartId){
			return Cart.getCartCommodityById(cartId).then(function(cart){
				Cart.updateStatus(cartId);
				return cart;
			});
		})).then(function(carts){
			res.render('personal/myorderdetail',{order:order,carts:carts});
		});
	});
});
router.get('/myorder/:pageNum',function(req,res,next){
	var uId=req.session.user._id;
	var pageNum=req.params.pageNum||0;
	Order.getOrdersByPage(uId,pageNum).then(function(orders){
		Order.getOrdersCount(uId).then(function(count){
			totalPage=Math.ceil(count/10);
			res.render('personal/myorder',{
				orders:orders,
				isFirstPage:pageNum==0,
				isLastPage:(pageNum+1)==totalPage,
				pageNum:pageNum,totalPage:totalPage
			});
		});
	});
});
router.get('/updateinfo',function(req,res,next){
	User.getUserByName(req.session.user.name).then(function(user){
		res.render('personal/updateinfo',{user:user});
	});
});
router.post('/updateinfo',function(req,res,next){
	var id=req.fields.id;
	var name=req.fields.name;
	var gender=req.fields.gender;
	var resume=req.fields.resume;
	var portrait=req.files.portrait.path.split(path.sep).pop();
	var obj={gender:gender,resume:resume,portrait:portrait};
	User.updateUserById(id,obj).then(function(){
		res.redirect('/personal/index')
	});
});
router.get('/mymessage',function(req,res,next){
	res.render('personal/mymessage');
});
module.exports=router;
