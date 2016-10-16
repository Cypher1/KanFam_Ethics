import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { TaskList } from '../../api/task_list.js';

import './all_lists.html';
import './task_list.js';
import '../../api/task_list.js';

//all_lists.js is used to to generate new lists (parent to task_list)

Template.all_lists.onCreated(function bodyOnCreated() {
  Meteor.subscribe('task_list');
});

Template.all_lists.helpers({
  lists () {
    return TaskList.find();
  },
});

Template.all_lists.events({
  'submit .new-list-dash'(event) {
    event.preventDefault();
    const listName = event.target.text.value;
    var groupId;
    Meteor.call('task_list.insert',groupId,listName);
    event.target.text.value = '';
  },
  'submit .new-list-group'(event) {
    event.preventDefault();
    const listName = event.target.text.value;
    var groupId = this._id;
    Meteor.call('task_list.insert',groupId,listName);
    event.target.text.value = '';
  },
  'click .delete-list'(event) {
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
    function(isConfirm) { //if user clicked yes
      if(isConfirm) {
        var owner = "";
        if(FlowRouter.current().route.name == 'group_page') {
          owner = FlowRouter.getParam('_id');
        }
        //Delete list
        Meteor.call('task_list.remove', id,owner);
        //Delete tasks in that list
        Meteor.call('tasks.deleteWithList',id,owner);
      }
    });

  },
});







