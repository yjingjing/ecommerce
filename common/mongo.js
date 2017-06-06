var Mongolass=require('mongolass');
var mongolass=new Mongolass();
var config=require('config-lite')(__dirname);
mongolass.connect(config.mongodb);
var moment=require('moment');
var objectIdToTimestamp=require('objectid-to-timestamp');
//根据id生成创建时间 created_at
mongolass.plugin('addCreatedAt',{
	afterFind:function(results){
		results.forEach(function(item){
			item.created_at=moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm:ss');
		});
		return results;
	},
	afterFindOne:function(result){
		if(result){
			result.created_at=moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm:ss');
		}
		return result;
	}
});
exports.Commoditycatagory=mongolass.model('Commoditycatagory',{
	cname:{type:'string'},
	ename:{type:'string'}
});
exports.Commoditycatagory.index({_id:1}).exec();
exports.User=mongolass.model('User',{
	name:{type:'string'},
	password:{type:'string'},
	gender:{type:'string',enum:['m','f','x']},
	resume:{type:'string'},
	portrait:{type:'string'}
});
exports.Catagory=mongolass.model('Catagory',{
	cname:{type:'string'},
	ename:{type:'string'}
});
exports.Catagory.index({_id:1}).exec();
//根据用户名找到用户，用户名全局唯一
exports.User.index({name:1},{unique:true}).exec();
exports.Commodity=mongolass.model('Commodity',{
	name:{type:'string'},
	price:{type:'number'},
	catagory:{type:Mongolass.Types.ObjectId},
	imgSrc:{type:'string'},
	remainTime:{type:'number'},
	discount:{type:'number'},
	stockNum:{type:'number'},
	brandName:{type:'string'},
	commodityCode:{type:'string'},
	commodityWeight:{type:'number'},
	commodityLocation:{type:'string'}
});
exports.Commodity.index({_id:1}).exec();
exports.Cart=mongolass.model('Cart',{
	uId:{type:Mongolass.Types.ObjectId},
	cId:{type:Mongolass.Types.ObjectId},
	cName:{type:'string'},
	cPrice:{type:'number'},
	cImgSrc:{type:'string'},
	cQuantity:{type:'number'},
	cStatus:{type:'boolean'}
});
exports.Cart.index({uId:1,cId:1,_id:1}).exec();
exports.Order=mongolass.model('Order',{
	uId:{type:Mongolass.Types.ObjectId},
	cartId:{type:'string'},
	amount:{type:'number'},
	oStatus:{type:'number'}
});
exports.Order.index({uId:1,cartId:1,_id:1}).exec();
