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
        let scrumDict={};

        let tasks=DBTask.find({}).fetch();
        let projectScrums=GETDATA(DBProjects.find({_id:this.props.params.projectId}).fetch(),0,'scrumBoards');
        if(!projectScrums)
            projectScrums=[];
        if(!tasks)
            tasks=[];

       try {

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
       catch (e){
       }
        return {scrumDict: scrumDict,scrums:projectScrums, userDict: userDict};
    },
    render: function () {
        let userDict = this.data.userDict;
        let projectId = this.props.params.projectId;
        let task = this.data.scrums.map((data, i)=>
           <SingleBoard key={i} board={data} tasks={this.data.scrumDict[data]?this.data.scrumDict[data]:[]}
            projectId={projectId}
           />);

        return (


            <div className="board-wrapper is-show-menu" style={{top:'20%'}}>
                <div className="board-main-content">
                    <div className="board-canvas">
                        <div id="board" className="u-fancy-scrollbar js-no-higher-edits js-list-sortable ui-sortable">
                            {task}
                        </div>
                    </div>
                </div>
            </div>

        )
            ;
    }

});