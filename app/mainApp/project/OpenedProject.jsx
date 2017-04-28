import React, {PropTypes} from "react";
import {Link} from "react-router";
import  {notify} from 'react-notify-toast';
import {DBProjects} from '../../../services/ProjectService';


export const OpenedProject = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData(){
        let projectId=this.props.params.projectId;
        let users = Meteor.users.find().fetch();
        let userDict = {};
        users.forEach((data)=>
            userDict[data._id] = data.name)
        return {
            projectDetails:DBProjects.find({_id:projectId}).fetch()[0],userDict:userDict
        }
    },

    render: function () {






        let projectDetails=this.data.projectDetails;

        let users=projectDetails.users.map((data,i)=>
            <li style={{paddingLeft:'3%'}} key={i}><b>{this.data.userDict[data]}</b></li> );


        let notifications=null;
        try {
            notifications = projectDetails.notifications.reverse().map((data,i)=>
                <li key={i}><b>{data.message}</b><p>{data.updatedOn}</p><hr/></li>)
        }
        catch (e){

        }
        return (
            <div>
                <h1><u>Project home</u>&nbsp;
                    <Link to={"/project/"+this.props.params.projectId+"/edit"}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"/>
                    </Link>
                </h1>
                <br/>
                <div className="row">
                    <div className="col-sm-8">
                        <span>Project Name: </span>
                        <span><b>{GETDATA(projectDetails.projectName)}</b></span>
                        <br/>
                        <br/>
                        <span>Project Description: </span>
                        <span><b>{GETDATA(projectDetails.description)}</b></span>
                        <br/>
                        <br/>
                        <span>Created on: </span>
                        <span><b>{GETDATA(projectDetails.createdOn)}</b></span>
                        <br/>
                        <br/>
                        <span>Scrum Boards: </span>
                        <span><b>{GETDATA(projectDetails.scrumBoards).join()}</b></span>
                        <br/>
                        <br/>
                        <span>Created by: </span>
                        <span><b>{this.data.userDict[projectDetails.createdBy]+(Meteor.userId()==projectDetails.createdBy?" (Me)":"")}</b></span>
                        <br/>
                        <br/>
                        <span>Users: </span>
                        <span><ul>{users}</ul></span>
                        </div>
                    <div className="col-sm-4" style={{border:'1px'}}>
                        <h1><u>Notifications</u></h1>
                        <ul>
                            {notifications}
                        </ul>
                    </div>
                    </div>

            </div>

        )
            ;
    }

});