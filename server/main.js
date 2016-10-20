import { Meteor } from 'meteor/meteor';
import '../imports/startup/email-config.js';

// Import API js
import '../imports/api/apis.js';

Meteor.startup(() => {
  // code to run on server at startup
  ServiceConfiguration.configurations.upsert({
    service: "google"
  }, {
    $set: {
      appId: Meteor.settings.google.app_id,
      loginStyle: "popup",
      secret: Meteor.settings.google.secret
    }
  });
  ServiceConfiguration.configurations.upsert({
    service: "facebook"
  }, {
    $set: {
      appId: Meteor.settings.facebook.app_id,
      loginStyle: "popup",
      secret: Meteor.settings.facebook.secret
    }
  });
});
