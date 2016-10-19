import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../../api/tasks.js';
import { TaskList } from '../../api/task_list.js';
import { Groups } from '../../api/groups.js';

import './task.js';
import './task_list.html';

Template.task_list.rendered = function() {
    this.$('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false // Displays dropdown below the button
    });
};

Template.task_list.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('tasks');
    Meteor.subscribe('groups');
});

Template.task_list.helpers({
    tasks () {
        const instance = Template.instance();//stores current instance of template
        let filter = {parent: this._id};
        // sort by date newest first
        let sortOrder = {sort:{createdAt: -1}};

        if (instance.state.get('hideCompleted')) {
            // If hide completed is checked, filter tasks
            filter.progress = {$ne: 4};
        }

        if (instance.state.get('showOnlyPriority')) {
            // If show only priority is checked, filter tasks
            filter.priority = true;
        }
        return Tasks.find(filter, sortOrder);
    },
    incompleteTasksCount() {
        return Tasks.find({ done: { $ne: true } }).count();
    },
    tasksCount() {
        return Tasks.find({parent: this._id}).count();
    },
    isOwner() {
        //if we are on the dashboard
        if(FlowRouter.current().route.name == 'dashboard') {
            return this.owner === Meteor.userId();
            //if we are on a given groups page
        }else if(FlowRouter.current().route.name == 'group_page') {

            let id = FlowRouter.getParam('_id');
            return this.owner === id;
        }
    },
});

Template.task_list.events({
    'submit .new-task'(event) {
        event.preventDefault();
        const target = event.target;
        const text = target.text.value;
        Meteor.call('tasks.insert', text, this._id, this.owner);
        target.text.value = '';
    },
    'submit .setListName'(event) {
        event.preventDefault();
        const listName = event.target.text.value;
        var owner = "";
        if(FlowRouter.current().route.name == 'group_page') {
            owner = FlowRouter.getParam('_id');
        }
        Meteor.call('task_list.setListName',this._id,listName,owner);
    },
    'change .hide-completed input'(event, instance) {
        instance.state.set('hideCompleted', event.target.checked);
    },
    'change .show-only-priority input'(event, instance) {
        instance.state.set('showOnlyPriority', event.target.checked);
    },
    'click .show-archives'(event) {
        var owner = "";
        if(FlowRouter.current().route.name == 'group_page') {
            owner = FlowRouter.getParam('_id');
        }
        Meteor.call('task_list.showArchives',this._id,!this.showArchives,owner);
    },
});