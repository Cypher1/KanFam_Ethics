import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Groups } from './groups.js';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
    /* This code only runs on the server */
    Meteor.publish('tasks', function tasksPublication() {
        if(!this.userId) {
            throw new Meteor.Error('not logged in');
        }
        let mygroups = Groups.find({'members':this.userId});
        let mygroup_ids = mygroups.fetch().map(function(group) {return group._id;});
        mygroup_ids.push(this.userId);
        return Tasks.find({owner: {$in: mygroup_ids}});
    });
}
/* can do methods for new collection in here */
Meteor.methods({
    'authHelper'(taskId, owner) {

        //If task belongs to dash - makes sure user is owner and is logged in 
        const task = Tasks.findOne(taskId);
        var owns = this.userId;
        if(owner != "") {
            owns = owner;
        }
        if (task.owner !== owns || (!this.userId)) {
            throw new Meteor.Error('not-authorized');
        }
    },
    'tasks.insert'(text, task_list_id, task_list_owner) {
        check(text, String);
        check(task_list_id, String);
        check(task_list_owner, String);
        /* Make sure the user is logged in before inserting a task */
        if (!this.userId) {
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
        Tasks.insert({
            text: text,
            createdAt: new Date(),
            owner: task_list_owner,
            username: identifier,
            taskNotes: "",
            parent: task_list_id,
            progress: 1,
            priority: false,
            archive: false,
        });
    },
    'tasks.remove'(taskId, owner) {
        check(taskId, String);
        Meteor.call('authHelper', taskId, owner);
        Tasks.remove(taskId);
    },
    'tasks.addNote'(taskId, notes, owner) {
        check(taskId, String);
        check(notes, String);
        Meteor.call('authHelper', taskId, owner);
        Tasks.update(taskId, {$set: { taskNotes: notes} });
    },
    'tasks.editTask'(taskId, edit, owner) {
        check(taskId, String);
        check(edit, String);
        Meteor.call('authHelper', taskId, owner);
        Tasks.update(taskId, {$set: { text: edit} });
    },
    'tasks.setDueDate'(taskId, dueDate, owner) {
        check(taskId, String);
        check(dueDate, Date);
        Meteor.call('authHelper', taskId, owner);
        dueDate = dueDate.toISOString().slice(0,10);
        Tasks.update(taskId, {$set: {dueDate: dueDate}});
    },
    'tasks.setProgress'(taskId, progress, owner) {
        check(taskId, String);
        check(progress, Number);
        Meteor.call('authHelper', taskId, owner);
        Tasks.update(taskId, {$set:{progress: progress}});
    },
    'tasks.setPriority'(taskId, newPriority, owner) {
        check(taskId, String);
        check(newPriority, Boolean);
        Meteor.call('authHelper', taskId, owner);
        Tasks.update(taskId, {$set:{priority:newPriority}});
    },
    'tasks.setArchive'(taskId, newArchive, owner) {
        check(taskId, String);
        check(newArchive, Boolean);
        Meteor.call('authHelper', taskId, owner);
        Tasks.update(taskId, {$set:{archive:newArchive}});
    }
});