import React, {PropTypes} from "react";
import {Link} from "react-router";
import  {notify} from 'react-notify-toast';
import {DBProjects} from '../../../services/ProjectService';
export const AllProjects = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData(){
        return {
            projects: DBProjects.find().fetch()
        }
    },
    render: function () {
        let projects = this.data.projects.map((data, i)=>
            <li className="boards-page-board-section-list-item js-draggable" key={i}>
                <Link className="board-tile" to={"/project/" + data._id}
                      style={{'background-color': ' rgb(131, 140, 145)'}}>
                    <span className="board-tile-details is-badged is-sub-named">
                        <span title="Issues" dir="auto" className="board-tile-details-name">
                        {data.projectName}</span>
                        <span title="Team Prgrm" dir="auto" className="board-tile-details-sub-name">
                            {data.description}
                        </span></span>

                    <span className="board-tile-options">
                        <Link to={"/project/"+data._id+"/edit"}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"/>
                    </Link>
                       </span>
                </Link>
                <div className="board-tags u-clearfix"></div>
            </li>);
        return (
            <div className="boards-page-board-section mod-no-sidebar">
                <ul className="boards-page-board-section-list">
                    {projects}
                </ul>
            </div>
        )
    }
});