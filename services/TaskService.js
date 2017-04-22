export const DBTask= new Mongo.Collection('DBTask');
if(Meteor.isServer){
    Meteor.publish('taskDetail',function (projectId,taskId) {
        let allowed=Meteor.call('SECRET_userAllowedToCreateTask',projectId,this.userId);
        if(!allowed)
            return false;
        return DBTask.find({_id:taskId,projectId:projectId});

    });
    Meteor.publish('allTasks',function (projectId) {
        let allowed=Meteor.call('SECRET_userAllowedToCreateTask',projectId,this.userId);
        if(!allowed)
            return false;
        return DBTask.find({projectId:projectId});
    });
    Meteor.methods({
        checkTaskExists(taskId,projectId){
          return DBTask.find({_id:taskId,projectId:projectId}).count()>0;
        },
        createTask(projectId,taskObj){
            let allowed=Meteor.call('SECRET_userAllowedToCreateTask',projectId,Meteor.userId());
            if(!allowed)
                return false;
            else{
                let count=DBTask.find().count()+1;
                let taskObject={title:taskObj.title,
                    description:taskObj.description,
                    assignee:taskObj.assignee,
                    status:taskObj.status,
                    scrumBoard:taskObj.scrumBoard,
                    percentDone:taskObj.percentDone,
                    parentTask:taskObj.parentTask};
                taskObject['projectId']=projectId;
                taskObject['createdBy']=Meteor.userId();
                taskObject['createdOn']=new Date().toString();
                taskObject['notifications']=[{message:"Created Task",
                    updatedOn:new Date().toString(),updatedBy:Meteor.userId()}];
                taskObject['_id']=count+"";
                DBTask.insert(taskObject);
                return true;
            }
        }
    });
}