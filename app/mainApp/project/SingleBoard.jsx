import React, {PropTypes} from "react";
import {Link} from "react-router";
import  {notify} from 'react-notify-toast';
import {DBTask} from '../../../services/TaskService';

export const SingleBoard = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    mixins: [ReactMeteorData],
    getMeteorData(){
        let users = Meteor.users.find().fetch();
        let userDict = {};
        for (let x = 0; x < users.length; x++)
            userDict[users[x]._id] = users[x].name;
        return {tasks: DBTask.find().fetch(), userDict: userDict};
    },
    render: function () {

        let tasks = this.props.tasks;
        let projectId=this.props.projectId;
        let renderTasks = this.props.tasks.map((data, i)=>
            <div key={i} className="list-cards u-fancy-scrollbar u-clearfix js-list-cards js-sortable ui-sortable">
                <div className="list-card js-member-droppable is-due-complete ui-droppable">
                    <div className="list-card-details">
                        <div className="list-card-labels js-card-labels"></div>
                        <Link  to={"/project/"+projectId+"/task/"+data._id} className="list-card-title js-card-name" dir="auto">{data.title}</Link>
                        <span className="js-badges"><div className="badge is-due-past" title="Status">

                            <span
                            className="badge-text">{data.status}</span>
                        </div>
                        </span>
                    </div>
                </div>
            </div>
        );
        return (


            <div className="js-list list-wrapper">
                <div className="list js-list-content">
                    <div className="list-header js-list-header u-clearfix is-menu-shown">
                        <h2 className="list-header-name-assist js-list-name-assist" style={{display: 'block'}}>
                            {this.props.board}
                        </h2>

                    </div>
                    {renderTasks}
                    <Link  to={"/task/"+projectId+"/create?scrum="+this.props.board}
                           className="open-card-composer js-open-card-composer"
                           >Add a task…</Link></div>
            </div>

        )
            ;
    }

});