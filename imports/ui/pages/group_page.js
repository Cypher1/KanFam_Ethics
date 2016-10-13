import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
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
    get_group: function () {
        let id = FlowRouter.getParam('_id');
        return Groups.findOne({_id: id});
    }
});

Template.group_page.onRendered(function () {
});

