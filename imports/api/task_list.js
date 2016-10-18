import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Groups } from './groups.js';
import { Tasks } from './tasks.js';

export const TaskList = new Mongo.Collection('task_list');

if (Meteor.isServer) {
    /* This code only runs on the server */
    Meteor.publish('task_list', function taskListsPublication() {
        if(!this.userId) {
            throw new Meteor.Error('not logged in');
        }
        let mygroups = Groups.find({'members':this.userId});
        let mygroup_ids = mygroups.fetch().map(function(group) {return group._id;});
        mygroup_ids.push(this.userId);
        return TaskList.find({owner: {$in: mygroup_ids}});
        });
    }

Meteor.methods({
    'authListHelper'(listId,owner) {
        //does authorization checks for all task related stuff
        const list = TaskList.findOne(listId);
        var owns = this.userId;
        if(owner != "") {
            owns = owner;
        }
        if (list.owner !== owns || (!Meteor.userId)) {
            throw new Meteor.Error('not-authorized');
        }
    },
    'task_list.insert'(groupId,listName) {

        check(listName,String);
        var owns = this.userId;
        if(groupId != undefined) {
            owns = groupId;
        }
        if(!owns) {
            throw new Meteor.Error('not-authorized');
        }

        let user = Meteor.users.findOne(this.userId);
        let identifier = user.username;

        if (!identifier) {
            if(user.profile) {
                identifier = user.profile.name;
            } else {
                identifier = user.email;
            }
        }
        TaskList.insert({
            listName: listName,
            createdAt: new Date(),
            owner: owns,
            username: identifier,
            showArchives: false,
        });

    },
    'task_list.setListName'(listId,listName,owner) {

        check(listId,String);
        Meteor.call('authListHelper',listId,owner);
        TaskList.update(listId,{$set: { listName: listName} });
    },
    'task_list.remove'(listId,owner) {
        check(listId, String);
        Meteor.call('authListHelper',listId,owner);
        TaskList.remove(listId);
        Tasks.remove({parent: listId});
    },
    'task_list.showArchives'(listId, showing,owner) {
        check(listId,String);
        check(showing,Boolean);
        Meteor.call('authListHelper',listId,owner);
        TaskList.update(listId,{$set: {showArchives: showing}});
    },

});
