import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tasks } from '../../api/tasks.js';

import './assignee.html';

Template.assignee.events({
	'submit .delete-assign'(event) { 
    // Prevent default browser form submit
    event.preventDefault();
    const assignId = event.target.text.value;
    const taskId = Template.parentData(1)._id;
    var owner = "";
    if(FlowRouter.current().route.name == 'group_page'){ 
            owner = FlowRouter.getParam('_id'); 
    }
    swal({
        html:true,
        title: "<h5>Delete Confirmation<h5>",
        text: "Are you sure you want to remove the following assignee: " + assignId + "?",
        confirmButtonColor: '#0097a7',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonText: "No",
        closeOnConfirm: true,
        closeOnCancel: true,
    },
    function(isConfirm) { //if user clicked yes
        if(isConfirm) {
            //Delete Group
      		Meteor.call('tasks.deleteAssignee', taskId, assignId, owner);
        }
    });
    }
})