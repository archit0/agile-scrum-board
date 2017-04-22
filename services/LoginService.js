/**
 * Created by archit on 9/4/17.
 */

if(Meteor.isServer){
        Meteor.methods({

           getUserId:function (emailId) {
                let data=Meteor.users.find({'emails.address':emailId}).fetch();
                if(data.length>0)
                    return data[0]._id;
                return false;

           },

            confirmUser:function(email,userId,name){
                let getInvitedProjects=Meteor.call('getAwaitedProjects',email);
                for(let x=0;x<getInvitedProjects.length;x++){
                    let projectId=getInvitedProjects[x];
                    Meteor.call('SECRET_forceAddUser',email,projectId,userId);
                }
                Meteor.call('removeAwaited',email);
                Meteor.users.update({_id:userId}, {$set:{'emails.0.verified':true,'name':name}});
                return true;
            }

        });
}