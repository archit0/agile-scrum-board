import React, {PropTypes} from "react";
import {Link} from "react-router";
import Notifications, {notify} from 'react-notify-toast';
import {Home} from './mainApp/Home';
import {LoginSignup} from './login/LoginSignup';
export const IndexApp = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData(){
        let logginHandle = Meteor.loggingIn();
        return {loading: logginHandle};
    },
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    render(){

        let children = null;
        if (this.data.loading) {
            children = <div className="text-center">
                <img className="imgGif" src="/loader.gif" height="100px" width="auto"/>
                <h2>Loading Please Wait...</h2>
            </div>;
        } else {

            if (Meteor.user()) {
                if(GETDATA(this.props.location.pathname)!="/")
                children = this.props.children;
                else
                    this.context.router.push('/home');
            }
            else {
                children = <LoginSignup />
            }
        }

        return (
            <div>
                <Notifications />


                {children}
            </div>);
    }

});