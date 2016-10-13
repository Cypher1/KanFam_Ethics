import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Groups = new Mongo.Collection('groups');

if (Meteor.isServer) {
    /* This code only runs on the server */
    Meteor.publish('groups', function groupsPublication() {
        let publicGroups = {private: {$ne: true}};
        if(!this.userId) {
            return Groups.find(publicGroups);
        }
        let myGroups = {members: this.userId};
        return Groups.find({$or: [myGroups, publicGroups]});
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
        console.log("new group " + Groups.findOne({_id: JoA3DvXvKkfq5msDt}));
    },
    'groups.remove_group'(groupId) {
        check(groupId, String);

        /* Check that user is admin in group */
        const group = Groups.findOne({name: groupId, admin: this.userId});

        if (!this.userId || !group) {
            throw new Meteor.Error('not-authorized');
        }
        Groups.remove(groupId);
    },
    'groups.add_admin'(groupId, userId, remove) {
        check(groupId,String);
        check(userId,String);
        check(remove,Boolean);
        console.log(groupId);
        console.log(this.userId);
        /* Check that user is admin in group */
        const group = Groups.findOne({name: groupId, admin: this.userId});
        if (!this.userId || group === undefined) {
            throw new Meteor.Error('not-authorized');
        }
        if (remove && this.userId === userId) {
            throw new Meteor.Error('not-authorized to remove admin');
        }
        console.log("in add_admin");
        console.log(groupId);
        console.log(userId);
        if (remove) {
            Groups.update(groupId, {$pull: {admin: userId}});
        } else {
            Groups.update(groupId, {$addToSet: {admin: userId}});
        }
    },
    'groups.add_member'(groupId, userId, remove) {
        check(groupId,String);
        check(userId,String);
        check(remove,Boolean);
        /* Check that user is admin in group */
        const group = Groups.findOne({name: groupId, admin: this.userId});
        console.log(group);
        if (!this.userId || group === undefined) {
            throw new Meteor.Error('not-authorized');
        }
        console.log("in add_member");
        console.log(groupId);
        console.log(userId);
        if (remove) {
            Groups.update(groupId, {$pull: {members: userId}});
        } else {
            Groups.update(groupId, {$addToSet: {members: userId}});
        }
    },
    'groups.edit_group'(groupId, name, description) {
        check(groupId,String);
        check(name,String);
        check(description,String);

        const group = Groups.findOne(groupId);
        if (task.private && task.owner !== this.userId) {
            /* If the task is private, make sure only the owner can add notes it */
            throw new Meteor.Error('not-authorized');
        }
        console.log("in edit_group");
        Groups.update(groupId,{$set: {name: name, description: description}});
        console.log(edit);

    },
    'groups.remove'(groupId) {
        check(groupId, String);
        const group =  Groups.findOne(groupId);
        if (group.owner !== this.userId) {
            /* If the task is private, make sure only the owner can delete it */
            throw new Meteor.Error('not-authorized');
        }
        Groups.remove(groupId);
    },
    'groups.edit-name'(groupId,newName){

        check(groupId,String);
        const group = Groups.findOne(groupId);
        if (group.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        Groups.update(groupId,{$set: { name: newName} });
    }
});
