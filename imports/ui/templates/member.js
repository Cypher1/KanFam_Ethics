import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Groups } from '../../api/groups.js';

import './member.html';
import '../../api/groups.js';

function init_dropdown() {

}

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
    members(){
        return Groups.find().fetch();
    },
    isLoggedAdmin(){

        //checks if the user that is currently logged in is an admin
        var groupId = Template.parentData(1)._id;
        return Groups.findOne({_id: groupId, admin: Meteor.userId()});
    },
    isMemberAdmin(){
        //checks if current member we're on is an admin
        var groupId = Template.parentData(1)._id;
        return Groups.findOne({_id: groupId, admin: this.valueOf()});
    },
    isMe(){
        return this.valueOf() == Meteor.userId();
    }

});

Template.member.events({

    'click .remove-member'(event) {
        event.preventDefault();
        var groupId = Template.parentData(1)._id;
        var memberId = document.getElementById(this).value;

        //creates confimation alert
        swal({
            html:true,
            title: "<h5>Delete Confirmation<h5>",
            text: "Are you sure you want to remove the following member(s): " + memberId + "?",
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
    },
    'click .toggle-admin'(event) {

        event.preventDefault();
        var groupId = Template.parentData(1)._id;
        var adminId = document.getElementById(this).value;
        var isAdmin = Groups.findOne({_id: groupId, admin: adminId});
        remove = false;
        if(isAdmin){
            remove = true;
        }
        Meteor.call('groups.add_remove_admin',groupId, adminId, remove);
        
    }, 
});