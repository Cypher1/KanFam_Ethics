import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

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
        Groups.remove(groupId);
        FlowRouter.go('/groups');
    },
    'groups.add_admin'(groupId, userId, remove) {
        check(groupId,String);
        check(userId,String);
        check(remove,Boolean);

        /* Check that user is admin in group */
        const group = Groups.findOne({_id: groupId, admin: this.userId});
        //if not logged in or not a current admin
        if (!this.userId || !group) {
            throw new Meteor.Error('not-authorized');
        }
        //get user that we are making admin
        const user = Meteor.users.findOne(userId);
        //check if that user exists
        if (!user) {
            throw new Meteor.Error('user does not exist');
        }
        //if we
        if (remove) {
            Groups.update(groupId, {$pull: {admin: userId}});
        } else {
            Groups.update(groupId, {$addToSet: {admin: userId}});
        }
    },
    'groups.add_remove_member'(groupId, memberId, remove) {
        check(groupId,String);
        check(memberId,String);
        check(remove,Boolean);

        /* Check that user is admin in group */
        const group = Groups.findOne({_id: groupId, admin: this.userId});
        if (!this.userId || !group) {
            throw new Meteor.Error('not-authorized');
        }

        //if we want to remove the member
        if (remove) {
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
