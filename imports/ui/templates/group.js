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
    }
});

Template.group.events({
    'submit .new-member'(event) {
        // Prevent default browser from submit
        event.preventDefault();

        // Get values from the form
        var newMemberId = event.target.memberId.value;
        var groupId = this._id;
        console.log(groupId);
        // Add new members into the group's database
        Meteor.call('groups.add_member', groupId, newMemberId, false);

        // Clear the form
        event.target.memberId.value = '';
    },
    'submit .remove-member'(event){

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