import { Accounts } from 'meteor/accounts-base';

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL',
});

AccountsTemplates.addField({
  _id: "First Name",
  type: "text",
});

AccountsTemplates.addField({
  _id: "Last Name",
  type: "text",
});