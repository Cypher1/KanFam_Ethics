import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

user_name = function(user_id) {
  Meteor.call('user.name', user_id, function (error, result) {
    Session.set(user_id+".username", result);
  });
  return Session.get(user_id+".username");
}

id_by_name = function(user_name, callback) {
  if(!callback) {
    callback = function (error, result) {
      Session.set(user_name+".id", result);
    };
  }
  Meteor.call('user.id_by_name', user_name, callback);
  return Session.get(user_name+".id");
}

if(Meteor.isClient) {
  Template.registerHelper('user_name', user_name);
  Template.registerHelper('id_by_name', id_by_name);
}
