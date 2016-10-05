import { Meteor } from 'meteor/meteor';
import '../imports/startup/email-config.js';

// Import API js
import '../imports/api/tasks.js';
import '../imports/api/task_list.js'

Meteor.startup(() => {
  // code to run on server at startup
});
