import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Feedback = new Mongo.Collection('feedback');

if (Meteor.isServer) {
    // This code only runs on the server
  Meteor.publish('feedback', function feedbackPublication() {
    return Feedback.find();
  });
}

Meteor.methods({
    'feedback.insert'(title, text) {
        check(title, String);
        check(text, String);
        Feedback.insert({
            title:title,
            text:text,
            createdAt: new Date(),
            from: this.userId,
        });
    },
});
