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
    console.log("in render");
    var self = this;
   // self.subscribe("date", function(){
   //   console.log("in subscribe");
   // this.autorun(function(){

      //  Template.currentData();
       // var data = this.data;
       // var id = data._id;
       // console.log(id);
       // console.log(data._id);
    //  console.log("in autorun");
      $('.datepicker').pickadate({
       // selectMonths: true, // Creates a dropdown to control month
       // selectYears: 15,// Creates a dropdown of 15 years to control year
       // closeOnSelect: true,
       formatSubmit: 'yyyy/mm/dd',
        hiddenName: true,
         container: 'body',
               /*
        onSet: function (ele) {
           if(ele.select){

              this.close();
      
              var $input = $('.datepicker').pickadate();
              // Use the picker object directly.
              var picker = $input.pickadate('picker');
              console.log("here");
              console.log(picker.get());

             // var ids = .getElementById("dd").name;
             // var getField = Tasks.findOne({});

       

               // Meteor.call('tasks.setDueDate',this._id,dueDate);
           }
        }
             */
    //  });

   // });
  

 });

      
});



Template.task.events({

    'click .delete'() {
        Meteor.call('tasks.remove', this._id);
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
       // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      const target = event.target;
      const edit = target.text.value;
       target.text.value = edit;

      // Insert a task into the collection
      Meteor.call('tasks.editTask', this._id, edit);
    },
    'submit .due-date'(event){
     console.log("in due date ui");
         var $input = $('.datepicker').pickadate();
              // Use the picker object directly.
        var picker = $input.pickadate('picker');
        console.log("here");
         console.log(picker.get());

      event.preventDefault();
     // var dueDate = document.getElementById("dd");
      const target = event.target;
    // const dueDate = target.text.value;

    //  var dueDate = document.getElementById(this._id)
 //     console.log(dueDate);
     // Meteor.call('tasks.setDueDate',this._id,dueDate);
    }
});




