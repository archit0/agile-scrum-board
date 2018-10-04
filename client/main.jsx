import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../client/routes.js';


 
Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('main-container'));
});
GETDATA=function(){
  try{
    var object=arguments[0];

    for(var x=1;x<arguments.length;x++){
      object=object[arguments[x]];
    }
    return object;
  }
  catch(e){
    console.log('Error catch')
    return false;
  }

}
