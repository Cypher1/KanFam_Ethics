import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Groups } from '../../api/groups.js';

import './group.html';
import '../../api/groups.js';

Template.group.onCreated(function () {
    Meteor.subscribe('groups');
});

Template.group.helpers({

    isOwner() {
        return this.owner === Meteor.userId();
    },

    members() {
        return this.members;
    }
});

Template.group.events({
    'click .remove-group'(event) {

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
        function(isConfirm) { //if user clicked yes
            if(isConfirm) {
                //Delete Group
                Meteor.call('groups.remove',id);
                FlowRouter.go("/groups");
            }
        });
    },
    'submit .edit-group-name'(event) {
        // Prevent default browser form submit
        event.preventDefault();
        // Get value from form element
        const edit = event.target.text.value;
        // Insert a task into the collection
        Meteor.call('groups.edit-name', this._id, edit);
    },
    'submit .new-member'(event) {
        // Prevent default browser from submit
        event.preventDefault();
        console.log(this.admin);
        // Get values from the form
        var newMemberId = event.target.memberId.value;
        var groupId = this._id;
        console.log("html " + groupId);
        // Add new members into the group's database
        Meteor.call('groups.add_member', groupId, newMemberId, false);

        // Clear the form
        event.target.memberId.value = '';
    },
    'submit .remove-member'(event) {

        event.preventDefault();

        var groupId = this._id;
        var memberId = event.target.removeId.value;

        //creates confimation alert
        swal({
            html:true,
            title: "<h5>Delete Confirmation<h5>",
            text: "Are you sure you want to remove this member: " +memberId + "?",
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
                Meteor.call('groups.add_member',groupId, memberId, true);
            }
        });
    },
    'submit .setIcon'(event) {
        // Prevent default browser from submit
        event.preventDefault();

        // Get the group icon
        var icon = event.target.icon.value;

        // Convert to base64 to store on the database
        // TO DO: find a way to convert

        //Insert icon into database
        //Meteor.call('groups.')

    }
});
