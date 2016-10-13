import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';
import { TaskList } from '../api/task_list.js';

import './mainLayout.html';
import './body.html';
import './templates/templates.js';
import './pages/pages.js';
import './style.scss';

Template.registerHelper('user', function() {
    return Meteor.user().username || Meteor.user().profile.name || Meteor.user().emails[0].address;
});

Template.registerHelper('user_email', function() {
    console.log(Meteor.user());
    return Meteor.user().emails[0].address;
});
