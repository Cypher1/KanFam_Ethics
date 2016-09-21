import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './mainLayout.html';
import './body.html';
import './templates/templates.js';
import './pages/pages.js';
import './style.scss';

Template.registerHelper('user', function() {
    return Meteor.user().username || Meteor.user().profile.name || Meteor.user().email;
});
