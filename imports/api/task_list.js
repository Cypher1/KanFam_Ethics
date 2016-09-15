import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const TaskList = new Mongo.Collection('task_list');

if (Meteor.isServer) {
    // This code only runs on the server
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
	
	'task_list.insert'(listName){
		
		check(listName,String);
		
		if(!this.userId){
			throw new Meteor.Error('not-authorized');
		}
		let user = Meteor.users.findOne(this.userId);
		let identifier = user.username;

        if (!identifier){
            if(user.profile) {
            identifier = user.profile.name;
            } else {
                identifier = user.email;
            }
        }
        TaskList.insert({
        	listName: "",
        	createdAt: new Date(),
            owner: this.userId,
            username: identifier,

        });

	},
	'task_list.setListName'(listId,listName){

        check(listId,String);
        const list = TaskList.findOne(listId);

        if (list.owner !== this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }
        TaskList.update(listId,{$set: { listName: listName} });
    },  
    'task_list.remove'(listId) {
       
        check(listId, String);
        const list = TaskList.findOne(listId);

        if (list.owner !== this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }
        TaskList.remove(listId);
    },

});








