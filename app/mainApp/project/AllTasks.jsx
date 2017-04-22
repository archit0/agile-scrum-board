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
    render: function () {

        let userDict=this.data.userDict;
        let projectId=this.props.params.projectId;
        let task=this.data.tasks.map((data,i)=>
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
                <h1>All Tasks</h1>
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