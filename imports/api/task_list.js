import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const TaskList = new Mongo.Collection('task_list');

if (Meteor.isServer) {
    /* This code only runs on the server */
    Meteor.publish('task_list', function taskListsPublication() {

        let publicTaskLists = {private: {$ne: true}};
        if(!this.userId) {
            return TaskList.find(publicTaskLists);
        }
        let myTaskLists = {owner: this.userId};
        return TaskList.find({$or: [myTaskLists, publicTaskLists]});
    });
}

Meteor.methods({
    'authListHelper'(listId,owner){
        //does authorization checks for all task related stuff
        const list = TaskList.findOne(listId);
        var owns = this.userId;   
        if(owner != ""){
            owns = owner;
        }
        if (list.owner !== owns) {
            throw new Meteor.Error('not-authorized');
        }
    },
    'task_list.insert'(groupId,listName) {

        check(listName,String);       
        var owns = this.userId;  
        if(groupId != undefined){
            owns = groupId;
        }
        if(!owns){
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
    },
    'task_list.showArchives'(listId, showing,owner){
        check(listId,String);
        check(showing,Boolean);
        Meteor.call('authListHelper',listId,owner);
        TaskList.update(listId,{$set: {showArchives: showing}});
    },

});

