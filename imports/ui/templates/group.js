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
});
