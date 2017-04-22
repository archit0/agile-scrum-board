import React, {PropTypes} from "react";
import {Link} from "react-router";
import  {notify} from 'react-notify-toast';
import {DBTask} from '../../../services/TaskService';

export const SingleTask = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    mixins: [ReactMeteorData],
    getMeteorData(){
        let taskDetails=DBTask.find({_id:this.props.params.taskId}).fetch()
        let users=Meteor.users.find().fetch();
        let userDict={};
        for(let x=0;x<users.length;x++)
            userDict[users[x]._id]=users[x].name;
        return {taskDetails:taskDetails,userDict:userDict};
    },
    render: function () {

        let taskDetails=this.data.taskDetails;
        if(taskDetails.length<1)
            return <h1>Task Doesn't Exist</h1>;

        taskDetails=taskDetails[0];


        return (


            <div>
                <h1>Task Details</h1>
                <h3>Title: {taskDetails.title}</h3>
                <h3>Description: {taskDetails.description}</h3>
                <h3>Percentage Done: {taskDetails.percentDone}</h3>
                <h3>Created By: {this.data.userDict[taskDetails.createdBy]}</h3>
                <h3>Created On: {taskDetails.createdOn}</h3>
                <h3>Status: {taskDetails.status}</h3>
                <h3>Scrum Board: {taskDetails.scrumBoard}</h3>
                <h3>Assignee: {this.data.userDict[taskDetails.assignee]}</h3>
            </div>

        )
            ;
    }

});