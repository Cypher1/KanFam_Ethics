import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const TaskList = new Mongo.Collection('task_list');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('task_list', function TaskListsPublication() {
        let publicTaskLists = {private: {$ne: true}};
        if(!this.userId) {
            return TaskList.find(publicTaskLists);
        }
        let myLists = {owner: this.userId};
        return TaskList.find({$or: [myTasLists, publicTaskLists]});
    });
}
