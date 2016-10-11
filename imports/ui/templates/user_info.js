import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { TaskList } from '../../api/task_list.js';
import { Meteor } from 'meteor/meteor';

import './all_lists.js';
import './task_list.js';
import './user_info.html';
import '../../api/task_list.js';

Template.registerHelper('user', function() {
    return Meteor.user().username || Meteor.user().profile.name;
});

Template.user_info.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('task_list');
});

Template.user_info.helpers({
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
      
    }
});


