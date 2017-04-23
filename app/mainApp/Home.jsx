import React, {PropTypes} from "react";
import {Link} from "react-router";
import  {notify} from 'react-notify-toast';
import {IndexDescription} from '../mainApp/IndexDescription';

export const Home = React.createClass({
    render(){
        let message = null;
        if (Meteor.user()) {
            message = <Link to="#">
                                        <span onClick={()=>Meteor.logout()}
                                              className="glyphicon glyphicon-log-in">&nbsp;Logout</span></Link>;

        } else {
            message = <Link to="#">
                                        <span
                                            className="glyphicon glyphicon-log-in">&nbsp;Login</span></Link>
        }
        return (
        <div>
            <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse"
                                data-target="#myNavbar">
                            <span className="icon-bar"/>
                            <span className="icon-bar"/>
                            <span className="icon-bar"/>
                        </button>
                        <Link className="navbar-brand" to="/">PRGRM</Link>
                    </div>
                    <div className="collapse navbar-collapse" id="myNavbar">
                        <ul className="nav navbar-nav">
                            <li ><Link to="/home">Home</Link></li>
                            <li><Link to="/project/create">Create New Project</Link></li>
                            <li><Link to="/project">View Projects</Link></li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                {message}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {this.props.children}
        </div>

        );
    }
});