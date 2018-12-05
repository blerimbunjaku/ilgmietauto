'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    } else {
        return Array.from(arr);
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Listeners = function () {
    function Listeners(dom) {
        _classCallCheck(this, Listeners);

        this.mobile = 991;
        this.dom = dom;
        this.oldCarouselTemplate = '';
        this.path = document.location.href;
    }

    _createClass(Listeners, [{
        key: 'init',
        value: function init() {
            this.documentReady();
            this.newsItems();
            this.windowResize();
            this.newsSliderArrowsClick();
            this.newsSliderButtonsClick();
            this.tabClick();
            this.kontaktFormSubmit();
        }
    }, {
        key: 'documentReady',
        value: function documentReady() {
            var _this2 = this;

            jQuery(document).ready(function () {
                _this2._bottomSliderCarouselFix();
                _this2.topHeaderInfo();
                _this2.initTimeline();
                _this2.navbarFix();
                _this2.dropdownToggler();
                _this2.setActiveMenu();
                _this2.addImageFromSlider();
                _this2.autoBoxSlider();
                _this2.prependRouteIcon();
                _this2.faqAccordions();
                _this2.initDatetimePickers();
                _this2.addReservierungIframe();
                _this2.preisClick();
                _this2.blankTarget();
                _this2.frameModuleInputChange();
                _this2.carBlockMehrClick();
            });
        }
    }, {
        key: 'frameModuleInputChange',
        value: function () {
            var _this = this;
            this.dom.frameModule.find('input.form-control').on('focusout change', function () {
                setTimeout(function () {
                    localStorage.setItem('frm', JSON.stringify(_this._objectifyForm(_this.dom.frameModule.find('form'))));
                }, 200);
            });
        }
    }, {
        key: 'addImageFromSlider',
        value: function addImageFromSlider() {
            // add the first image of slider as poster (personenwagen page)
            var cars = [].slice.call(this.dom.personenCars.find('.car-p'));
            cars.map(function (car) {
                var image = document.createElement('img');
                image.classList.add('img-fluid');
                image.src = jQuery(car).find('.slider-images img').first().attr('src');
                jQuery(car).prepend(image);
            });
        }
    }, {
        key: 'newsItems',
        value: function newsItems() {
            var news = [].slice.call(this.dom.news.find('.views-row'));
            var template = '';
            news = news.filter(function (item) {
                return jQuery(item).find('.news-image img').length > 0 && jQuery(item).remove();
            });
            if (news.length > 3 && news.length < 7) {
                this.dom.newsSlider.find('.ci-desk li:nth-child(2)').css('display', 'inline-block');
            } else if (news.length > 6) {
                this.dom.newsSlider.find('.ci-desk li:nth-child(2), .ci-desk li:nth-child(3)').css('display', 'inline-block');
            }
            this.dom.news.removeClass('news-content');
            // news.reverse();
            var index = 0;
            news.forEach(function (item, i) {
                if (i > 9) {
                    return false;
                }
                var newsObj = {
                    img: jQuery(item).find('.news-image img').attr('src'),
                    title: jQuery(item).find('.news-title').text().trim(),
                    body: jQuery(item).find('.news-body').html().trim(),
                    mehr: jQuery(item).find('.news-mehr a').attr('href')
                };
                if (index === 0) {
                    template += '<div class="carousel-item"><div class="row">';
                }
                template += '\n                            <div class="col-xs-12 col-sm-8 offset-sm-2 col-md-8 offset-md-2 col-lg-4 offset-lg-0">\n                                <div class="s2-item">\n                                    <div class="row">\n                                        <div class="col-sm-12 col-md-5"><img src="' + newsObj.img + '" alt="" class="img-fluid slider2-img"></div>\n                                        <div class="col-sm-12 col-md-7">\n                                            <div class="s2-item-content">\n                                                <h3>' + newsObj.title + '</h3>\n                                                <div class="news-body">' + newsObj.body + '</div>\n                                                <a href="' + newsObj.mehr + '" class="btn btn-block site-btn">Mehr</a>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n            ';

                if (index++ === 2 || news.length - 1 === i) {
                    template += '</div></div>';
                    index = 0;
                }
            });
            this.dom.newsSlider.find('.carousel-inner').empty().html(template);
            this.dom.newsSlider.find('.carousel-item').first().addClass('active');
        }
    }, {
        key: 'initDatetimePickers',
        value: function initDatetimePickers() {
            var today = new Date();
            var _this = this;
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var twoDays = new Date();
            twoDays.setDate(tomorrow.getDate() + 1);
            var datepickers = [].slice.call(this.dom.slider.find('.datepicker'));
            var timepickers = [].slice.call(this.dom.slider.find('.timepicker'));
            datepickers.forEach(function (dt) {
                if (dt.getAttribute('name') === 'abfahrt_datum') {
                    dt.value = tomorrow.getDate() + '.' + (tomorrow.getMonth() + 1) + '.' + tomorrow.getFullYear();
                    jQuery(dt).on('change', function () {
                        var inputDate = _this._createDateFromGermanFormat(jQuery(this).val());
                        inputDate.setDate(inputDate.getDate() + 1);
                    });
                } else {
                    dt.value = twoDays.getDate() + '.' + (twoDays.getMonth() + 1) + '.' + twoDays.getFullYear();
                }
                jQuery(dt).datepicker({
                    date: today,
                    startDate: dt.getAttribute('name') === 'abfahrt_datum' ? tomorrow : twoDays,
                    format: 'dd.mm.yyyy'
                });
            });
            timepickers.forEach(function (tp) {
                if (tp.dataset['type'] === 'startTime') {
                    tp.value = '07:30';
                } else {
                    tp.value = '17:30';
                }
                jQuery(tp).timepicker({
                    timeFormat: 'HH:mm'
                });
            });
            if(this.dom.frameModule.length > 0){
                localStorage.setItem('frm', JSON.stringify(_this._objectifyForm(this.dom.frameModule.find('form'))));
            }
        }
    }, {
        key: 'validateMainForm',
        value: function(form = null){
            var validate = true;
            var _this = this;
            var date = {
                start: '',
                end: ''
            };
            if(!form){
                form = JSON.parse(localStorage.getItem('frm'));
                date.start = _this._createDateFromGermanFormat(form['abfahrt_datum'], form['abfahrt_uhrzeit']);
                date.end =  _this._createDateFromGermanFormat(form['ruckgabe_datum'], form['ruckgabe_uhrzeit']);
            }else{
                form.find('.form-control').each(function () {
                    var name = jQuery(this).attr('name');
                    if (name === 'abfahrt_datum') {
                        date.start = _this._createDateFromGermanFormat(jQuery(this).val(), jQuery(this).closest('.row').find('.timepicker').val());
                    } else if (name === 'ruckgabe_datum') {
                        date.end = _this._createDateFromGermanFormat(jQuery(this).val(), jQuery(this).closest('.row').find('.timepicker').val());
                    }
                    if (jQuery(this).val().trim() === '') {
                        validate = false;
                    }
                });
            }

            if (date.start >= date.end) {
                if(this.dom.frameModule.length > 0){
                    form.find('.error-msg').text('Abfahrt kann nicht größer sein als Rückgabe.');
                }else{
                    alert('Abfahrt kann nicht größer sein als Rückgabe.');
                    history.back();
                }
                return false;
            }
            return true;
        }
    }, {
        key: 'preisClick',
        value: function preisClick() {
            var _this = this;
            this.dom.slider.find('.frame-btn').on('click', function () {
                var form = jQuery(this).closest('form');

                if (_this.validateMainForm(form)) {
                    _this.dom.slider.find('.error-msg').text('');
                    localStorage.setItem('frm', JSON.stringify(_this._objectifyForm(form)));
                    window.location.href = '/reservierung-rd';
                }
            });
        }
    }, {
        key: 'addReservierungIframe',
        value: function addReservierungIframe() {
            if (!this.dom.reservierung) {
                return;
            }
            var _this = this;
            var iframe = document.createElement('iframe');
            var spinner = jQuery(_this.dom.reservierung).find('.frame-spinner');
            var pixels = window.innerHeight - _this.dom.header.height() - _this.dom.top.height();
            var src = '';
            var form = JSON.parse(localStorage.getItem('frm'));
            form['startTimestamp'] = +new (Function.prototype.bind.apply(Date, [null].concat(_toConsumableArray(this._parseDateTime(form['abfahrt_datum'], form['abfahrt_uhrzeit'])))))();
            form['endTimestamp'] = +new (Function.prototype.bind.apply(Date, [null].concat(_toConsumableArray(this._parseDateTime(form['ruckgabe_datum'], form['ruckgabe_uhrzeit'])))))();

            if (!URL.get('category')) {
                src = this._headerModuleFrame(form, src);

            } else {
                src = this._carsModuleFrame(form, src);
            }
            _this.dom.reservierung.style.height = pixels + 'px';
            iframe.src = src;
            this.dom.reservierung.appendChild(iframe);
            iframe.addEventListener('load', function () {
                spinner.hide();
                jQuery(iframe).show();
            });
        }
    }, {
        key: 'carBlockMehrClick',
        value: function(){
            var _this =  this;
            this.dom.carMehr.on('click', function(e){
                e.preventDefault();
                if(!_this.validateMainForm()){
                    var body = jQuery("html, body");
                    body.stop().animate({scrollTop:0}, 500, 'swing');
                }else{
                    window.location.href = jQuery(this).find('a').attr('href');
                }
            });
        }
    }, {
        key: '_headerModuleFrame',
        value: function (form, src) {
            src = 'https://kunden2.cx9.de/ilg/reservierung_rd/cars&PHPSESSID=4qj01f6vodq3odn9lm37evmf24?startstation=001&endstation=001&region=&startdatetime=' + form['startTimestamp'] + '&enddatetime=' + form['endTimestamp'] + '&kategorie-select=&abholDatum=' + form['abfahrt_datum'] + '&abholZeit=' + form['abfahrt_uhrzeit'] + '&abgabeDatum=' + form['ruckgabe_datum'] + '&abgabeZeit=' + form['ruckgabe_uhrzeit'];
            return src;
        }
    }, {
        key: '_carsModuleFrame',
        value: function (form, src) {
            src = 'https://kunden2.cx9.de/ilg/reservierung_rd/cars&PHPSESSID=4qj01f6vodq3odn9lm37evmf24?startstation=' + URL.get('station') + '&endstation=001&category=' + URL.get('category') + '&region=&startdatetime=' + form['startTimestamp'] + '&enddatetime=' + form['endTimestamp'] + '&kategorie-select=&abholDatum=' + form['abfahrt_datum'] + '&abholZeit=' + form['abfahrt_uhrzeit'] + '&abgabeDatum=' + form['ruckgabe_datum'] + '&abgabeZeit=' + form['ruckgabe_uhrzeit'];
            return src;
        }
    }, {
        key: 'setActiveMenu',
        value: function setActiveMenu() {
            var menu = this.dom.header.find('ul.navbar-nav').first();
            var current = this.path.indexOf('?') === 1 ? this.path.substring(this.path.lastIndexOf('/') + 1, this.path.indexOf('?')) : this.path.substr(this.path.lastIndexOf('/') + 1);
            menu.find('.active').removeClass('active');
            var active = [].slice.call(menu.find('.nav-link')).filter(function (link) {
                return jQuery(link).attr('href').indexOf(current) > -1;
            })[0];
            if (typeof active === 'undefined') {
                return;
            }
            if (jQuery(active).closest('li.nav-item').find('.dropdown-menu')) {
                active.classList.add('active');
                // jQuery(active).closest('li.nav-item').addClass('active');
                jQuery(active).closest('li.nav-item').addClass('active');
            } else {
                jQuery(active).parent().addClass('active');
            }
        }
    }, {
        key: 'navbarFix',
        value: function navbarFix() {
            var menu = this.dom.menu.find('ul.menu');
            var items = [].slice.call(menu.find('li.sf-depth-1'));
            items.map(function (item, index) {
                item.removeAttribute('class');
                item.removeAttribute('id');
                item.classList.add('nav-item');
                jQuery(item).find('a').after('<p><span></span></p>').removeAttr('class id').addClass('nav-link');
                if (index === 0) {
                    item.classList.add('active');
                }
                if (item.childElementCount > 2) {
                    item.classList.add('dropdown');
                    jQuery(item).find('a.nav-link').first().addClass('dropdown-toggle');
                    jQuery(item).find('ul').removeAttr('class').addClass('dropdown-menu');
                }
                var firstNivelLink = item.children[0];
                if (firstNivelLink.getAttribute('href') === '#' || firstNivelLink.getAttribute('href') === "") {
                    firstNivelLink.setAttribute('href', 'javascript:void(0)');
                }
            });
            var menuHTML = '<ul class="navbar-nav ml-auto">' + this.dom.menu.find('ul.menu').html() + '</ul>';
            jQuery(this.dom.menu.find('.navbar-collapse')).html(menuHTML).css('visibility', 'visible');
            this.dom.menu.css('maxHeight', 'auto');
        }
    }, {
        key: 'dropdownToggler',
        value: function dropdownToggler() {
            jQuery(document).on('click', '.dropdown-toggle', function () {
                var dropdown = jQuery(this).closest('.dropdown').find('.dropdown-menu');
                if (dropdown.css('display') === 'block') {
                    dropdown.hide();
                    return;
                }
                jQuery('.dropdown-menu').hide();
                jQuery(this).closest('.dropdown').find('.dropdown-menu').toggle();
            });
        }
    }, {
        key: 'windowResize',
        value: function windowResize() {
            var _this3 = this;

            this.dom.window.on('resize', function () {
                _this3._bottomSliderCarouselFix();
            });
        }
    }, {
        key: 'initTimeline',
        value: function initTimeline() {
            this._timelineHTMLFix();
            timeline(this.dom.timeline, {
                forceVerticalMode: 700,
                mode: 'horizontal',
                verticalStartPosition: 'left',
                visibleItems: 4
            });
        }
    }, {
        key: 'topHeaderInfo',
        value: function topHeaderInfo() {
            this.dom.thInfo.each(function () {
                var p = jQuery(this).find('#block-address p, #block-email p, #block-phone p');
                var p_text = p.text();
                jQuery(this).find('i.fas').appendTo(p.empty());
                p.append(p_text);
            });
        }
    }, {
        key: 'newsSliderArrowsClick',
        value: function newsSliderArrowsClick() {
            var _this4 = this;

            this.dom.newsSlider.on('click', '.ns-arrow', function (e) {
                if (e.target.parentNode.dataset['dir'] === 'right') {
                    _this4.dom.newsSlider.find('.carousel-control-next').click();
                } else {
                    _this4.dom.newsSlider.find('.carousel-control-prev').click();
                }
            });
        }
    }, {
        key: 'newsSliderButtonsClick',
        value: function newsSliderButtonsClick() {
            var _this5 = this;

            this.dom.newsSlider.on('click', '.ci-desk li', function (e) {
                var _this = e.target;
                _this5.dom.newsSlider.find('.ci-desk li').removeClass('active');
                _this.classList.add('active');
            });
        }
    }, {
        key: 'tabClick',
        value: function tabClick() {
            var _this = this;
            this.dom.tabs.on('click', '.tab-link', function () {
                var link = jQuery(this);
                var arrow = link.find('.tl-arrow');
                _this.dom.tabs.find('.tl-arrow').removeClass('fa-arrow-down').addClass('fa-arrow-right');
                _this.dom.tabs.find('.tab-content').slideUp();
                var tabContent = jQuery(this).next();
                if (tabContent.css('display') == 'none') {
                    tabContent.slideToggle('fast', function () {
                        if (jQuery(this).css('display') == 'block') {
                            arrow.removeClass('fa-arrow-right').addClass('fa-arrow-down');
                        } else {
                            arrow.removeClass('fa-arrow-down').addClass('fa-arrow-right');
                        }
                    });
                }
            });
        }
    }, {
        key: 'kontaktFormSubmit',
        value: function kontaktFormSubmit() {
            var submit = this.dom.kontakt.find('#kfs');
            var _this = this;
            submit.on('click', function (e) {
                e.preventDefault();
                if (grecaptcha.getResponse(widgetId1) === '') {
                    _this.dom.kontakt.find('#recaptcha').next().show();
                } else {
                    _this.dom.kontakt.find('#recaptcha').next().hide();
                    _this.dom.kontakt.find('form').submit();
                }
            });
        }
    }, {
        key: 'autoBoxSlider',
        value: function autoBoxSlider() {
            var _this = this;
            this.dom.autoboxOpen.on('click', function (e) {
                e.preventDefault();
                var template = '<ul id="imageGallery">';
                var modalBody = _this.dom.autoBox.find('.modal-body');
                _this.dom.spinner.show();
                modalBody.html('').hide();
                jQuery(this).closest('.car-p').find('.slider-images img').each(function () {
                    template += '<li data-thumb="' + jQuery(this).attr('src') + '" data-src="' + jQuery(this).attr('src') + '"><img src="' + jQuery(this).attr('src') + '" /></li>';
                });
                template += '</ul>';
                modalBody.append(template);
                _this.dom.autoBox.modal('show');
                setTimeout(function () {
                    _this._buildSlider(modalBody.find('ul'));
                    _this.dom.spinner.hide();
                    modalBody.show();
                }, 1000);
            });
        }
    }, {
        key: 'prependRouteIcon',
        value: function prependRouteIcon() {
            var kontaktInfo = this.dom.kontakt.prev();
            kontaktInfo.find('.route-btn a.site-btn').prepend('<i class="fas fa-map-marked-alt"></i>');
        }

        // FAQ

    }, {
        key: 'faqAccordions',
        value: function faqAccordions() {
            if (!this.path.indexOf('faq') > -1) {
                return;
            }
            var items = [].slice.call(this.dom.faq.find('.faq-item'));
            var faqAccordions = this.dom.faq.find('.faq-accordions');
            var template = '';
            items.forEach(function (item) {
                var title = jQuery(item).find('.faq-item-title').html().trim();
                var content = jQuery(item).find('.faq-item-content').html().trim();
                template = '\n                <div class="tab-link">\n                    <p>' + title + '</p>\n                    <i class="fas tl-arrow fa-arrow-right"></i>\n                </div>\n                <div class="tab-content">' + content + '</div>\n            ' + template;
            });
            faqAccordions.html(template);
        }

        // add target="_blank" to linkgs

    }, {
        key: 'blankTarget',
        value: function blankTarget() {
            jQuery('a[href^="http://"], a[href^="https://"]').attr('target', '_blank');
        }

        /**
         * Handlers
         * all handlers name starts with _ (underline)
         */

    }, {
        key: '_buildSlider',
        value: function _buildSlider(el) {
            var slider = el.lightSlider({
                gallery: true,
                item: 1,
                loop: true,
                thumbItem: 9,
                slideMargin: 0,
                enableDrag: false,
                currentPagerPosition: 'left'
            });
            slider.goToSlide(jQuery('.active').next().index());
        }
    }, {
        key: '_bottomSliderCarouselFix',
        value: function _bottomSliderCarouselFix() {
            var _this6 = this;

            var carouselItems = this.dom.newsSlider.find('.carousel-item');
            var items = carouselItems.find('.s2-item').parent();
            items.map(function (i, item) {
                jQuery(item).find('.s2-item-content img').addClass('img-fluid').appendTo(jQuery(item).find('.img-s2'));
                jQuery(item).find('a[href="#"]').addClass('btn btn-block site-btn');
            });
            if (this.oldCarouselTemplate === '') {
                this.oldCarouselTemplate = this.dom.newsSlider.html();
            }
            if (this.dom.window.width() <= this.mobile) {
                jQuery('#newsSlider .carousel-item').remove();
                items.map(function (index, item) {
                    var activeClass = index === 0 ? ' active' : '';
                    _this6.dom.newsSlider.find('.carousel-inner').append('\n                    <div class="carousel-item' + activeClass + '">' + item.outerHTML + '</div>\n                ');
                });
            } else {
                if (this.dom.newsSlider.find('.carousel-item.active > .row').children().length < 3) {
                    this.dom.newsSlider.html(this.oldCarouselTemplate);
                }
            }
        }
    }, {
        key: '_objectifyForm',
        value: function (formElement) {
            var form = formElement.serializeArray();
            var data = {};
            form.forEach(function (element) {
                data[element.name] = element.value;
            });
            return data;
        }
    }, {
        key: '_createDateFromGermanFormat',
        value: function _createDateFromGermanFormat(dateInput) {
            var timeInput = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var date = dateInput.split('.');
            date.reverse();
            if (timeInput) {
                date = [].concat(_toConsumableArray(date), _toConsumableArray(timeInput.split(':')));
            }
            return new (Function.prototype.bind.apply(Date, [null].concat(_toConsumableArray(date))))();
        }
    }, {
        key: '_parseDateTime',
        value: function _parseDateTime(dateInput, timeInput) {
            var date = dateInput.split('.');
            // date[1] = parseInt(date[1]) - 1;
            date.reverse();
            date = [].concat(_toConsumableArray(date), _toConsumableArray(timeInput.split(':')));
            return date;
        }
    }, {
        key: '_timelineHTMLFix',
        value: function _timelineHTMLFix() {
            // this will return a promise, basically will be an async task
            var timelineWrap = this.dom.timeline.find('.timeline__wrap');
            var template = '<div class="timeline__items">';
            var timelineItems = [].slice.call(timelineWrap.find('.timeline__content'));
            timelineItems.forEach(function (item) {
                var timelineImg = jQuery(item).find('.timeline-img img').attr('src'),
                    timelineYear = jQuery(item).find('.timeline-year').html();
                // timelineBody = jQuery(item).find('.timeline-body p').html();
                // <p>${timelineBody}</p>
                template += '\n                    <div class="timeline__item">\n                            <div class="timeline__content">\n                                <img src="' + timelineImg + '" alt="" class="img-fluid">\n                                <h2>' + timelineYear + '</h2>\n                            </div>\n                        </div>\n                ';
            });
            template += '</div>';
            timelineWrap.html(template);
        }
    }]);

    return Listeners;
}();
var URL = {
    path: decodeURIComponent(document.location.href), // the current url to parse
    pathname: decodeURIComponent(document.location.pathname),
    url: [],
    get: function (key) { // this returns the value of the given key (example: '?name=myname') URL.get('name') returns "myname"
        var val = this.path.substr(this.path.indexOf(key) + key.length + 1); // substring path by the given key
        if (!this.path.includes(key)) { // checks if given argument exists on url
            return false;
        }
        // if path includes '&', substring path from 0 to character '&'
        if (val.includes('&')) {
            val = val.substring(0, val.indexOf('&'));
        }
        return val;
    },
    split: function (delimeter) {
        this.url = [];
        var tmp = this.pathname.split(delimeter);
        for (i in tmp) {
            if (i > 0) {
                this.url.push(tmp[i]);
            }
        }
        return this;
    },
    getFromUrl: function (index) {
        if (index < 0 || index > this.url.length - 1) {
            throw new Error("Index must be > 0 <= " + (this.url.length - 1));
        }
        return this.url[index];
    }
}