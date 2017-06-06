var Catagory=require('../common/mongo').Catagory;
var Commodity=require('./commodity');
Catagory.plugin('addCommodities',{
	afterFind:function(catagories){
		return Promise.all(catagories.map(function(catagory){
//			return Commodity.getCommodityByCatagoryId(catagory._id).then(function(commodities){
//				catagory.commodities=commodities;
//				return catagory;
//			});
			return Commodity.getCommodityByCatagoryIdLimit(catagory._id,6).then(function(commodities){
				catagory.commodities=commodities;
				return catagory;
			});
		}));
	}
});
module.exports={
	getCatagories:function(){
		return Catagory.find().addCreatedAt().exec();
	},
	getCatagoryById:function(id){
		return Catagory.findOne({_id:id}).addCreatedAt().exec();
	},
	getCatagoriesAndCommodities:function(){
		return Catagory.find().addCreatedAt().addCommodities().exec();
	}
};
