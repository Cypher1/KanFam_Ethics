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
    FlowRouter.go('dashboard')
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

privateRoutes.route('/logout', {
    name: 'logout',
    action: function() {
        Meteor.logout();
    }
});
