import React, {PropTypes} from "react";
import {Link} from "react-router";
import  {notify} from 'react-notify-toast';
import {DBTask} from '../../../services/TaskService';
import {SingleBoard} from './SingleBoard';
import {DBProjects} from '../../../services/ProjectService';

export const Scrum = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    mixins: [ReactMeteorData],
    getMeteorData(){
        let users = Meteor.users.find().fetch();
        let userDict = {};
        users.forEach((data)=>
            userDict[data._id] = data.name)
        let scrumDict = {};

        let tasks = DBTask.find({}).fetch();
        let projectScrums = GETDATA(DBProjects.find({_id: this.props.params.projectId}).fetch(), 0, 'scrumBoards');
        if (!projectScrums)
            projectScrums = [];
        if (!tasks)
            tasks = [];

        try {
            //Filtering
            if(this.state.statusFilter!="ANY"){
                tasks=tasks.filter((data)=>data.status==this.state.statusFilter);
            }
            if(this.state.assigneeFilter!="ANY"){

                tasks=tasks.filter((data)=>data.assignee==this.state.assigneeFilter);
            }
            if(this.state.searchFilter!=""){
                tasks=tasks.filter((data)=>data.title.toLowerCase().indexOf(this.state.searchFilter.toLowerCase().trim())>=0);
            }

            //Filtering End
            for (let x = 0; x < projectScrums.length; x++) {
                if (projectScrums[x] == "")
                    projectScrums[x] = "None";

                scrumDict[projectScrums[x]] = [];

            }
            projectScrums.push('None');

            tasks.forEach((data)=> {
                let currentTask = data;
                let currentScrum = data.scrumBoard;
                if (currentScrum == "")
                    currentScrum = "None";
                let tasks = [];
                if (scrumDict[currentScrum]) {
                    tasks = scrumDict[currentScrum];
                }
                tasks.push(currentTask);
                scrumDict[currentScrum] = tasks;
            });
        }
        catch (e) {
        }
        return {scrumDict: scrumDict, scrums: projectScrums, userDict: userDict};
    },
    getInitialState:function(){
        return {statusFilter:"ANY",assigneeFilter:"ANY",searchFilter:""};
    },
    changeFilter:function () {
        this.setState({searchFilter:this.refs.searchText.value,
            statusFilter:this.refs.filterStatus.value,
            assigneeFilter:this.refs.filterAssignee.value});

    },
    render: function () {
        let userDict = this.data.userDict;
        let projectId = this.props.params.projectId;
        let task = this.data.scrums.map((data, i)=>
            <SingleBoard key={i} board={data} tasks={this.data.scrumDict[data] ? this.data.scrumDict[data] : []}
                         projectId={projectId}
            />);
        return (
            <div>
                <div>
                    <input style={{float:'right'}} onChange={this.changeFilter} type="text" placeholder="Search" ref="searchText"/>&nbsp;
                    <span style={{float:'left'}}>
                    <span>Status:</span>&nbsp;
                        <select onChange={this.changeFilter} style={{width: "100px"}} ref="filterStatus"
                                defaultValue={"ANY"}>
                        <option value="ANY">Any</option>
                        <option value="Draft">Draft</option>
                        <option value="Open">Open</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Close">Close</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Declined">Declined</option>
                        <option value="Re-opened">Re-opened</option>
                    </select>

                        <br/><span>Assignee:</span>&nbsp;
                        <select onChange={this.changeFilter} style={{width: "150px"}} ref="filterAssignee"
                                defaultValue={"ANY"}>
                        <option value="ANY">Any</option>
                        <option value="">None</option>
                            {Object.keys(userDict).map((data, i)=>
                                <option key={i} value={data}>{userDict[data]}{data == Meteor.userId() ? " (Me)" : ""}
                                </option>)}
                    </select>
                        </span>
                </div>
                <br/><br/>
                <div className="board-wrapper is-show-menu" style={{top: '30%'}}>

                    <div className="board-main-content">
                        <div className="board-canvas">

                            <div id="board"
                                 className="u-fancy-scrollbar js-no-higher-edits js-list-sortable ui-sortable">
                                {task}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
            ;
    }

});