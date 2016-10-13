import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Groups } from '../../api/groups.js';

import './group.html';

Template.group.onCreated(function () {
    Meteor.subscribe('groups');
});

Template.group.helpers({

    isOwner() {
        return this.owner === Meteor.userId();
    }
});

Template.group.events({
    'click .remove-group'(event){

        event.preventDefault();

        var id = this._id;
        var lName = this.name;

        //creates confimation alert
        swal({
            html:true,
            title: "<h5>Delete Confirmation<h5>",
            text: "Are you sure you want to delete the group: " +lName + "?",
            confirmButtonColor: '#0097a7',
            confirmButtonText: 'Yes',
            showCancelButton: true,
            cancelButtonText: "No",
            closeOnConfirm: true,
            closeOnCancel: true,
        },
        function(isConfirm){ //if user clicked yes
            if(isConfirm){
                //Delete Group
                Meteor.call('groups.remove',id);
                FlowRouter.go("/groups");
            }
        });
    },
    'submit .edit-group-name'(event){
        // Prevent default browser form submit
        event.preventDefault();
        // Get value from form element
        const edit = event.target.text.value;
        // Insert a task into the collection
        Meteor.call('groups.edit-name', this._id, edit);
    },
});
