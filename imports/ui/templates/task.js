import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Tasks } from '../../api/tasks.js';

import './task.html';


Template.task.helpers({
    isOwner() {
        return this.owner === Meteor.userId();
    },    
    notes(){
  
        let user = Meteor.users.findOne(this.userId);
        //
        var findCollection = Tasks.findOne({_id: this._id});
        console.log(findCollection);
       // return Tasks.findOne({owner: this.userID, _id: this._id}).taskNotes;
    },


});

Template.task.onRendered(function(){
    $('.collapsible').collapsible({
       // A setting that changes the collapsible behavior to expandable instead of the default accordion style
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
      //const note = document.getElementById("ta").value;
      console.log("in new-note:");
      console.log(note);
     // document.getElementById("ta").value = "";
     const note = event.target.text.value;

      // Insert a task into the collection
      Meteor.call('tasks.addNote', this._id, note);
    },
    'click .toggle-todo'(){

         Meteor.call('tasks.setTodo',this._id, !this.todo);
    
    },
    'click .toggle-doing'(){

      if(this.todo){
        Meteor.call('tasks.setDoing',this._id, !this.doing);
      }

    },
    'click .toggle-checking'(){

      if(this.todo && this.doing){
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
    }


});