import React, {PropTypes} from "react";
import {Link} from "react-router";
import  {notify} from 'react-notify-toast';
import {DBProjects} from '../../../services/ProjectService';


export const ProjectRoot = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData(){
        let tasks=Meteor.subscribe('allTasks',this.props.params.projectId);
        return {loading:!tasks.ready()
        }
    },

    render: function () {


        if(this.data.loading){
            return (<div className="text-center">
                <img className="imgGif" src="/loader.gif" height="100px" width="auto"/>
                <h2>Loading Project Data...</h2>
            </div>);
        }
        return (
            <div>
                <Link to={"/project/"+this.props.params.projectId}><u>Project Home</u></Link>&nbsp;|&nbsp;
                <Link to={"/project/"+this.props.params.projectId+"/task/create"}><u>Create Task</u></Link>&nbsp;|&nbsp;
                <Link to={"/project/"+this.props.params.projectId+"/tasks"}><u>View All Tasks</u></Link>&nbsp;|&nbsp;
                <Link to={"/project/"+this.props.params.projectId+"/scrum"}><u>Scrum Board</u></Link>
                <hr/>
                {this.props.children}
            </div>

        )
            ;
    }

});