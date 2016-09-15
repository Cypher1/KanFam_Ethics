import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Tasks } from '../../api/tasks.js';

import './task.html';


Template.task.helpers({
    isOwner() {
        return this.owner === Meteor.userId();
    },    

});

Template.task.onRendered(function(){
    $('.collapsible').collapsible({
       // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15,// Creates a dropdown of 15 years to control year
    autoclose: true,
  });
      
});


Template.task.events({
    'click .toggle-checked'() {
        // Set the checked property to the opposite of its current value
        Meteor.call('tasks.setChecked', this._id, !this.checked);
    },
    'click .delete'() {
        Meteor.call('tasks.remove', this._id);
    },
    'click .toggle-private'() {
        Meteor.call('tasks.setPrivate', this._id, !this.private);
    },
    'submit .new-note'(event) { 
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      const target = event.target;
      const note = event.target.text.value;

      // Insert a task into the collection
      Meteor.call('tasks.addNote', this._id, note);
    },
    'click .toggle-todo'(){

        if(!this.doing && !this.checking && !this.done){
         Meteor.call('tasks.setTodo',this._id, !this.todo);
       }
    
    },
    'click .toggle-doing'(){

      if(this.todo && !this.checking && !this.done){
        Meteor.call('tasks.setDoing',this._id, !this.doing);
      }
    },
    'click .toggle-checking'(){

      if(this.todo && this.doing && !this.done){
       Meteor.call('tasks.setChecking',this._id, !this.checking);
      }
    },
    'click .toggle-done'(){
      if(this.todo && this.doing && this.checking){
        Meteor.call('tasks.setDone',this._id, !this.done);
      }
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
    'click .incProgress'(event){

      event.preventDefault();
      Meteor.call('tasks.progress',this._id);

    },
    'submit .due-date'(event){

      console.log("submit in due date");
      const dueDate = document.getElementById("dd");
      event.preventDefault();
      Meteor.call('tasks.setDueDate',this._id,dueDate);
    }
});




