import Marionette from "backbone.marionette";
import {App} from '../../app';
import {Home} from './home';

Home.MainView = Marionette.LayoutView.extend({
    template: Handlebars.templates.home
});



