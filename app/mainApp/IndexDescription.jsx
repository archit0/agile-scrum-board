import React, {PropTypes} from "react";
import {Link} from "react-router";
import  {notify} from 'react-notify-toast';
export const IndexDescription = React.createClass({
    render(){
        return (
            <div className="jumbotron">
                <div className="container text-center">
                    <h1>AGILE DEVELOPMENT PLATFORM</h1>
                    <p>Helping building and managing your platform</p>
                </div>

            </div>

        );
    }
});