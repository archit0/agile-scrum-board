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

        let subTasks=DBTask.find({parentTask:this.props.params.taskId}).fetch();
        return {taskDetails:taskDetails,userDict:userDict,subTasks:subTasks};
    },
    render: function () {

        let taskDetails=this.data.taskDetails;
        if(taskDetails.length<1)
            return <h1>Task Doesn't Exist</h1>;

        taskDetails=taskDetails[0];

        let parent=null;
        if(taskDetails.parentTask!=""){
            parent=<h3>Parent task:
                <Link className="boards-page-board-section-header-options-item dark-hover text-center"

                      to={"/project/"+this.props.params.projectId+"/task/"+taskDetails.parentTask}>
                {taskDetails.parentTask}
            </Link></h3>
        }
        let userDict=this.data.userDict;
        let projectId=this.props.params.projectId;
        let subTasks=this.data.subTasks.map((data,i)=>
            <tr key={i}>
                <td><Link to={"/project/"+projectId+"/task/"+data._id}>{data._id}</Link></td>
                <td>{data.title}</td>
                <td>{data.status}</td>
                <td>{data.assignee==""?"None":userDict[data.assignee]}</td>
                <td>{data.scrumBoard==""?"None":data.scrumBoard}</td>
                <td>{data.percentDone}%</td>
            </tr>);

        return (


            <div>
                <h1>Task Details</h1>
                {parent}
                <span>Title:</span><b>{taskDetails.title}</b><br/><br/>
                <span>Description:</span><b>{taskDetails.description}</b><br/><br/>
                <span>Percentage Done:</span><b>{taskDetails.percentDone}</b><br/><br/>
                <span>Created By:</span><b> {this.data.userDict[taskDetails.createdBy]}</b><br/><br/>
                <span>Created On:</span><b> {taskDetails.createdOn}</b><br/><br/>
                <span>Status:</span><b> {taskDetails.status}</b><br/><br/>
                <span>Scrum Board:</span><b> {taskDetails.scrumBoard}</b><br/><br/>
                <span>Assignee:</span><b> {this.data.userDict[taskDetails.assignee]}</b><br/><br/>
                <div>
                    <hr/>
                    <div>
                        <h3>{this.data.subTasks.length} Subtasks <Link className="boards-page-board-section-header-options-item dark-hover text-center"

                                                                       to={"/project/"+this.props.params.projectId+"/task/create?parent="+taskDetails._id}>
                            Add Subtask
                        </Link></h3>

                    </div>

                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>TASK ID</th>
                            <th>TITLE</th>
                            <th>STATUS</th>
                            <th>ASSIGNEE</th>
                            <th>SCRUM BOARD</th>
                            <th>PERCENTAGE DONE</th>
                        </tr>
                        </thead>
                        <tbody>
                        {subTasks}
                        </tbody>

                    </table>
                </div>
            </div>

        )
            ;
    }

});