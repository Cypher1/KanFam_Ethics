import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../../api/tasks.js';
import { TaskList } from '../../api/task_list.js';

import './task.js';
import '../../api/tasks.js'
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

Template.registerHelper('user', function() {
    return Meteor.user().username || Meteor.user().profile.name;
});

Template.task_list.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('tasks');
});

Template.task_list.onRendered(function() {
  this.$('.modal-trigger').leanModal({
      dismissible: false, // Modal can be dismissed by clicking outside of the modal
      opacity: 0.5, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 200, // Transition out duration
      starting_top: '4%', // Starting top style attribute
      ending_top: '10%', // Ending top style attribute
  });
});



Template.task_list.helpers({

    tasks () {

        const instance = Template.instance();//stores current instance of template
        let filter = {};

        if (instance.state.get('hideCompleted')) {
           
            // If hide completed is checked, filter tasks
            filter.done =  {$ne: true};
            return Tasks.find({parent: this._id, done: {$ne : true}},{sort:{createdAt:-1}});
        }
        // sort by date newest first
        return Tasks.find({parent: this._id},{sort:{createdAt:-1}})
       
    },
    incompleteTasksCount() {
        return Tasks.find({ done: { $ne: true } }).count();
    },
    tasksCount() {
        return Tasks.find({}).count();
    }, 
});


Template.task_list.events({
    'submit .new-task'(event) { 
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Meteor.call('tasks.insert', text, this._id);

    // Clear form
    target.text.value = '';
  },
   
 'change .hide-completed input'(event, instance) {
        console.log("in hide completed");
      instance.state.set('hideCompleted', event.target.checked);


  },'submit .edit-task'(event){
       // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      const target = event.target;
      const edit = target.text.value;
       target.text.value = edit;

      // Insert a task into the collection
      Meteor.call('tasks.editTask', this._id, edit);

    },
 
});










