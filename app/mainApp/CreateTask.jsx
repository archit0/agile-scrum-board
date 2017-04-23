import React, {PropTypes} from "react";
import {Link} from "react-router";
import  {notify} from 'react-notify-toast';
import {DBProjects} from '../../services/ProjectService';

export const CreateTask = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    mixins: [ReactMeteorData],
    getMeteorData(){
        let projectId = this.props.params.projectId;
        let handle = Meteor.subscribe('createTaskProjectSubscribe', projectId);
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
        let projectId = this.props.params.projectId;
        let title = this.refs.title.value.trim();
        let description = this.refs.desc.value.trim();

        let scrumBoard=this.refs.scrumBoard.value;
        let assignee=this.refs.assignee.value;
        let status=this.refs.status.value;
        if(scrumBoard=="NONE")
            scrumBoard="";
        if(assignee=="NONE")
            assignee="";


        let percentDone=this.refs.percentDone.value;
        let parentTask=this.refs.parentTask.value;

        Meteor.call('checkTaskExists',parentTask,projectId,(err,res)=>{
           if(res||parentTask==""){
               let taskObject={title:title,description:description,
                   assignee:assignee,scrumBoard:scrumBoard,status:status,percentDone:percentDone,parentTask:parentTask};
               Meteor.call('createTask',projectId,taskObject,(err,res)=>{
                   if(res){
                       notify.show("Task Created","success");
                   }else{
                       notify.show("Unable to create Task","error");
                   }
               });
           } else{
               $("#parentTask").focus();

               notify.show("Parent Task does not exist in this Project","error");
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


        let boardChoice = projectDetails.scrumBoards.map((data, i)=>
            <option key={i} value={data}>{data}</option>);
        let userDetails=this.data.userDetails;
        let userChoice= Object.keys(userDetails).map((data,i)=>
                <option key={i} value={data}>{userDetails[data]}{data==Meteor.userId()?" (Me)":""}
                </option>);


        let parentTask="";
        if(this.props.location.query.parent){
            parentTask=this.props.location.query.parent;
        }
        let scrum="";
        if(this.props.location.query.scrum){
            scrum=this.props.location.query.scrum;
        }
        return (
            <div>
                <Link className="boards-page-board-section-header-options-item dark-hover text-center" to={"/project/"+this.props.params.projectId}><u>Project Home</u></Link>
                <hr/>
                    <form onSubmit={this.saveSubmit}>
                        <label>Enter Title: </label>
                        <input type="text" ref="title" placeholder="Enter task tile:"/>
                        <br/>

                        <label>Enter Description: </label>
                        <input type="text" ref="desc" placeholder="Enter task Description:"/>
                        <br/>
                        <label>Assignee</label>
                        <select  ref="assignee"  defaultValue="NONE" >
                            <option disabled value="NONE">None</option>
                            {userChoice}
                         </select>

                        <br/>
                        <label>Select Scrum Board</label>
                        <select  ref="scrumBoard"  defaultValue={scrum==""?"NONE":scrum} >
                            <option disabled value="NONE">None</option>
                            {boardChoice}
                        </select>

                        <br/>
                        <label>Select Status</label>
                        <select  ref="status"  defaultValue="Open" >
                            <option value="Draft">Draft</option>
                            <option value="Open">Open</option>
                            <option value="In-Progress">In-Progress</option>
                            <option value="Close">Close</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Declined">Declined</option>
                            <option value="Re-opened">Re-opened</option>
                        </select>
                        <br/>
                        <label>Percentage Done:</label>
                        <input type="number"  ref="percentDone" defaultValue={"0"}/>
                        <br/>
                        <label>Parent Task Id:</label>
                        <input type="text" id="parentTask" ref="parentTask" defaultValue={parentTask}/>

                        <br/>
                        <input type="submit" value="Create Task"/>
                    </form>
            </div>

        )
            ;
    }

});