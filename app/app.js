import $ from "jquery";
import Backbone from "backbone";
import Marionette from "backbone.marionette";

var App = new Marionette.Application();

App.addRegions({
  mainContent: "#mainContainer"
});

App.on("start", function() {
  console.log("app start");
  App.vent.trigger("home:show");
});

$(document).ready(function() {
  App.start();
});

export {App};