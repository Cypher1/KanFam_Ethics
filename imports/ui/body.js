import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';

Template.registerHelper('user', function() {
    return Meteor.user().username || Meteor.user().profile.name;
});

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('tasks');
});

Template.body.helpers({
    tasks () {
        const instance = Template.instance();
        let filter = {};
        if (instance.state.get('hideCompleted')) {
            // If hide completed is checked, filter tasks
            filter.checked = { $ne: true };
            console.log('hiding completed');
        }
        // sort by date newest first
        return Tasks.find(filter, {sort: {createdAt: -1}});
    },
    incompleteTasksCount() {
        return Tasks.find({ checked: { $ne: true } }).count();
    },
    tasksCount() {
        return Tasks.find({}).count();
    },
});

Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Meteor.call('tasks.insert', text);

    // Clear form
    target.text.value = '';
  },
  'change .hide-completed input'(event, instance) {
      instance.state.set('hideCompleted', event.target.checked);
  },
});
