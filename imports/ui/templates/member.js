import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Groups } from '../../api/groups.js';

import './member.html';
import '../../api/groups.js';

Template.dropdown.onRendered(function(){

    this.$('.dropdown-member').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
    });
});


Template.member.onCreated(function () {
  Meteor.subscribe('groups');
});

Template.dropdown.helpers({

    isMemberAdmin(){
        //checks if current member we're on is an admin
        var groupId = Template.parentData(1)._id;
        return Groups.findOne({_id: groupId, admin: this.valueOf()});
    }
});

Template.member.helpers({

  members() {
    return Groups.find().fetch();
  },
  isLoggedAdmin() {
    //checks if the user that is currently logged in is an admin
    var groupId = Template.parentData(1)._id;
    return Groups.findOne({_id: groupId, admin: Meteor.userId()});
  },
  isMemberAdmin() {
    //checks if current member we're on is an admin
    var groupId = Template.parentData(1)._id;
    return Groups.findOne({_id: groupId, admin: this.valueOf()});
  },
  isMe() {
    return this.valueOf() == Meteor.userId();
  }
});

Template.member.events({

    'click .remove-member'(event) {
        event.preventDefault();
        var groupId = Template.parentData(1)._id;
        var memberId = document.getElementById(this).id;
        var memberName = document.getElementById(this).value;
       
        var isAdmin = Groups.findOne({_id: groupId, admin: memberId});
        var admin_size = Groups.findOne(groupId).admin.length;

        //if the user being removed is the only admin left
        if(isAdmin && admin_size == 1){
            sweetAlert("Cannot Remove Member", "There must always be at least one group administrator. Please make another member an administrator before removing this member.", "error");
        }else{
            //creates confimation alert
            swal({
                html:true,
                title: "<h5>Delete Confirmation<h5>",
                text: "Are you sure you want to remove the following member(s): " + memberName + "?",
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
                    Meteor.call('groups.add_remove_member',groupId, memberId, true);
                }
            });
        }
    },
    'click .toggle-admin'(event) {

        event.preventDefault();
        var groupId = Template.parentData(1)._id;
        var adminId = document.getElementById(this).id;
        var isAdmin = Groups.findOne({_id: groupId, admin: adminId});
        var admin_size = Groups.findOne(groupId).admin.length;
       
        remove = false;
        if(isAdmin) {
          remove = true;
        }
        //makes sure that there is always at least one admin
        if((remove && admin_size > 1) || !remove){
             Meteor.call('groups.add_remove_admin',groupId, adminId, remove);
        }else{
            sweetAlert("Cannot Remove Admin", "There must always be at least one group administrator. Please make another member an admin before removing admin privileges on this member.", "error");
        }
  },
});
