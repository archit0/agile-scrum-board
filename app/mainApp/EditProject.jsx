import React, {PropTypes} from "react";
import {Link} from "react-router";
import  {notify} from 'react-notify-toast';
import {DBProjects} from '../../services/ProjectService';

export const EditProject = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    mixins: [ReactMeteorData],
    getMeteorData(){
        let projectId = this.props.params.projectId;

        let handle = Meteor.subscribe('oneProject', projectId);
        let details=DBProjects.find().fetch()[0];
        let loading=true;
        let userDetails={};
        if(handle.ready()){
            if(GETDATA(details,'users')) {
                let handle2 = Meteor.subscribe('getUserDetails', details.users);
                if(handle2.ready()){
                    let data=Meteor.users.find().fetch();
                    for(let x=0;x<data.length;x++){
                        userDetails[data[x]['_id']]=data[x]['name'];
                    }

                    loading=false;
                }
            }
            else //No User Found
                loading=false;
        }
        return {
            loading: loading,
            projectDetail: details,
            userDetails:userDetails
        };
    },
    saveSubmit(event){
        event.preventDefault();
        let newName = this.refs.projectName.value.trim();
        let description = this.refs.description.value.trim();
        let projectId = this.props.params.projectId;
        Meteor.call('updateProjectDetails', projectId, newName, description, (err, res)=> {
            if (res) {
                notify.show("Updated", "success");
            } else
                notify.show("Cannot Change", "error");
        });
    },
    addScrumBoard(event){
        event.preventDefault();
        let scrum = this.refs.scrum.value.trim();
        let projectId = this.props.params.projectId;
        Meteor.call('addScrumBoard', projectId, scrum, (err, res)=> {
            if (res) {
                notify.show("Added", "success");
            }
            else {
                notify.show("Unable to add", "error");
            }
        });
    },
    addUser(event){
        event.preventDefault();
        let email = this.refs.email.value.trim();
        let projectId = this.props.params.projectId;
        Meteor.call('addUser', projectId, email, (err, res)=> {
            if(res=="Invited"){
                notify.show("Invited", "success");

            }
            else if (res) {
                notify.show("Added", "success");
            }
            else {
                notify.show("Unable to add", "error");
            }
        });
    },
    render: function () {
        if (this.data.loading) {
            return (<div className="text-center">
                <img className="imgGif" src="/loader.gif" height="100px" width="auto"/>
                <h2>Loading Projects...</h2>
            </div>);
        }
        let projectDetails = [];
        if (this.data.projectDetail)
            projectDetails = this.data.projectDetail;
        else
            return (<h1>Not Allowed</h1>)


        let boards = projectDetails.scrumBoards.map((data, i)=><li key={i}>{data}</li>);
        let userDetails=this.data.userDetails;
        let users=Object.keys(userDetails).map((data,i)=><li key={i}>
            {userDetails[data]}
            {data==Meteor.userId()?" (Me)":""}</li>)
        return (
            <div>
                <Link to={"/project/"+this.props.params.projectId}><u>Project Home</u></Link>
                <hr/>
                <h3>Update Details</h3>
                <form onSubmit={this.saveSubmit}>
                    <label>Name:</label>
                    <input type="text" defaultValue={projectDetails.projectName} ref="projectName"/>
                    <br/>
                    <label>Description:</label>
                    <input type="text" defaultValue={projectDetails.description} ref="description"/>
                    <br/>
                    <input type="submit" value="Update"/>
                </form>
                <hr/>
                <h3>Manage Scrum Boards</h3>
                <form onSubmit={this.addScrumBoard}>
                    <label>Add Scrum Board:</label>
                    <input type="text" ref="scrum"/>
                    <input type="submit" value="Add"/>
                </form>
                <ul>
                    {boards}
                </ul>
                <hr/>
                <h3>Manage Users</h3>
                <form onSubmit={this.addUser}>
                    <label>Add/Invite User:</label>
                    <input type="email" ref="email" placeholder="Enter email:"/>
                    <input type="submit" value="Add"/>
                </form>
                <ul>{users}</ul>

            </div>

        )
            ;
    }

});