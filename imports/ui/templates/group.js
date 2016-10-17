import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Groups } from '../../api/groups.js';
import { Tasks } from '../../api/tasks.js';

import './group.html';
import './member.js'

Template.group.onCreated(function () {
    Meteor.subscribe('groups');
    Meteor.subscribe('tasks');
});

Template.group.helpers({
    isOwner() {
        return this.owner === Meteor.userId();
    },
    is_admin() {
        return this.admin.indexOf(Meteor.user()._id) > -1;
    },
    'done_tasks_percentage': function() {
        let tasks = Tasks.find({owner: this._id, archive:{$ne: true}}).fetch();
        let total = 0;
        let done = 0;
        for(i in tasks) {
            console.log(tasks[i]);
            total += 1.0;
            if(tasks[i].progress == 4) {// THERE SHOULD BE A GLOBAL FOR THIS
                done += 1.0;
            }
        }
        return 100*done/total;
    }
});

Template.group.events({
    'click .remove-group'(event) {
        event.preventDefault();
        var group_name = this.name;
        var group_id = this._id;

        //creates confimation alert
        swal({
            html:true,
            title: "<h5>Delete Confirmation<h5>",
            text: "Are you sure you want to delete the group: " +group_name+ "?",
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
                Meteor.call('groups.remove',group_id);
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
        // Get values from the form
        var newMemberId = event.target.memberId.value;
        // Add new members into the group's database
        Meteor.call('groups.add_member', this._id, newMemberId, false);

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

        // TODO: store icon in db as BSON
        //Meteor.call('groups.setIcon')
    }
});
