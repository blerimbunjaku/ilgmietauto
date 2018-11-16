class DOM {
    constructor() {
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
        this.tabs = this.preise.find('.tabs');
        /**
         * NEWS-CONTAINER-END
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
         * Modals
         */
        this.autoBox = jQuery('#autoBoxModal');
        // auto box slider
        this.spinner = this.autoBox.find('.spinner');
    }
}

class App {
    constructor() {
        this.dom = new DOM();
        this.listeners = new Listeners(this.dom);
    }
    init() {
        this.listeners.init();
    }
}

(function () {
    const app = new App();
    app.init();
})();