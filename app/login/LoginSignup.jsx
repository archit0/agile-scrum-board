import React, {PropTypes} from "react";
import {Link} from "react-router";
import  {notify} from 'react-notify-toast';


export const LoginSignup = React.createClass({
    getInitialState: function () {
        return {loading: false};
    },
    initiateSignup:function (e) {
        e.preventDefault();
        this.setState({loading: true});
        let name=this.refs.name.value.trim();
        let email = this.refs.email2.value.trim();
        let password = this.refs.pwd2.value.trim();
        Meteor.call('getUserId', email, (err, userId1)=> {
           if(userId1){
               notify.show("Email already exists","error");
               this.setState({loading: false});

           } else{
               Accounts.createUser({email: email, password: password}, err=> {
                   Meteor.call('confirmUser',email, Meteor.userId(),name, (err, res)=> {
                       this.afterLogin();
                   });
               });
           }
        });
    },
    initiateLogin: function (e) {
        e.preventDefault();
        this.setState({loading: true});

        let email = this.refs.email.value.trim();
        let password = this.refs.pwd.value.trim();

        Meteor.call('getUserId', email, (err, userId1)=> {
            if (!userId1) {
                notify.show("Email doesn't exists","error");
                this.setState({loading: false});
            } else {
                Meteor.loginWithPassword(email, password, err=> {
                    if (!err) {
                        this.afterLogin();
                    }
                    else {
                        notify.show('Wrong Password', "error");
                        this.setState({loading: false});

                    }
                });
            }
        });

    },
    afterLogin: function () {
        notify.show('User logged In', "success");
        if (this.isMounted())
            this.setState({loading: false});
    },
    render: function () {
        let tab1=<div id="login" className="tab-pane fade in active">
            <br/>
            <form className="form-horizontal" onSubmit={this.initiateLogin}>
                <div className="form-group">
                    <label className="control-label col-sm-2" htmlFor="email">Email:</label>
                    <div className="col-sm-10">
                        <input type="email" className="form-control" ref="email" placeholder="Enter email"/>
                    </div>
                </div>
                <div className="form-group">
                    <label className="control-label col-sm-2" htmlFor="pwd">Password:</label>
                    <div className="col-sm-10">
                        <input type="password" className="form-control" ref="pwd" placeholder="Enter password"/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-10">
                        <button type="submit" className="btn btn-default">Login</button>
                    </div>
                </div>
            </form>
        </div>;
        let tab2=<div id="signup" className="tab-pane fade">
            <br/>
            <form className="form-horizontal" onSubmit={this.initiateSignup}>
                <div className="form-group">
                    <label className="control-label col-sm-2" htmlFor="name">Name</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" ref="name" placeholder="Enter name"/>
                    </div>
                </div>

                <div className="form-group">
                    <label className="control-label col-sm-2" htmlFor="email2">Email:</label>
                    <div className="col-sm-10">
                        <input type="email" className="form-control" ref="email2"
                               placeholder="Enter email"/>
                    </div>
                </div>
                <div className="form-group">
                    <label className="control-label col-sm-2" htmlFor="pwd2">Password:</label>
                    <div className="col-sm-10">
                        <input type="password" className="form-control" ref="pwd2"
                               placeholder="Enter password"/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-2 col-sm-10">
                        <button type="submit" className="btn btn-default">Signup</button>
                    </div>
                </div>
            </form>
        </div>
        let tabs=<div className="tab-content">
            {tab1}
            {tab2}
        </div>;
        let loading=<div className="text-center">
            <img className="imgGif" src="/loader.gif" height="100px" width="auto"/>
            <h2>Loading Please Wait...</h2>
        </div>;
        let children=null;

        if(this.state.loading)
            children=loading;
        else
            children=tabs;

        return (<div>

                <div className="container">
                    <div className="page-header">
                        <h1>Login or Signup to start using Agile Development Platform</h1>
                    </div>
                    <ul className="nav nav-tabs">
                        <li className="active"><a data-toggle="tab" href="#login">Login</a></li>
                        <li><a data-toggle="tab" href="#signup">Sign Up</a></li>

                    </ul>
                    {children}
                </div>
            </div>
        );
    }

});