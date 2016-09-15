import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Groups = new Mongo.Collection('groups');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('groups', function groupsPublication() {
        let publicGroups = {private: {$ne: true}};
        if(!this.userId){
            return Groups.find(publicGroups);
        }
        let myGroups = {owner: this.userId};
        return Groups.find({$or: [myGroups, publicGroups]});
    });
}
