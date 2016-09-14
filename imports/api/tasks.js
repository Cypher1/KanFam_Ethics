import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('tasks', function tasksPublication() {
        let publicTasks = {private: {$ne: true}};
        if(!this.userId){
            return Tasks.find(publicTasks);
        }
        let myTasks = {owner: this.userId};
        return Tasks.find({$or: [myTasks, publicTasks]});
    });
}
//can do methods for new collection in here
Meteor.methods({
    'tasks.insert'(text) {
        check(text, String);
        console.log("in tasks.insert method");
        // Make sure the user is logged in before inserting a task
        if (!this.userId) {
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
        //insert into TaskInfo collection with task id and user id
        Tasks.insert({
            text,
            createdAt: new Date(),
            owner: this.userId,
            username: identifier,
            taskNotes: "",
           // todo:false,
           // doing: false,
           // checking: false,
          //  done: false,
   
        });
    },
    'tasks.remove'(taskId) {
        check(taskId, String);
        const task = Tasks.findOne(taskId);

        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }
        Tasks.remove(taskId);
    },
    'tasks.addNote'(taskId,notes){

        check(taskId,String);

        const task= Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can add notes it
            throw new Meteor.Error('not-authorized');
        }
        console.log(taskId);
        Tasks.update(taskId,{$set: { taskNotes: notes} });
        console.log(notes);

    },
    'tasks.setChecked'(taskId, setChecked) {
       
       console.log("in setChecked");
        check(taskId, String);
        check(setChecked, Boolean);

        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }
         console.log(taskId);
        Tasks.update(taskId, { $set: { checked: setChecked } });
    },
    'tasks.setPrivate'(taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);

        const task = Tasks.findOne(taskId);
        // Make sure only the task owner can make a task private/public
        if (task.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        console.log(taskId);
        Tasks.update(taskId, { $set: { private: setToPrivate } });
    },
    'tasks.setTodo'(taskId, setTodo){

        console.log("in setTodo");
        check(taskId,String);
        check(setTodo,Boolean);

        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }
        console.log(setTodo);
        Tasks.update(taskId, { $set: { todo: setTodo } });
    },
    'tasks.setDoing'(taskId, setDoing){

        console.log("in setDoing");
        check(taskId,String);
        check(setDoing,Boolean);

        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }
        console.log(setDoing);
        Tasks.update(taskId, { $set: { doing: setDoing } });
    },
    'tasks.setChecking'(taskId, setChecking){

        console.log("in setChecking");
        check(taskId,String);
        check(setChecking,Boolean);

        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }
        console.log(setChecking);
        Tasks.update(taskId, { $set: { checking: setChecking } });
    },
    'tasks.setDone'(taskId, setDone){

        console.log("in setDone");
        check(taskId,String);
        check(setDone,Boolean);

        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }
        console.log(setDone);
        Tasks.update(taskId, { $set: { done: setDone } });
    },
    'tasks.editTask'(taskId,edit){

        check(taskId,String);

        const task= Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // If the task is private, make sure only the owner can add notes it
            throw new Meteor.Error('not-authorized');
        }
        console.log(taskId);
        Tasks.update(taskId,{$set: { text: edit} });
        console.log(edit);

    }
});

















