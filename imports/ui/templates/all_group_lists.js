import { ReactiveDict } from 'meteor/reactive-dict';
import { Groups } from '../../api/groups.js';

import "./all_group_lists.html"

Template.all_group_lists.onCreated(function () {
    Meteor.subscribe('groups');
});

Template.all_group_lists.helpers({
	list(){
		return Groups.find({_id: FlowRouter.current().params._id}, {lists: 1})
	}
});

Template.all_group_lists.events({

});