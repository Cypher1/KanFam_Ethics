import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

user_identifier = function() {
    let user_info = Meteor.user();
    if(user_info) {
      if(user_info.username) return username;
      if(user_info.profile) {
          if(user_info.profile.name) return user_info.profile.name;
      }
    }
}

if(Meteor.isClient) {
  Template.registerHelper('user_identifier', user_identifier);
}
