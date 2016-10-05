import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tasks } from '../../api/tasks.js';

import './task.html';


Template.task.helpers({

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
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15,// Creates a dropdown of 15 years to control year
        format: 'yyyy-mm-dd',
        formatSubmit: 'yyyy-mm-dd',
        hiddenName: true,
        container: 'body',
    });

Template.task.onRendered(function(){
    $('.dropdown-task').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 3, // Spacing from edge
        belowOrigin: true, // Displays dropdown below the button
    }); 
    $('.collapsible').collapsible({
       // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
    
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15,// Creates a dropdown of 15 years to control year
        format: 'yyyy-mm-dd',
        formatSubmit: 'yyyy-mm-dd',
        hiddenName: true,
        container: 'body',
    });

});

Template.task.events({

  'click .delete'() {

      var id = this._id;
       //creates confimation alert
      swal({
        html:true,
        title: "<h5>Delete Confirmation<h5>",
        text: "Are you sure you want to delete this task?",
        confirmButtonColor: '#0097a7',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonText: "No",
        closeOnConfirm: true,
        closeOnCancel: true,
     },
     function(isConfirm){ //if user clicked yes
        if(isConfirm){
           Meteor.call('tasks.remove', id);
        }
     });

  },
  'submit .new-note'(event) { 
    // Prevent default browser form submit
    event.preventDefault();
    console.log("in new note");
    console.log(this._id);

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
    event.preventDefault();
    const edit = event.target.text.value;
    target.text.value = edit;
    Meteor.call('tasks.editTask', this._id, edit);
  },
  'submit .due-date'(event){

    event.preventDefault();
    const temp = document.getElementById(this._id).value;
    dueDate = new Date(temp);
    Meteor.call('tasks.setDueDate',this._id,dueDate);
  },
   'click .toggle-priority'() {
    Meteor.call('tasks.setPriority', this._id, !this.priority);
  },
  'click .toggle-archive'(){
    Meteor.call('tasks.setArchive',this._id, !this.archive);
  }
});




