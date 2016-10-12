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
   //  Meteor.subscribe('tasks');
});


Template.user_info.helpers({

  taskDue() {
        date = new Date();
        date = date.toISOString().slice(0,10);
        console.log(date);
        return Tasks.find({owner: Meteor.userId(), dueDate: date}).fetch();
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

      var dueDate = new Date();
      return dueDate.toISOString().slice(0,10);
      
    },
});


