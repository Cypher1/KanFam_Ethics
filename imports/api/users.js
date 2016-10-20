import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { check } from 'meteor/check';
import './helpers.js';

if(Meteor.isServer) {
  Meteor.publish( 'users', function() {
    return Meteor.users.find( this.userId, {
      fields: {
        username: 1,
        emails: 1,
        profile: 1,
        services: {
          google: {name: 1},
          facebook: {name: 1},
        }
      }
    });
  });
}

getusername = function(user_info) {
  let username;
  if(user_info) {
    if(user_info.username) username = user_info.username;
    if(user_info.profile) {
      if(user_info.profile.name) username = user_info.profile.name;
    }
  }
  return username;
}

Meteor.methods({
  'user.name': function (user_id) {
    if(!user_id) {
      user_id = this.userId;
    }
    check(user_id, String);
    if (!this.userId) {
      throw new Meteor.Error('not logged in');
    }
    let user_info = Meteor.users.findOne({_id:user_id});
    let username = getusername(user_info);
    return username;
  },
  'user.id_by_name': function (user_name) {
    check(user_name, String);
    if (!this.userId) {
      throw new Meteor.Error('not logged in');
    }
    let by_username = {'username':user_name};
    let by_profilename = {'profile':{'name':user_name}};
    let by_facebook = {'services':{'facebook':{'name':user_name}}};
    let by_google = {'services':{'google':{'name':user_name}}};
    let user_info = Meteor.users.findOne({$or: [
      by_username, by_profilename, by_facebook, by_google,
    ]});
    if(!user_info) return "User not found";
    return user_info._id;
  }
});
