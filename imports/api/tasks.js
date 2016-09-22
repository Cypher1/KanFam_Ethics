import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
    /* This code only runs on the server */
    Meteor.publish('tasks', function tasksPublication() {
        let publicTasks = {private: {$ne: true}};
        if(!this.userId) {
            return Tasks.find(publicTasks);
        }
        let myTasks = {owner: this.userId};
        return Tasks.find({$or: [myTasks, publicTasks]});
    });
}
/* can do methods for new collection in here */
Meteor.methods({
    'tasks.insert'(text, task_list_id) {
        check(text, String);
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
        /* insert into TaskInfo collection with task id and user id */
        Tasks.insert({
            text,
            createdAt: new Date(),
            owner: this.userId,
            username: identifier,
            taskNotes: "",
            parent: task_list_id,
            progress: 1,
        });
    },
    'tasks.remove'(taskId) {
        check(taskId, String);
        const task = Tasks.findOne(taskId);

        if (task.private && task.owner !== this.userId) {
            /* If the task is private, make sure only the owner can delete it */
            throw new Meteor.Error('not-authorized');
        }
        Tasks.remove(taskId);
    },
    'tasks.addNote'(taskId,notes) {

        check(taskId,String);

        const task= Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            /* If the task is private, make sure only the owner can add notes it */
            throw new Meteor.Error('not-authorized');
        }
        Tasks.update(taskId,{$set: { taskNotes: notes} });
    },
    'tasks.editTask'(taskId,edit) {
        check(taskId,String);
        const task= Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            /* If the task is private, make sure only the owner can add notes it */
            throw new Meteor.Error('not-authorized');
        }
        console.log(taskId);
        Tasks.update(taskId,{$set: { text: edit} });
    },
    'tasks.deleteWithList'(listId) { /* Removes all the tasks in a list */
        check(listId,String);
        Tasks.remove({parent: listId});
    },
    'tasks.setDueDate'(taskId,dueDate) {
        /* still working on this */
        check(taskId,String);

        if (task.private && task.owner !== this.userId) {
            /* If the task is private, make sure only the owner can delete it */
            throw new Meteor.Error('not-authorized');
        }
        Tasks.update(taskId,{$set: {dueDate: dueDate}});
    },
    'tasks.setProgress'(taskId,progress) {
        check(taskId,String);
        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        Tasks.update(taskId,{$set:{progress: progress}});
    },
});
