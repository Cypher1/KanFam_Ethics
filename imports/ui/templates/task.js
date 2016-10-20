import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tasks } from '../../api/tasks.js';
import { Groups } from '../../api/groups.js';

import './task.html';
import './assignee.js';


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
    checkAdmin(){
      //checks if the current user is an admin for the group this task belongs to
      var groupId = this.owner;
      return Groups.findOne({_id: groupId, admin: Meteor.userId()});
      
    }
});

Template.task.onRendered(function(){
    $('.dropdown-task').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: true, // Displays dropdown below the button
    }); 
    $('.collapsible').collapsible({
       // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
     $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 16,       // Creates a dropdown of 15 years to control year
      dateMin: [2000,01,01],
      format: 'yyyy-mm-dd',
      formatSubmit: 'yyyy-mm-dd',
      hiddenName: true,
      container: 'body',
      onClose: function(){

      

         // $("#dueDate").submit();
      //  $('#due-date').trigger('customEvent');


      }
    });
/*
    Tracker.autorun( () => {
      Meteor.subscribe("tasks");
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 16,       // Creates a dropdown of 15 years to control year
      dateMin: [2000,01,01],
      format: 'yyyy-mm-dd',
      formatSubmit: 'yyyy-mm-dd',
      hiddenName: true,
      container: 'body',
      onClose: function(){

        console.log("rerednered");

         // $("#dueDate").submit();
       // $("datepicker").trigger("submit");

      }

    });
   // $( '#calendar' ).fullCalendar( 'refetchEvents' );
  });
*/
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
          var owner = "";
         if(FlowRouter.current().route.name == 'group_page'){ 
            owner = FlowRouter.getParam('_id'); 
         }
          Meteor.call('tasks.remove', id,owner);
        }
     });
  },
    'submit .new-assign'(event) { 
    // Prevent default browser form submit
    event.preventDefault();
    const assigneeId = event.target.text.value;
    var owner = "";
    if(FlowRouter.current().route.name == 'group_page'){
	  owner = FlowRouter.getParam('_id'); 
    }
    Meteor.call('tasks.addAssignee', this._id, assigneeId, owner);
    event.target.text.value ="";
  },
  'submit .new-note'(event) { 
    event.preventDefault();
    const note = event.target.text.value;

    var owner = "";
    if(FlowRouter.current().route.name == 'group_page'){ 
            owner = FlowRouter.getParam('_id'); 
     }

    Meteor.call('tasks.addNote', this._id, note,owner);
  },
  'click .toggle-todo'(){

    if(this.progress > 1){
      this.progress = 1;
    }
    var owner = "";
    if(FlowRouter.current().route.name == 'group_page'){ 
            owner = FlowRouter.getParam('_id'); 
    }
    Meteor.call('tasks.setProgress',this._id, this.progress,owner);
  },
  'click .toggle-doing'(){

    if(this.progress > 2 || this.progress == 1){
      this.progress = 2;
   }else{
      this.progress = 1;
   }
    var owner = "";
    if(FlowRouter.current().route.name == 'group_page'){ 
            owner = FlowRouter.getParam('_id'); 
    }

    Meteor.call('tasks.setProgress',this._id, this.progress,owner);
  },
  'click .toggle-checking'(){
    if(this.progress > 3 || this.progress <= 2){
      this.progress = 3;
    }else{
      this.progress = 2;
    }
    var owner = "";
    if(FlowRouter.current().route.name == 'group_page'){ 
            owner = FlowRouter.getParam('_id'); 
    }
    Meteor.call('tasks.setProgress',this._id, this.progress,owner);
  },
  'click .toggle-done'(){

    if(this.progress != 4){
      this.progress = 4;
    }else{
      this.progress = 3;
    }
    var owner = "";
    if(FlowRouter.current().route.name == 'group_page'){ 
        owner = FlowRouter.getParam('_id'); 
    }
    Meteor.call('tasks.setProgress',this._id, this.progress,owner);
  },
  'submit .edit-task'(event){

    event.preventDefault();
    const edit = event.target.text.value;
    var owner = "";
    if(FlowRouter.current().route.name == 'group_page'){ 
            owner = FlowRouter.getParam('_id'); 
    }
    Meteor.call('tasks.editTask', this._id,edit,owner);
  },

  'customEvent #due-date'(event){

    console.log("in due date");
    event.preventDefault();
    const date_input = document.getElementById(this._id);

    //if due date was cleared
    if(date_input.value != ''){
        dueDate = date_input.value;
        dueDate = new Date(dueDate);
    }else{
        dueDate = undefined;
    }
    var owner = "";
    if(FlowRouter.current().route.name == 'group_page'){ 
            owner = FlowRouter.getParam('_id'); 
    }
    
    Meteor.call('tasks.setDueDate',this._id,dueDate,owner);

  },
   'click .toggle-priority'() {
    var owner = "";
    if(FlowRouter.current().route.name == 'group_page'){ 
            owner = FlowRouter.getParam('_id'); 
    }
    Meteor.call('tasks.setPriority', this._id, !this.priority,owner);
  },
  'click .toggle-archive'(){
    var owner = "";
    if(FlowRouter.current().route.name == 'group_page'){ 
            owner = FlowRouter.getParam('_id'); 
    }
    Meteor.call('tasks.setArchive',this._id, !this.archive,owner);
  }
});
