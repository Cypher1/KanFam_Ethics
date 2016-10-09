import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Groups } from '../../api/groups.js';

import './all_groups.html';
import './group.js';
import '../../api/groups.js';

Template.registerHelper('user', function() {
    return Meteor.user().username || Meteor.user().profile.name;
});

Template.all_groups.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('groups');
});

Template.all_groups.helpers({

    groups () {
        const instance = Template.instance();//stores current instance of template
        let filter = {};
        return Groups.find();
    },
});

Template.all_groups.events({
	'submit .new-group'(event) { 
        /* Prefent default browser from submit */
		event.preventDefault();

        /* Get values from form element */       
		const groupName = event.target.groupName.value;
		const groupDes = event.target.groupDes.value;

        /* Insert a group into the collection */
		Meteor.call('groups.add_group', groupName, groupDes);

        /* Clear form */
		event.target.groupName.value = '';
		event.target.groupDes.value = '';
 	},
    'click .remove-group'(event){

        event.preventDefault();

           var id = this._id;
           var lName = this.name;
      
      //creates confimation alert
      swal({
        html:true,
        title: "<h5>Delete Confirmation<h5>",
        text: "Are you sure you want to delete the group: " +lName + "?",
        confirmButtonColor: '#0097a7',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonText: "No",
        closeOnConfirm: true,
        closeOnCancel: true,
     },
     function(isConfirm){ //if user clicked yes
        if(isConfirm){
            //Delete Group
            Meteor.call('groups.remove',id);
        }
     });
    
  },
});