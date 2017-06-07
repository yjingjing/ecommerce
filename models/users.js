var User=require('../common/mongo').User;
module.exports={
	create:function(user){
		return User.create(user).exec();
	},
	getUserByName:function(name){
		return User.findOne({name:name}).addCreatedAt().exec();
	},
	updateUserById:function(id,obj){
		return User.update({_id:id},{$set:obj}).exec();
	}
}
