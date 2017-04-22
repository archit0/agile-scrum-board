import React from 'react';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
import {IndexApp} from '../app/IndexApp';
import {LoginSignup} from '../app/login/LoginSignup';
import {NotAllowed} from '../app/NotAllowed';

import {Home} from '../app/mainApp/Home';
import {CreateProject} from '../app/mainApp/CreateProject';
import {EditProject} from '../app/mainApp/EditProject';
import {CreateTask} from '../app/mainApp/CreateTask';
import {EditTask} from '../app/mainApp/EditTask';
import {AllProjects} from '../app/mainApp/project/AllProjects';
import {ProjectHome} from '../app/mainApp/project/ProjectHome';
import {OpenedProject} from '../app/mainApp/project/OpenedProject';
import {AllTasks} from '../app/mainApp/project/AllTasks';
import {Scrum} from '../app/mainApp/project/Scrum';

import {SingleTask} from '../app/mainApp/project/SingleTask';


export const renderRoutes = () => (
    <Router history={browserHistory}>

        <Route path="/" component={IndexApp}>
            <Route path="/login" component={LoginSignup}/>
            <Route path="/notAllowed" component={NotAllowed}/>

            <IndexRoute component={Home}/>
            <Route path="/home" component={Home}>

                <Route path="/project/create" component={CreateProject}/>
                <Route path="/project/:projectId/edit" component={EditProject}/>

                <Route path="/task/:projectId/create" component={CreateTask}/>
                <Route path="/task/:projectId/:taskId/edit" component={EditTask}/>

                <Route path="/project" component={ProjectHome}>
                    <IndexRoute component={AllProjects}/>
                    <Route path="/project/:projectId" component={OpenedProject}>
                        <Route path="/project/:projectId/tasks" component={AllTasks}/>
                        <Route path="/project/:projectId/scrum" component={Scrum}/>
                        <Route path="/project/:projectId/task/:taskId" component={SingleTask}/>
                    </Route>
                </Route>

            </Route>
        </Route>
    </Router>
);
/*

 */