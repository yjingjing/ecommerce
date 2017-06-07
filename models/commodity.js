var Commodity=require('../common/mongo').Commodity;
module.exports={
	getCommodityByCatagoryId:function(catagoryId){
		return Commodity.find({catagory:catagoryId}).addCreatedAt().exec();
	},
	getCommodityByCatagoryIdLimit:function(catagoryId,limitNum){
		return Commodity.find({catagory:catagoryId}).limit(limitNum).addCreatedAt().exec();
	},
	getCommodityById:function(id){
		return Commodity.findOne({_id:id}).exec();
	},
	deleteCommodityStockNum:function(commodity,count){
		var remainStockNum=commodity.stockNum-count;
		return Commodity.update({_id:commodity._id},{$set:{stockNum:remainStockNum}}).exec();
	},
	addCommodityStockNum:function(commodity,count){
		var remainStockNum=commodity.stockNum+count;
		return Commodity.update({_id:commodity._id},{$set:{stockNum:remainStockNum}}).exec();
	}
};
