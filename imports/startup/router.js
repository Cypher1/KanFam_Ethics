import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';


function checkLoggedIn (ctx) {
    // Redirect unloggedin users
    if (!Meteor.userId()) {
        FlowRouter.go('/')
    }
}

Accounts.onLogin(function () {
    // Send the user to their dashboard
    let signup = FlowRouter.current().route.name === "signup";
    let login = FlowRouter.current().route.name === "login";
    if(login || signup) {
        FlowRouter.go('dashboard')
    }
})

Accounts.onLogout(function () {
    // Send the user home
    FlowRouter.go('home')
})

// PUBLIC ROUTES

FlowRouter.route('/', {
    name: 'home',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "landing"});
    }
});

FlowRouter.route('/login', {
    name: 'login',
    action: function() {
        if(!Meteor.userId()) {
            BlazeLayout.render("mainLayout", {content: "login"});
        } else {
            FlowRouter.go('/');
        }
    }
});

FlowRouter.route('/signup', {
    name: 'signup',
    action: function() {
        if(!Meteor.userId()) {
            BlazeLayout.render("mainLayout", {content: "signup"});
        } else {
            FlowRouter.go('/');
        }
    }
});

FlowRouter.route('/feedback', {
    name: 'feedback',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "feedback"});
    }
});

FlowRouter.route('/terms-of-use', {
    name: 'terms',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "terms"});
    }
});

FlowRouter.route('/privacy', {
    name: 'privacy',
    action: function() {
        BlazeLayout.render("mainLayout", {content: "privacy"});
    }
});

// PRIVATE ROUTES
var privateRoutes = FlowRouter.group({
    name: 'private',
    triggersEnter: [checkLoggedIn]
})

privateRoutes.route('/dashboard', {
    name: 'dashboard',
    action: function () {
        BlazeLayout.render('mainLayout', {content: 'dashboard'})
    }
})

privateRoutes.route('/groups', {
    name: 'groups',
    action: function () {
        BlazeLayout.render('mainLayout', {content: 'groups'})
    }
})

privateRoutes.route('/groups/:_id', {
    name: 'group_page',
    action: function(params) {
        BlazeLayout.render("mainLayout", {content: 'group_page'});
    }
});

privateRoutes.route('/logout', {
    name: 'logout',
    action: function() {
        Meteor.logout();
    }
});

privateRoutes.route('/calendar', {
    name: 'myCalendar',
    action: function () {
        BlazeLayout.render('mainLayout', {content: 'myCalendar'})
    }
})
