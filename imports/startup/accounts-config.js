import { Accounts } from 'meteor/accounts-base';
import { AccountsTemplates } from 'meteor/useraccounts:core';

function Logout() {
    // Handled by meteor, extra actions go here
}

function PostSignInClientSide() {
    // Handled by meteor, extra actions go here
}

function PreSignUp() {
    console.log("Sign Up Attempt");
}

function PostSignUpServerSide() {
    console.log("Sign Up");
}

AccountsTemplates.addField({
    _id: 'username',
    type: 'text',
    required: true,
    minLength: 6,
    re: /[A-Za-z0-9_]{6,}/,
    errStr: 'Username only accepts letters, numbers and underscores (_)',
});

AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: true,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: true,

    // Client-side Validation
    continuousValidation: true,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/dash',
    redirectTimeout: 4000,

    // Hooks
    onLogoutHook: Logout,
    onSubmitHook: PostSignInClientSide,
    preSignUpHook: PreSignUp,
    postSignUpHook: PostSignUpServerSide,

    // Texts
    texts: {
      button: {
          signUp: "Sign Up"
      },
      socialSignUp: "Sign Up",
      socialIcons: {
          "meteor-developer": "fa fa-rocket"
      },
      title: {
          forgotPwd: "Recover Your Password"
      },
    },
});
