import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { TaskList } from '../../api/task_list.js';

import './all_lists.html';
import './task_list.js';
import '../../api/task_list.js';

//all_lists.js is used to to generate new lists (parent to task_list)

Template.registerHelper('user', function() {
    return Meteor.user().username || Meteor.user().profile.name;
});

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
    tn(){ //just to see collection in console
  
        let user = Meteor.users.findOne(this.userId);
        console.log("in tn");
        var findCollection = TaskList.find().fetch();
        console.log(findCollection);
    },
});

Template.all_lists.events({
   
    'click .new-list'(event) { 
    // Prevent default browser form submit
    event.preventDefault();
    console.log("in submit .new-list");

    Meteor.call('task_list.insert',"");

 },
 'submit .setListName'(event){

        event.preventDefault();
        const listName = event.target.text.value;
        Meteor.call('task_list.setListName',this._id,listName);

  },
  'click .delete-list'(event){

  		event.preventDefault();
  		//Delete list
  		Meteor.call('task_list.remove', this._id);
  		//Delete tasks in that list
  		Meteor.call('tasks.deleteWithList',this._id);
  }

});







