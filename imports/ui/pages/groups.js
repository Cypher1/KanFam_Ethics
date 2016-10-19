import "./groups.html"
import { Groups } from '../../api/groups.js';

Template.group.onCreated(function () {
    Meteor.subscribe('groups');
});

