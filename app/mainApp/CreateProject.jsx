import React, {PropTypes} from "react";
import {Link} from "react-router";
import  {notify} from 'react-notify-toast';


export const CreateProject = React.createClass({

    createProject: function (event) {
        event.preventDefault();
        let projectName = this.refs.projectName.value.trim();
        let projectDisc=this.refs.projectDesc.value.trim();
        Meteor.call('createNewProject', projectName, projectDisc, (err, res)=> {
            if (err) {
                notify.show('Unable to create project', "error");
            }
            else {
                console.log(res);
                notify.show("Project Created", "success");
            }
        });
    },
    render: function () {
        return (
            <div>
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