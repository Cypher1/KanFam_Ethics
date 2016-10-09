import { ReactiveDict } from 'meteor/reactive-dict';
import { Groups } from '../../api/groups.js';

import "./group_page.html"

Template.group_page.onCreated(function () {
    Meteor.subscribe('groups');
});

Template.group_page.helpers({
    
});

Template.group_page.onRendered(function () {
});

Template.group_page.events({
});
