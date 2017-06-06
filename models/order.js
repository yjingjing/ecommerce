var Order=require('../common/mongo').Order;
var Cart=require('./cart');
//Order.plugin('addCommodities',{
//	afterFindOne:function(order){
//		if(order){
////			order.commodities=[];
//			Promise.all(order.cartId.split(',').map(function(cartId){
////				order.commodities.push(cartId);
//				return Cart.getCartCommodityById(cartId).then(function(cart){
////					order.commodities.push(cart);
//					return cart;
//				});
//			})).then(function(carts){
////				console.log(carts);
//				order.commodities=carts;
//			});
//		}
//		return order;
//	}
//});
module.exports={
	createOrder:function(order){
		return Order.create(order).addCreatedAt().exec();
	},
	getOrderById:function(id){
		return Order.findOne({_id:id}).addCreatedAt().exec();
	},
	getOrders:function(uId){
		return Order.find({uId:uId}).addCreatedAt().exec();
	},
	getOrdersByPage:function(uId,page){
		return Order.find({uId:uId}).skip(page*10).limit(10).addCreatedAt().exec();
	},
	getOrdersCount:function(uId){
		return Order.count({uId:uId}).exec();
	}
}
