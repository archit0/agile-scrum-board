import React, {PropTypes} from "react";
import {Link} from "react-router";
import  {notify} from 'react-notify-toast';
import {DBProjects} from '../../../services/ProjectService';


export const OpenedProject = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData(){
        let projectId=this.props.params.projectId;
        let tasks=Meteor.subscribe('allTasks',this.props.params.projectId);
        return {loading:!tasks.ready(),
            projectDetails:DBProjects.find({_id:projectId}).fetch()[0]
        }
    },

    render: function () {


        if(this.data.loading){
            return (<div className="text-center">
                <img className="imgGif" src="/loader.gif" height="100px" width="auto"/>
                <h2>Loading Project Data...</h2>
            </div>);
        }
        console.log("Project Data loaded");
        let projectDetails=this.data.projectDetails;


        return (
            <div>
                <h1>Project Name: {GETDATA(projectDetails.projectName)}</h1>
                <h3>Project Description: {GETDATA(projectDetails.description)}</h3>
                {this.props.children}
            </div>

        )
            ;
    }

});