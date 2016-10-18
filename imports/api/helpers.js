import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

user_identifier = function() {
    console.log("HERE");
    let user_info = Meteor.user();
    if(user_info.username) return username;
    if(user_info.profile) {
        if(user_info.profile.name) return user_info.profile.name;
    }
    throw new Meteor.Error('No username found');
}

if(Meteor.isClient) {
  Template.registerHelper('user_identifier', user_identifier);
}
