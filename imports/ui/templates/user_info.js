import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { TaskList } from '../../api/task_list.js';
import { Tasks } from '../../api/tasks.js';

import './all_lists.js';
import './task_list.js';
import './user_info.html';
import './task.js';

Template.user_info.onCreated(function bodyOnCreated() {
    Meteor.subscribe('task_list');
    Meteor.subscribe('tasks');
});

Template.user_info.helpers({
   timeFix (date) {
    var local = new Date(date);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
  },
  taskDue() {
      var d = new Date();
      var today = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
      return Tasks.find({owner: Meteor.userId(), dueDate: today}).fetch();
    },
     isOwner() {
        return this.owner == Meteor.userId();
    },
      listCount(){
        return TaskList.find({owner: Meteor.userId()}).count();
    },
    currentDate(){
      var d = new Date();
      var dueDate = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
      return dueDate;
    },
});


