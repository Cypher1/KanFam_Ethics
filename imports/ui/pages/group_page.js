import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Groups } from '../../api/groups.js';

import "../../api/groups.js";
import "./group_page.html";
import "../templates/all_lists.js";

Template.group_page.onCreated(function () {
    Meteor.subscribe('groups');
});

Template.group_page.helpers({

});

Template.group_page.onRendered(function () {
});

Template.group_page.events({
	'submit .add-members'(event){
		// Prevent default browser from submit
		event.preventDefault();

		// Get values from the form
		var members = event.target.members.value;

		// Add new members into the group's database
		Meteor.call('groups.add_member');

		// Clear the form
		event.target.members.value = '';
	},
	'submit .setIcon'(event){
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
