import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Tasks } from '../../api/tasks.js';

import './task.html';
import './modal.js';

Template.task.helpers({
    isOwner() {
        return this.owner === Meteor.userId();
    },    
    notes(){
        console.log("inside find notes");
        return Tasks.find({owner: this.userID, _id: this._id}).taskNotes;
    },

});

Template.task.onRendered(function(){
    $('.collapsible').collapsible({
       // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
});


$(document).ready(function(){
    $('.modal-trigger').leanModal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 200, // Transition out duration
      starting_top: '4%', // Starting top style attribute
      ending_top: '10%', // Ending top style attribute
      ready: function() { alert('Ready'); }, // Callback for Modal open
      complete: function() { alert('Closed'); } // Callback for Modal close
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
});





