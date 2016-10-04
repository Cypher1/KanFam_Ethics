import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tasks } from '../../api/tasks.js';

import './task.html';


Template.task.helpers({
    isOwner() {
        return this.owner === Meteor.userId();
    },
    todo(){
      if(this.progress >= 1){
        return true;
      }
    }, 
    doing(){
      if(this.progress >= 2){
        return true;
      }
    },
    checking(){
      if(this.progress >= 3){
        return true;
      }
    },
    done(){
      if(this.progress >=4){
        return true;
      }
    },
    todoLabel(){
      if(this.progress == 1){
        return true;
      }
    }, 
    doingLabel(){
      if(this.progress == 2){
        return true;
      }
    },
    checkingLabel(){
      if(this.progress == 3){
        return true;
      }
    },
    doneLabel(){
      if(this.progress == 4){
        return true;
      }
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

    'click .delete'() {
        Meteor.call('tasks.remove', this._id);
    },
    'submit .new-note'(event) { 
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      const note = event.target.text.value;

      // Insert a task into the collection
      Meteor.call('tasks.addNote', this._id, note);
    },
    'click .toggle-doing'(){

      if(this.progress == 1){
        this.progress++;
      }else if(this.progress == 2){
        this.progress--;
      }
       Meteor.call('tasks.setProgress',this._id, this.progress);
    },
    'click .toggle-checking'(){

      if(this.progress == 2){
        this.progress++;
      }else if(this.progress == 3){
        this.progress--;
      }
       Meteor.call('tasks.setProgress',this._id, this.progress);
      
    },
    'click .toggle-done'(){

      if(this.progress == 3){
        this.progress++;
      }else if(this.progress == 4){
        this.progress--;
      }
        Meteor.call('tasks.setProgress',this._id, this.progress);
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
    'selectOnClose .due-date'(event){

      event.preventDefault();
      const dueDate = document.getElementById("dd");

      Meteor.call('tasks.setDueDate',this._id,dueDate);
    },
   'click .toggle-priority'() {
    Meteor.call('tasks.setPriority', this._id, !this.priority);
  },
});




