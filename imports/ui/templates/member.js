import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Groups } from '../../api/groups.js';
import { Accounts } from 'meteor/accounts-base';

import './member.html';
import '../../api/groups.js';

Template.member.onCreated(function () {
    Meteor.subscribe('groups');
    console.log("MemberCreated");
});

Template.member.helpers({
    members(){
        return Groups.find().fetch();
    },
});

Template.member.events({

	'submit .remove-member'(event) {
        event.preventDefault();
        var groupId = Template.parentData(1)._id;
        var memberUsername = event.target.memberUsername.value;
            var memberId = event.target.memberUsername.id;
	    console.log(memberId);
	
        //creates confimation alert
        swal({
            html:true,
            title: "<h5>Delete Confirmation<h5>",
            text: "Are you sure you want to remove the following member(s): " + memberUsername + "?",
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
    
})
