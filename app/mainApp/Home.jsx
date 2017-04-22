import React, {PropTypes} from "react";
import {Link} from "react-router";
import  {notify} from 'react-notify-toast';
export const Home = React.createClass({

    render(){
        return (
        <div>
            {this.props.children}
        </div>

        );
    }
});