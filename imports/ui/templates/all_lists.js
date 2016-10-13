import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { TaskList } from '../../api/task_list.js';

import './all_lists.html';
import './task_list.js';
import '../../api/task_list.js';
import './task.js';
import '../../api/tasks.js'
import './task_list.html';

//all_lists.js is used to to generate new lists (parent to task_list)

Template.all_lists.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('task_list');
});

Template.all_lists.helpers({

    lists () {
        const instance = Template.instance();//stores current instance of template
        let filter = {};
        return TaskList.find();

    }, 
    isOwner(){
      return this.owner === Meteor.userId();
    }
});

Template.all_lists.events({

  'submit .new-list'(event) {

      event.preventDefault();
      const listName = event.target.text.value;
      Meteor.call('task_list.insert',listName);
      event.target.text.value = '';

 },
 'submit .setListName'(event){

        event.preventDefault();
        const listName = event.target.text.value;
        Meteor.call('task_list.setListName',this._id,listName);

  },
  'click .delete-list'(event){

          event.preventDefault();

           var id = this._id;
           var lName = this.listName;
      //creates confimation alert
      swal({
        html:true,
        title: "<h5>Delete Confirmation<h5>",
        text: "Are you sure you want to delete the list " +lName + "?",
        confirmButtonColor: '#0097a7',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonText: "No",
        closeOnConfirm: true,
        closeOnCancel: true,
     },
     function(isConfirm){ //if user clicked yes
        if(isConfirm){
          //Delete list
          Meteor.call('task_list.remove', id);
          //Delete tasks in that list
          Meteor.call('tasks.deleteWithList',id);
        }
     });

  },
});







