'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DOM = function DOM() {
    _classCallCheck(this, DOM);

    /**
     * document & window
     */
    this.document = jQuery(document);
    this.window = jQuery(window);
    /**
     * document & window - end
     */

    /**
     * HEADER
     */
    this.top = jQuery('.top-sec');
    this.header = jQuery('header');
    this.menu = this.header.find('nav.navbar');
    /**
     * HEADER-END
     */

    /**
     * NEW CONTAINER
     */
    this.newsSlider = jQuery('#newsSlider');
    /**
     * NEWS-CONTAINER-END
     */

    /**
     * NEW CONTAINER
     */
    this.preise = jQuery('.preise-content');
    this.tabs = jQuery('.tabs');
    /**
     * NEWS-CONTAINER-END
     */
    /**
     * news content
     */
    this.news = jQuery('.news-content');
    /**
     * news content end
     */
    /**
     * main slider
     */
    this.slider = jQuery('#slider');
    this.frameModule = this.slider.find('.frame-module');
    /**
     * main slider - end
     */
    /**
     * NEW CONTAINER
     */
    this.kontakt = jQuery('.k-kontakt');
    /**
     * NEWS-CONTAINER-END
     */
    /**
     *  Top header info
     */
    this.thInfo = jQuery('.th-info');
    /**
     * end top header info
     */
    /**
     * personenwagen
     */
    this.personenCars = jQuery('.cars-personen');
    this.autoboxOpen = this.personenCars.find('.autobox-open');
    /*
    * Uber Uns
    */
    // this.about = $('.about-content');
    this.timeline = jQuery('.timeline');
    /**
     * uber uns end
     */
    /**
     * FAQ start
     */
    this.faq = jQuery('.faq-container');
    /**
     * FAQ end
     */
    /**
     * reservierung start
     */
    this.reservierung = document.getElementById('reservierung');
    /**
     * reservierung end
     */
    /**
     * Modals
     */
    this.autoBox = jQuery('#autoBoxModal');
    // auto box slider
    this.spinner = this.autoBox.find('.spinner');
    // car item mehr button
    this.carMehr = jQuery('.car-item-mehr');
};

var App = function () {
    function App() {
        _classCallCheck(this, App);

        this.dom = new DOM();
        this.listeners = new Listeners(this.dom);
    }

    _createClass(App, [{
        key: 'init',
        value: function init() {
            this.listeners.init();
        }
    }]);

    return App;
}();

(function () {
    var app = new App();
    app.init();
})();