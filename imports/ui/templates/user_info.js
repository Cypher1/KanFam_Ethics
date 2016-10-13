import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { TaskList } from '../../api/task_list.js';
import { Tasks } from '../../api/tasks.js';
import { Meteor } from 'meteor/meteor';

import './all_lists.js';
import './task_list.js';
import './user_info.html';
import './task.js';
import '../../api/task_list.js';
import '../../api/tasks.js';

Template.registerHelper('user', function() {
    return Meteor.user().username || Meteor.user().profile.name;
});

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
	user_email() {
     return Meteor.user().email;
	},
     isOwner() {
        return this.owner == Meteor.userId();
    },
      listCount(){
      //  console.log(this._id);
        return TaskList.find({owner: Meteor.userId()}).count();

    },
    currentDate(){

      var d = new Date();
      var dueDate = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
      return dueDate;
      
    },
});


