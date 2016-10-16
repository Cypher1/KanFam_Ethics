import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Groups } from '../../api/groups.js';

import './member.html';
import '../../api/groups.js';

Template.member.onCreated(function () {
    Meteor.subscribe('groups');
});

Template.member.helpers({

});

Template.member.events({
	'submit .remove-member'(event) {
        event.preventDefault();
        var groupId = Template.parentData(1)._id;
        var memberId = event.target.removeId.value;

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
                Meteor.call('groups.add_member',groupId, memberId, true);
            }
        });
    },
})