import './navbar.html';

Template.navbar.onRendered(function(){
  $(".button-collapse").sideNav({
    closeOnClick: true,
    edge: 'right'
  }); // http://materializecss.com/side-nav.html
});
