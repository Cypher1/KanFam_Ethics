import { ReactiveDict } from 'meteor/reactive-dict';
import { Groups } from '../../api/groups.js';

import "./group_page.html"

Template.group_page.onCreated(function () {
    Meteor.subscribe('groups');
});

Template.group_page.helpers({
    get_group: function () {
        return Groups.findOne({_id: FlowRouter.current().params._id});
    }
});

Template.group_page.onRendered(function () {
});

Template.group_page.events({
    'submit .new-group'(event) {
        /* Prevent default browser form submit */
        event.preventDefault();

        /* Get value from form element */
        const target = event.target;
        const group_name = target.group_name.value;

        /* Insert a task into the collection */
        Meteor.call('groups.add_group', group_name);

        /* Clear form */
        target.group_name.value = '';
    },
});
