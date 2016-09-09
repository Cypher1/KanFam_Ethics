import './navbar.html';

(function($){
    $(function(){
        //Sets up navbar using jQuery
        //Source: http://stackoverflow.com/questions/32439042/materialize-css-side-nav-not-working
        // There should be a more meteoric way of doing this
        $('.button-collapse').sideNav();
    }); // end of document ready
})(jQuery); // end of jQuery name space
