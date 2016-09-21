import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const TaskList = new Mongo.Collection('task_list');

if (Meteor.isServer) {
    /* This code only runs on the server */
    Meteor.publish('task_list', function groupsPublication() {
        let publicGroups = {private: {$ne: true}};
        if(!this.userId) {
            return Groups.find(publicGroups);
        }
        let myGroups = {owner: this.userId};
        return Groups.find({$or: [myGroups, publicGroups]});
    });
}
