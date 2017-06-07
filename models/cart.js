var Cart=require('../common/mongo').Cart;
Cart.plugin('updateStatus',{
	afterFindOne:function(cart){
		if(cart){
			cart.cStatus=false;
		}
		return cart;
	}
});
module.exports={
	//判断某一用户是否购买过某件商品，并且尚未结算
	getCartCommodity:function(uId,cId){
		return Cart.findOne({uId:uId,cId:cId,cStatus:true}).addCreatedAt().exec();
	},
	//更改购买数量
	addCartCommodityQuantity:function(cart,quantity){
		return Cart.update({_id:cart._id},{$set:{cQuantity:(cart.cQuantity+quantity)}}).exec();
	},
	deleteCartCommodityQuantity:function(cart,quantity){
		return Cart.update({_id:cart._id},{$set:{cQuantity:(cart.cQuantity-quantity)}}).exec();
	},
	getCartCommodityById:function(id){
		return Cart.findOne({_id:id}).addCreatedAt().exec();
	},
	getAndUpdateCommodityById:function(id){
		return Cart.findOne({_id:id}).addCreatedAt().updateStatus().exec();
	},
	updateStatus:function(id){
		return Cart.update({_id:id},{$set:{cStatus:false}}).exec();
	},
	//获取某一用户下购物车中所有商品
	getCartCommodities:function(uId){
		return Cart.find({uId:uId,cStatus:true}).addCreatedAt().exec();
	},
	createCartCommodity:function(cart){
		return Cart.create(cart).exec();
	},
	//更改某一用户下购车中某件商品的状态
	updateCartCommodity:function(uId,cId){
		return Cart.update({uId:uId,cId:cId},{$set:{cStatus:false}}).exec();
	}
};
