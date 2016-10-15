import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Tasks } from '../../api/tasks.js';
import "./calendar.html"

Template.calendar.onRendered( () => {
  $('#calendar').fullCalendar({
    // Function providing events reactive computation for fullcalendar plugin
    events: function(start, end, timezone, callback) {
      var userId = Meteor.user()._id;
      start = start.toDate();
      end = end.toDate();
      var events = [];
      var colors = ["#e64a19", "#f57c00", "#42A5F5", "#7cb342"];
      var tasks = Tasks.find({"owner": userId}, {"dueDate":{$exists: true, $gt: start, $lt: end}}).fetch();
      if (tasks) {
        for(var i in tasks) {
          var task = tasks[i];
          if(task.dueDate) {
            //console.log(task.dueDate);
            var eventDetails = {
              "title": task.text,
              "start": task.dueDate,
              "end": task.dueDate,
              "allDay": true,
              "color": colors[task.progress-1],
            };
            events.push(eventDetails);
          }
        }
        callback(events);
      }
    },
    id: "calendar1", // Optional: id of the calendar
    addedClasses: "col-md-8", // Optional: Additional classes to apply to the calendar
    // Optional: Additional functions to apply after each reactive events computation
    autoruns: [],
    // Standard fullcalendar options
    height: 700,
    hiddenDays: [ 0 ],
    slotDuration: '01:00:00',
    minTime: '08:00:00',
    maxTime: '19:00:00',
    lang: 'en',
  });
  Tracker.autorun( () => {
    Meteor.subscribe("tasks");
    $( '#calendar' ).fullCalendar( 'refetchEvents' );
  });
});
