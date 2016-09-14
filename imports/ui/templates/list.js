import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../../api/tasks.js';

import './task.js';
import '../../api/tasks.js'
import './list.html';



Template.list.rendered = function() {
this.$('.dropdown-button').dropdown({
    inDuration: 300,
    outDuration: 225,
    constrain_width: false, // Does not change width of dropdown to that of the activator
    hover: true, // Activate on hover
    gutter: 0, // Spacing from edge
    belowOrigin: false // Displays dropdown below the button
});
 };



Template.registerHelper('user', function() {
    return Meteor.user().username || Meteor.user().profile.name;
});

Template.list.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('tasks');
});


Template.list.helpers({

    tasks () {

        const instance = Template.instance();//stores current instance of template
        let filter = {};

        if (instance.state.get('hideCompleted')) {
           
            // If hide completed is checked, filter tasks
            filter.done = { $ne: true };
            console.log('hiding completed');
        }
        // sort by date newest first
        return Tasks.find(filter, {sort: {createdAt: -1}});
    },
    incompleteTasksCount() {
        return Tasks.find({ done: { $ne: true } }).count();
    },
    tasksCount() {
        return Tasks.find({}).count();
    },
});


Template.list.events({
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
  'submit .new-list'(event){
    event.preventDefault();
  },
});














