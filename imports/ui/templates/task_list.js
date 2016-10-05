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
        //shows all archived tasks
        if (instance.state.get('archiveTask')){
            filter.archive = false;
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
        return this.owner === Meteor.userId();
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
        instance.state.set('hideCompleted', event.target.checked);
    },

    'change .show-only-priority input'(event, instance) {
        instance.state.set('showOnlyPriority', event.target.checked);

    },
    'change .archive-task input'(event,instance){
        instance.state.set('archiveTask', event.target.checked);
        Meteor.call('task_list.showArchives',this._id, !this.showArchives);
    },
    'submit .edit-task'(event){
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
