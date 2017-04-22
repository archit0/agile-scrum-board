import React, {PropTypes} from "react";
import {Link} from "react-router";
import  {notify} from 'react-notify-toast';
import {DBProjects} from '../../services/ProjectService';
import {DBTask} from '../../services/TaskService';

export const EditTask = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    mixins: [ReactMeteorData],
    getMeteorData(){
        let projectId = this.props.params.projectId;
        let taskId = this.props.params.taskId;
        let handle = Meteor.subscribe('createTaskProjectSubscribe', projectId);
        let details = DBProjects.find().fetch()[0];
        let taskHandle = Meteor.subscribe('taskDetail', projectId, taskId);
        let loading = true;
        let userDetails = {};
        if (handle.ready()) {
            if (GETDATA(details, 'users')) {
                let handle2 = Meteor.subscribe('getUserDetails', details.users);
                if (handle2.ready()) {
                    let data = Meteor.users.find().fetch();
                    for (let x = 0; x < data.length; x++) {
                        userDetails[data[x]['_id']] = data[x]['name'];
                    }
                    loading = false;
                }
            }
            else //No User Found
                loading = false;
        }
        return {
            loading: loading || !taskHandle.ready(),
            taskData: DBTask.find().fetch(),
            projectDetail: details,
            userDetails: userDetails
        };
    },
    saveSubmit(event){
        event.preventDefault();
        let projectId = this.props.params.projectId;
        let title = this.refs.title.value.trim();
        let description = this.refs.desc.value.trim();

        let scrumBoard = this.refs.scrumBoard.value;
        let assignee = this.refs.assignee.value;
        let status = this.refs.status.value;
        if (scrumBoard == "NONE")
            scrumBoard = "";
        if (assignee == "NONE")
            assignee = "";


        let percentDone = this.refs.percentDone.value;
        let parentTask = this.refs.parentTask.value;


        let taskObject = {
            title: title, description: description,
            assignee: assignee, scrumBoard: scrumBoard, status: status, percentDone: percentDone, parentTask: parentTask
        };
        Meteor.call('createTask', projectId, taskObject, (err, res)=> {
            if (res) {
                notify.show("Task Created", "success");
            } else {
                notify.show("Unable to create Task", "error");
            }
        });

    },

    render: function () {
        console.log(this.data)
        if (this.data.loading) {
            return (<div className="text-center">
                <img className="imgGif" src="/loader.gif" height="100px" width="auto"/>
                <h2>Loading Projects...</h2>
            </div>);
        }
        let projectDetails = [];
        let taskData = {};


        if (this.data.projectDetail && this.data.taskData[0]) {
            projectDetails = this.data.projectDetail;
            taskData = this.data.taskData[0];
        }
        else
            return (<h1>Not Allowed</h1>)


        let boardChoice = projectDetails.scrumBoards.map((data, i)=>
            <option key={i} value={data}>{data}</option>);
        let userDetails = this.data.userDetails;
        let userChoice = Object.keys(userDetails).map((data, i)=>
            <option key={i} value={data}>{userDetails[data]}{data == Meteor.userId() ? " (Me)" : ""}
            </option>);



        return (
            <div>
                <h1>Task Id:{this.props.params.taskId}</h1>
                <form onSubmit={this.saveSubmit}>
                    <label>Enter Title: </label>
                    <input type="text" ref="title" defaultValue={taskData.title} placeholder="Enter task tile:"/>
                    <br/>

                    <label>Enter Description: </label>
                    <input type="text" ref="desc" defaultValue={taskData.description}
                           placeholder="Enter task Description:"/>
                    <br/>
                    <label>Assignee</label>
                    <select ref="assignee" defaultValue={taskData.assignee == "" ? "NONE" : taskData.assignee}>
                        <option disabled value="NONE">None</option>
                        {userChoice}
                    </select>

                    <br/>
                    <label>Select Scrum Board</label>
                    <select ref="scrumBoard" defaultValue={taskData.scrumBoard == "" ? "NONE" : taskData.scrumBoard}>
                        <option disabled value="NONE">None</option>
                        {boardChoice}
                    </select>

                    <br/>
                    <label>Select Status</label>
                    <select ref="status" defaultValue={taskData.status}>
                        <option value="Draft">Draft</option>
                        <option value="Open">Open</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Close">Close</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Declined">Declined</option>
                        <option value="Re-opened">Re-opened</option>
                    </select>
                    <br/>
                    <label>Percentage Done:</label>
                    <input type="number" ref="percentDone" defaultValue={taskData.percentDone}/>%
                    <br/>
                    <label>Parent Task Id:</label>
                    <input type="text" id="parentTask" ref="parentTask" defaultValue={taskData.parentTask}/>

                    <br/>
                    <input type="submit" value="Create Task"/>
                </form>
            </div>

        )
            ;
    }

});