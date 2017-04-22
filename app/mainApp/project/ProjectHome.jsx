import React, {PropTypes} from "react";
import {Link} from "react-router";
import  {notify} from 'react-notify-toast';
import {DBProjects} from '../../../services/ProjectService';


export const ProjectHome = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    mixins: [ReactMeteorData],
    getMeteorData(){
        let allProjectsHandle = Meteor.subscribe('allProjects');
        let accessingProjectId=this.props.params.projectId;

        let loading= !allProjectsHandle.ready();
        if(accessingProjectId&&allProjectsHandle.ready()){ //This is when user trying to access a project
            loading=true;
            let allProject= DBProjects.find().fetch();
            let allowed=false;
            for(let x=0;x<allProject.length;x++){
                if(allProject[x]['_id']==accessingProjectId) {
                    allowed = true;
                    break;
                }
            }
            if(!allowed){
                console.log("Not allowed");
                notify.show("Permission Denied","error");
                this.context.router.push("/notAllowed");
            }
            else{
                console.log("[info] Allowed to proceed");
                loading=false;
            }
        }
         if(allProjectsHandle.ready()){
            loading=true;
            let allProjects=DBProjects.find().fetch();
             let users=[];
             for(let x=0;x<allProjects.length;x++){
                 if(allProjects[x].users){
                     for(let y=0;y<allProjects[x].users.length;y++){
                         users.push(allProjects[x].users[y])
                     }
                 }
             }
            let usersHandle=Meteor.subscribe('getUserDetails',users);
            if(usersHandle.ready()){
                loading=false;
            }
        }
        return {loading:loading}
    },

    render: function () {

        if (this.data.loading) {
            return (<div className="text-center">
                <img className="imgGif" src="/loader.gif" height="100px" width="auto"/>
                <h2>Loading Projects...</h2>
            </div>);
        }
        return (
            <div>
                {this.props.children}
            </div>

        )
            ;
    }

});