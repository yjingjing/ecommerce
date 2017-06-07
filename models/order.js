var Order=require('../common/mongo').Order;
var Cart=require('./cart');
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
