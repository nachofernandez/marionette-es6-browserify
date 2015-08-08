import Marionette from "backbone.marionette";
import {App} from '../../app';

let Home = {};

let homeController = Marionette.Object.extend({
    initialize: function() {
        App.vent.on("home:show",() => this.show());
    },
    show: function() {
        this.view = new Home.MainView();
        App.mainContent.show(this.view);
    }
});

Home.Controller = new homeController;

export {Home};