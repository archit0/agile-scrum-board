export const DBAwaitUserInvitation= new Mongo.Collection('DBAwaitUserInvitation');
if(Meteor.isServer){
    Meteor.methods({



        addToAwaitList(emailId,projectId){
            DBAwaitUserInvitation.insert({emailId:emailId,projectId:projectId});
        },
        getAwaitedProjects(emailId){
            let projects=DBAwaitUserInvitation.find({emailId:emailId}).fetch();
            let projectId=[];
            for (let x=0;x<projects.length;x++)
                if(projectId.indexOf(projects[x].projectId)==-1)
                projectId.push(projects[x].projectId);

            return projectId;
        },
        removeAwaited(emailId){
            DBAwaitUserInvitation.remove({emailId:emailId});
        }
    });
}