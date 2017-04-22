export const DBProjects = new Mongo.Collection('DBProjects');

if (Meteor.isServer) {

    Meteor.publish('allProjects', function () {
        return DBProjects.find({'$or': [{createdBy: this.userId}, {users: this.userId}]});
    });
    Meteor.publish('oneProject', function (projectId) {
        return DBProjects.find({createdBy: this.userId, '_id': projectId});
    });
    Meteor.publish('createTaskProjectSubscribe', function (projectId) {
        return DBProjects.find({'$or': [{createdBy: this.userId}, {users: this.userId}], '_id': projectId});
    });
    Meteor.methods({
        createNewProject(projectName, description){
            if (Meteor.userId()) {
                return DBProjects.insert({
                    projectName: projectName,
                    description: description,
                    createdOn: new Date().toString(),
                    users: [Meteor.userId()],
                    createdBy: Meteor.userId(),
                    scrumBoards: [],

                    notifications:[{message:'Created Project',updatedOn:new Date().toString(),updatedBy:Meteor.userId()}]
                });
            }
            return false;
        },
        updateProjectDetails(projectId, newProjectName, description){
            let toUpdate = DBProjects.find({_id: projectId, createdBy: Meteor.userId()}).fetch();
            if (toUpdate.length < 1)
                return false;
            toUpdate = toUpdate[0];

            toUpdate.notifications.push({message:'Updated Project Details',
                updatedOn:new Date().toString(),updatedBy:Meteor.userId()});

            DBProjects.update({_id: projectId}, {
                $set: {
                    projectName: newProjectName,
                    description: description,
                    notifications:toUpdate.notifications,

                }
            });
            return true;
        },

        addScrumBoard(projectId, scrum){
            let toUpdate = DBProjects.find({_id: projectId, createdBy: Meteor.userId()}).fetch();
            if (toUpdate.length < 1)
                return false;
            toUpdate = toUpdate[0];
            toUpdate.scrumBoards.push(scrum);

            toUpdate.notifications.push({message:'Scrum Board Added: '+scrum,updatedOn:new Date().toString(),updatedBy:Meteor.userId()});
            DBProjects.update({_id: projectId}, {
                $set: {
                    scrumBoards: toUpdate.scrumBoards,
                    notifications:toUpdate.notifications
                }
            });
            return true;
        },

        addUser(projectId, email){
            let toUpdate = DBProjects.find({_id: projectId, createdBy: Meteor.userId()}).fetch();
            if (toUpdate.length < 1)
                return false;
            toUpdate = toUpdate[0];
            let user = Meteor.users.find({'emails.address': email}).fetch();
            if (user.length >=1) {
                let userId = user[0]['_id'];
                if (toUpdate.users.indexOf(userId) == -1) {
                    toUpdate.users.push(userId);

                    toUpdate.notifications.push(
                        {message:'User added to project: '+email,updatedOn:new Date().toString(),updatedBy:Meteor.userId()});

                    DBProjects.update({_id: projectId}, {
                        $set: {
                            users: toUpdate.users,
                            notifications:toUpdate.notifications
                        }
                    });
                }
            } else {
                toUpdate.notifications.push({message:'User invited to project: '+email,updatedOn:new Date().toString(),updatedBy:Meteor.userId()});
                DBProjects.update({_id: projectId}, {
                    $set: {
                        notifications:toUpdate.notifications
                    }
                });
                Meteor.call('addToAwaitList', email, projectId);
                return "Invited";
            }
            return true;
        },

        SECRET_forceAddUser(email,projectId, userToAdd){
            let toUpdate = DBProjects.find({_id: projectId}).fetch();
            toUpdate = toUpdate[0];
            if (toUpdate.users.indexOf(userToAdd) == -1) {
                toUpdate.users.push(userToAdd);
                toUpdate.notifications.push({message:'User accepted invitation: '+email,
                    updatedOn:new Date().toString(),updatedBy:Meteor.userId()});
                DBProjects.update({_id: projectId}, {
                    $set: {
                        users: toUpdate.users,
                        notifications:toUpdate.notifications
                    }
                });

            }
        },
        SECRET_userAllowedToCreateTask(projectId,userId){
            let toUpdate = DBProjects.find({'$or': [{createdBy: userId}, {users: userId}], '_id': projectId}).fetch();
            if(toUpdate<=0)
                return false;
            return toUpdate[0];
        },

        });
}