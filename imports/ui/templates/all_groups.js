import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Groups } from '../../api/groups.js';

import './all_groups.html';
import './group.js';

Template.all_groups.onCreated(function bodyOnCreated() {
  Meteor.subscribe('groups');
});

Template.all_groups.helpers({
  get_group: function () {
    return Groups.findOne({_id: FlowRouter.current().params._id});
  },
  groups: function () {
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
  'click .remove-group'(event) {
    event.preventDefault();
    var group_id = this._id;
    var group_name = this.name;

    //creates confimation alert
    swal({
      html:true,
      title: "<h5>Delete Confirmation<h5>",
      text: "Are you sure you want to delete the group: " +group_name+ "?",
      confirmButtonColor: '#0097a7',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonText: "No",
      closeOnConfirm: true,
      closeOnCancel: true,
    },
    function(isConfirm) { //if user clicked yes
      if(isConfirm) {
        //Delete Group
        Meteor.call('groups.remove',group_id);
      }
    });
  },
});