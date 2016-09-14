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
        var findCollection = Tasks.find({_id: this._id},{taskNotes: 1});
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
    },'submit .new-note'(event) { 
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      const target = event.target;
      const note = target.text.value;
      //console.log(note);
       target.text.value = note;

      // Insert a task into the collection
      Meteor.call('tasks.addNote', this._id, note);
    },
});





