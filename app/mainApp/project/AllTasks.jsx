import React, {PropTypes} from "react";
import {Link} from "react-router";
import  {notify} from 'react-notify-toast';
import {DBTask} from '../../../services/TaskService';

export const AllTasks = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    mixins: [ReactMeteorData],
    getMeteorData(){
        let users=Meteor.users.find().fetch();
        let userDict={};
        for(let x=0;x<users.length;x++)
            userDict[users[x]._id]=users[x].name;
       return {tasks:DBTask.find().fetch(),userDict:userDict};
    },
    getInitialState:function(){
        return {statusFilter:"ANY",assigneeFilter:"ANY"};
    },
    changeFilter:function () {
      this.setState({statusFilter:this.refs.filterStatus.value,
          assigneeFilter:this.refs.filterAssignee.value});

    },
    render: function () {

        let userDict=this.data.userDict;
        let projectId=this.props.params.projectId;
        let allTasks=this.data.tasks;
        //Filtering
            if(this.state.statusFilter!="ANY"){
                allTasks=allTasks.filter((data)=>data.status==this.state.statusFilter);
            }
            if(this.state.assigneeFilter!="ANY"){

                allTasks=allTasks.filter((data)=>data.assignee==this.state.assigneeFilter);
            }

        //Filtering End
        let task=allTasks.map((data,i)=>
            <tr key={i}>
                <td><Link to={"/project/"+projectId+"/task/"+data._id}>{data._id}</Link></td>
                <td>{data.title}</td>
                <td>{data.status}</td>
                <td>{data.assignee==""?"None":(userDict[data.assignee] +
                (Meteor.userId()==data.assignee?" (Me)":""))}</td>
                <td>{data.scrumBoard==""?"None":data.scrumBoard}</td>
                <td>{data.percentDone}%</td>
            </tr>);


        let userChoice= Object.keys(userDict).map((data,i)=>
            <option key={i} value={data}>{userDict[data]}{data==Meteor.userId()?" (Me)":""}
            </option>);
        return (


            <div>
                <h1>All Tasks</h1>
                <div>
                    <h4>Filter</h4>
                    <span>Status:</span>&nbsp;
                    <select onChange={this.changeFilter} style={{width:"100px"}} ref="filterStatus" defaultValue={"ANY"}>
                        <option value="ANY">Any</option>
                        <option value="Draft">Draft</option>
                        <option value="Open">Open</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Close">Close</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Declined">Declined</option>
                        <option value="Re-opened">Re-opened</option>
                    </select>

                    &nbsp;<span>Assignee:</span>&nbsp;
                    <select onChange={this.changeFilter} style={{width:"150px"}} ref="filterAssignee" defaultValue={"ANY"}>
                       <option value="ANY">Any</option>
                        <option value="">None</option>
                        {userChoice}
                    </select>
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
                    {task}
                    </tbody>

                </table>
            </div>

        )
            ;
    }

});