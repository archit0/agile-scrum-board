if(Meteor.isServer){
    Meteor.publish('getUserDetails',function (userIds) {
        return Meteor.users.find({'_id':{'$in':userIds}},{name:1});
    })
}