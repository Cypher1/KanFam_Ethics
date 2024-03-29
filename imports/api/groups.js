import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Tasks } from './tasks.js';
import { TaskList } from './task_list.js';

export const Groups = new Mongo.Collection('groups');

if (Meteor.isServer) {
    /* This code only runs on the server */
    Meteor.publish('groups', function groupsPublication() {
        return Groups.find({members: this.userId});
    });
}

/* can do methods for new collection in here */
Meteor.methods({
    'groups.add_group'(groupname, description) {
        check(groupname, String);
        check(description, String);
        /* Make sure the user is logged in before inserting a group */
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        let user = Meteor.users.findOne(this.userId);
        /* insert into collection with a name & description */
        Groups.insert({
            name: groupname,
            description: description,
            createdAt: new Date(),
            owner: this.userId,
            admin: [this.userId],
            members: [this.userId],
            lists: [],
        });
    },
    'groups.remove'(groupId) {
        check(groupId, String);
        /* Check that user is admin in group */
        const group = Groups.findOne({_id: groupId, admin: this.userId});
        if (!this.userId || !group) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.remove({owner: groupId});
        TaskList.remove({owner: groupId});
        Groups.remove(groupId);
        FlowRouter.go('/groups');
    },
    'groups.add_remove_admin'(groupId, adminId, remove) {
        check(groupId,String);
        check(adminId,String);
        check(remove,Boolean);
        var admin_size = Groups.findOne(groupId).admin.length;

        /* Check that user is admin in group */
        const group = Groups.findOne({_id: groupId, admin: this.userId});
        //if not logged in or not a current admin
        if (!this.userId || !group) {
            throw new Meteor.Error('not-authorized');
        }
        if (remove) {

            //to remove an admin there must be more than 1 admin in the group
            if(admin_size == 1){
                throw new Meteor.Error('cannot remove last admin');
            }
            Groups.update(groupId, {$pull: {admin: adminId}});

        } else {
            if(Meteor.isServer){
                const user = Meteor.users.findOne({_id: adminId});

                if (!user) {
                    throw new Meteor.Error('user does not exist');
                }
                Groups.update(groupId, {$addToSet: {admin: adminId}});
            }
        }
    },
    'groups.add_remove_member'(groupId, memberId, remove) {
        check(groupId,String);
        check(memberId,String);
        check(remove,Boolean);
        var admin_size = Groups.findOne(groupId).admin.length;
 
        if(!this.userId){
            throw new Meteor.Error('not-authorized');
        }

        //if we want to remove the member
        if (remove) {

            //check that the user is admin in the group
            const group = Groups.findOne({_id: groupId, admin: this.userId});
            const isAdmin = Groups.findOne({_id: groupId, admin: memberId});

            //to remove an admin there must be more than 1 admin
            if(admin_size == 1 && isAdmin){
                throw new Meteor.Error('cannot remove last admin member');
            }

            //if the user is not trying to remove themselves (which they can always do)
            if(this.userId != memberId){
                //only admins can remove members
                if (!group) {
                    throw new Meteor.Error('not-authorized');
                }
            }

            Groups.update(groupId, {$pull: {members: memberId}});
            Groups.update(groupId, {$pull: {admin: memberId}});

            if(this.userId == memberId) {
                FlowRouter.go('/groups');
            }
        } else {
            if(Meteor.isServer) {
                const user = Meteor.users.findOne(memberId);
                if (!user) {
                    throw new Meteor.Error('user does not exist');
                }
                Groups.update(groupId, {$addToSet: {members: memberId}});
            }
        }
    },
    'groups.edit_description'(groupId, newDescription) {
        check(groupId,String);
        check(newDescription,String);

        const group = Groups.findOne({_id: groupId, admin: this.userId});

        if (!this.userId || !group) {
            throw new Meteor.Error('not-authorized');
        }
        Groups.update(groupId, {$set: {description: newDescription}});
    },
    'groups.edit_name'(groupId, newName) {

        check(groupId,String);
        check(newName, String);

        const group = Groups.findOne({_id: groupId, admin: this.userId});

        if (!this.userId || !group) {
            throw new Meteor.Error('not-authorized');
        }
        Groups.update(groupId, {$set: {name: newName}});
    }
});
