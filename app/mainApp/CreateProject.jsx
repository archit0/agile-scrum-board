import React, {PropTypes} from "react";
import {Link} from "react-router";
import  {notify} from 'react-notify-toast';


export const CreateProject = React.createClass({

    createProject: function (event) {
        event.preventDefault();
        let projectName = this.refs.projectName.value.trim();
        let projectDisc=this.refs.projectDesc.value.trim();
        if(projectName.length>=1){
            Meteor.call('createNewProject', projectName, projectDisc, (err, res)=> {
                if (err) {
                    notify.show('Unable to create project', "error");
                }
                else {
                    this.refs.projectName.value="";
                    this.refs.projectDesc.value="";
                    notify.show("Project Created", "success");
                }
            });
        }else{
            notify.show("Enter valid project name","error");
        }

    },
    render: function () {
        return (
            <div>
                <h1>Create New project</h1>
                <form onSubmit={this.createProject}>
                    <input type="text" ref="projectName" placeholder="Enter project name"/>
                    <input type="text" ref="projectDesc" placeholder="Enter project description"/>

                    <button type="submit">Create</button>
                </form>
            </div>

        )
            ;
    }

});