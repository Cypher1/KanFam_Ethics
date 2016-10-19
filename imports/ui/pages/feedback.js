import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Feedback } from '../../api/feedback.js';

import "./feedback.html";

Template.feedback.events({
    'submit form'(event) {
        event.preventDefault();
        var target = event.target;
        var title = target.title.value;
        var text = target.text.value;
        Meteor.call('feedback.insert', title, text);
        target.reset();
        Materialize.toast('Thanks for your feedback!', 4000);
    },
});
