var express=require('express');
var router=express.Router();
var Cart=require('../models/cart');
var Order=require('../models/order');
router.get('/index',function(req,res,next){
	res.render('personal/index');
});
router.get('/mycart',function(req,res,next){
	Cart.getCartCommodities(req.session.user._id).then(function(carts){
		res.render('personal/mycart',{carts:carts});
	}).catch(next);
});
router.get('/delFromCart/:id',function(req,res,next){
	
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
	res.render('personal/updateinfo');
});
router.get('/mymessage',function(req,res,next){
	res.render('personal/mymessage');
});
module.exports=router;
