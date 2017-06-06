var Commoditycatagory=require('../common/mongo').Commoditycatagory;
module.exports={
	//按创建时间降序获取所有用户文章或者某个特定用户的所有文章
	getCommoditycatagory:function(){
		return Commoditycatagory.find({})
			.sort({_id:1})
			.addCreatedAt().exec();
	}
};
