class Listeners {
    constructor(dom) {
        this.mobile = 991;
        this.dom = dom;
        this.oldCarouselTemplate = '';
        this.path = document.location.href;
    }

    init() {
        this.documentReady();
        this.newsItems();
        this.windowResize();
        this.newsSliderArrowsClick();
        this.newsSliderButtonsClick();
        this.tabClick();
        this.kontaktFormSubmit();
    }

    documentReady() {
        jQuery(document).ready(() => {
            this._bottomSliderCarouselFix();
            this.topHeaderInfo();
            this.initTimeline();
            this.navbarFix();
            this.dropdownToggler();
            this.setActiveMenu();
            this.addImageFromSlider();
            this.autoBoxSlider();
            this.prependRouteIcon();
            this.faqAccordions();
            this.initDatetimePickers();
            this.addReservierungIframe();
            this.preisClick();
        });
    }

    addImageFromSlider(){ // add the first image of slider as poster (personenwagen page)
        let cars = Array.from(this.dom.personenCars.find('.car-p'));
        cars.map(car => {
            let image = document.createElement('img');
            image.classList.add('img-fluid');
            image.src = jQuery(car).find('.slider-images img').first().attr('src');
            car.prepend(image);
        });
    }

    newsItems(){
        let news = Array.from(this.dom.news.find('.views-row'));
        let template = ``;
        news = news.filter(item => {
            return jQuery(item).find('.news-image img').length > 0 && jQuery(item).remove();
        });
        if(news.length > 3 && news.length < 7){
            this.dom.newsSlider.find('.ci-desk li:nth-child(2)').css('display','inline-block');
        }else if(news.length > 6){
            this.dom.newsSlider.find('.ci-desk li:nth-child(2), .ci-desk li:nth-child(3)').css('display','inline-block');
        }
        this.dom.news.removeClass('news-content');
        // news.reverse();
        let index = 0;
        news.forEach((item,i) => {
            if(i > 9){
                return false;
            }
            let newsObj = {
                img: jQuery(item).find('.news-image img').attr('src'),
                title: jQuery(item).find('.news-title').text().trim(),
                body: jQuery(item).find('.news-body').text().trim(),
                mehr: jQuery(item).find('.news-mehr a').attr('href')
            }
            if(index === 0){
                template += '<div class="carousel-item"><div class="row">'
            }
            template += `
                            <div class="col-xs-12 col-sm-8 offset-sm-2 col-md-8 offset-md-2 col-lg-4 offset-lg-0">
                                <div class="s2-item">
                                    <div class="row">
                                        <div class="col-5"><img src="${newsObj.img}" alt="" class="img-fluid slider2-img"></div>
                                        <div class="col-7">
                                            <div class="s2-item-content">
                                                <h3>${newsObj.title}</h3>
                                                <p>${newsObj.body}</p>
                                                <a href="${newsObj.mehr}" class="btn btn-block site-btn">Mehr</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
            `;

            if(index++ === 2 || news.length - 1 === i){
                template += '</div></div>';
                index = 0;
            }
        });
        this.dom.newsSlider.find('.carousel-inner').empty().html(template);
        this.dom.newsSlider.find('.carousel-item').first().addClass('active');
    }

    initDatetimePickers(){
        const today = new Date();
        const _this = this;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const twoDays = new Date();
        twoDays.setDate(tomorrow.getDate() + 1);
        const datepickers = Array.from(this.dom.slider.find('.datepicker'));
        const timepickers = Array.from(this.dom.slider.find('.timepicker'));
        datepickers.forEach(dt => {
           if(dt.getAttribute('name') === 'abfahrt_datum'){
               dt.value = `${tomorrow.getDate()}.${tomorrow.getMonth()+1}.${tomorrow.getFullYear()}`;
               jQuery(dt).on('change', function(){
                   const inputDate = _this._createDateFromGermanFormat(jQuery(this).val());
                   inputDate.setDate(inputDate.getDate() + 1);
               });
           }else{
               dt.value = `${twoDays.getDate()}.${twoDays.getMonth()+1}.${twoDays.getFullYear()}`;
           }
           jQuery(dt).datepicker({
                date: today,
                startDate: dt.getAttribute('name') === 'abfahrt_datum' ? tomorrow : twoDays,
                format: 'dd.mm.yyyy'
            });
        });
        timepickers.forEach(tp => {
           if(tp.dataset['type'] === 'startTime'){
                tp.value = '07:30';
           }else{
               tp.value = '17:30';
           }
           jQuery(tp).timepicker({
               timeFormat: 'HH:mm'
           });
        });
    }

    preisClick(){
        const _this = this;
        this.dom.slider.find('.frame-btn').on('click', function(){
            const form = jQuery(this).closest('form');
            let validate = true;
            const date = {
                start:'',
                end:''
            };
            form.find('.form-control').each(function(){
                let name = jQuery(this).attr('name');
                if(name === 'abfahrt_datum'){
                    date.start = _this._createDateFromGermanFormat(jQuery(this).val(), jQuery(this).closest('.row').find('.timepicker').val());
                }else if(name === 'ruckgabe_datum'){
                    date.end = _this._createDateFromGermanFormat(jQuery(this).val(), jQuery(this).closest('.row').find('.timepicker').val());
                }
                if(jQuery(this).val().trim() === ''){
                    validate = false;
                }
            });
            if(date.start >= date.end){
                _this.dom.slider.find('.error-msg').text('Abfahrt kann nicht größer sein als Rückgabe.');
                return;
            }
            if(validate){
                _this.dom.slider.find('.error-msg').text('');
                localStorage.setItem('frm',JSON.stringify(_this._objectifyForm(form)));
                window.location.href = '/reservierung-rd';
            }
        });
    }
    addReservierungIframe(){
        if(!this.dom.reservierung){
            return;
        }
        if(!localStorage.getItem('frm')){
            history.back();
        }
        const _this = this;
        const form = JSON.parse(localStorage.getItem('frm'));
        form['startTimestamp'] = + new Date(...this._parseDateTime(form['abfahrt_datum'], form['abfahrt_uhrzeit']));
        form['endTimestamp'] = + new Date(...this._parseDateTime(form['ruckgabe_datum'], form['ruckgabe_uhrzeit']));
        localStorage.removeItem('frm');
        const src = `https://kunden2.cx9.de/ilg/reservierung_rd/cars&PHPSESSID=4qj01f6vodq3odn9lm37evmf24?startstation=001&endstation=001&region=&startdatetime=${form['startTimestamp']}&enddatetime=${form['endTimestamp']}&kategorie-select=&abholDatum=${form['abfahrt_datum']}&abholZeit=${form['abfahrt_uhrzeit']}&abgabeDatum=${form['ruckgabe_datum']}&abgabeZeit=${form['ruckgabe_uhrzeit']}`;
        const iframe = document.createElement('iframe');
        const spinner = jQuery(_this.dom.reservierung).find('.frame-spinner');
        let pixels = window.innerHeight - _this.dom.header.height() - _this.dom.top.height();
        _this.dom.reservierung.style.height = pixels + 'px';
        iframe.src = src;
        this.dom.reservierung.appendChild(iframe);
        iframe.addEventListener('load', function(){
            spinner.hide();
            jQuery(iframe).show();
        });
    }

    setActiveMenu(){
        const menu = this.dom.header.find('ul.navbar-nav').first();
        const current = this.path.indexOf('?') === 1 ?
            this.path.substring(this.path.lastIndexOf('/')+1, this.path.indexOf('?')) : this.path.substr(this.path.lastIndexOf('/')+1);
        menu.find('.active').removeClass('active');
        const active = Array.from(menu.find('.nav-link')).filter(link => {
            return jQuery(link).attr('href').includes(current);
        })[0];
        if(typeof active === 'undefined'){
            return;
        }
        if(active.closest('li.nav-item').querySelector('.dropdown-menu')){
            active.classList.add('active');
            // jQuery(active).closest('li.nav-item').addClass('active');
            active.closest('li.nav-item').classList.add('active');
        }else{
            active.parentNode.classList.add('active');
        }
    }

    navbarFix(){
        const menu = this.dom.menu.find('ul.menu');
        const items = Array.from(menu.find('li.sf-depth-1'));
        items.map((item, index) => {
            item.removeAttribute('class');
            item.removeAttribute('id');
            item.classList.add('nav-item');
            jQuery(item).find('a').after('<p><span></span></p>').removeAttr('class id').addClass('nav-link');
            if(index === 0){
                item.classList.add('active');
            }
            if(item.childElementCount > 2){
                item.classList.add('dropdown');
                jQuery(item).find('a.nav-link').first().addClass('dropdown-toggle');
                jQuery(item).find('ul').removeAttr('class').addClass('dropdown-menu');
            }
            const firstNivelLink = item.children[0];
            if(firstNivelLink.getAttribute('href') === '#' || firstNivelLink.getAttribute('href') === ""){
                firstNivelLink.setAttribute('href','javascript:void(0)');
            }
        });
        const menuHTML = `<ul class="navbar-nav ml-auto">${this.dom.menu.find('ul.menu').html()}</ul>`;
        jQuery(this.dom.menu.find('.navbar-collapse')).html(menuHTML).css('visibility','visible');
        this.dom.menu.css('maxHeight','auto');
    }

    dropdownToggler(){
        jQuery(document).on('click', '.dropdown-toggle', function(){
            const dropdown = jQuery(this).closest('.dropdown').find('.dropdown-menu');
            if(dropdown.css('display') === 'block'){
                dropdown.hide();
                return;
            }
            jQuery('.dropdown-menu').hide();
            jQuery(this).closest('.dropdown').find('.dropdown-menu').toggle();
        });
    }

    windowResize() {
        this.dom.window.on('resize', () => {
            this._bottomSliderCarouselFix();
        });
    }

    initTimeline() {
        this._timelineHTMLFix().then(() => { // this function will remove extra elements that Drupal adds
            timeline(this.dom.timeline, {
                forceVerticalMode: 700,
                mode: 'horizontal',
                verticalStartPosition: 'left',
                visibleItems: 4
            });
        });
    }

    topHeaderInfo() {
        this.dom.thInfo.each(function () {
            const p = jQuery(this).find('#block-address p, #block-email p, #block-phone p');
            const p_text = p.text();
            jQuery(this).find('i.fas').appendTo(p.empty());
            p.append(p_text);
        });
    }

    newsSliderArrowsClick() {
        this.dom.newsSlider.on('click','.ns-arrow', (e) => {
            if (e.target.parentNode.dataset['dir'] === 'right') {
                this.dom.newsSlider.find('.carousel-control-next').click();
            } else {
                this.dom.newsSlider.find('.carousel-control-prev').click();
            }
        });
    }

    newsSliderButtonsClick() {
        this.dom.newsSlider.on('click', '.ci-desk li', (e) => {
            const _this = e.target
            this.dom.newsSlider.find('.ci-desk li').removeClass('active');
            _this.classList.add('active');
        });
    }

    tabClick() {
        const _this = this;
        this.dom.tabs.on('click','.tab-link', function () {
            const link = jQuery(this);
            const arrow = link.find('.tl-arrow');
            _this.dom.tabs.find('.tl-arrow').removeClass('fa-arrow-down').addClass('fa-arrow-right');
            _this.dom.tabs.find('.tab-content').slideUp();
            const tabContent = jQuery(this).next();
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

    kontaktFormSubmit() {
        const submit = this.dom.kontakt.find('#kfs');
        const _this = this;
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

    autoBoxSlider() {
        const _this = this;
        this.dom.autoboxOpen.on('click', function (e) {
            e.preventDefault();
            let template = '<ul id="imageGallery">';
            const modalBody = _this.dom.autoBox.find('.modal-body');
            _this.dom.spinner.show();
            modalBody.html('').hide();
            jQuery(this).closest('.car-p').find('.slider-images img').each(function () {
                template += `<li data-thumb="${jQuery(this).attr('src')}" data-src="${jQuery(this).attr('src')}"><img src="${jQuery(this).attr('src')}" /></li>`;
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

    prependRouteIcon(){
        const kontaktInfo = this.dom.kontakt.prev();
        kontaktInfo.find('.route-btn a.site-btn').prepend('<i class="fas fa-map-marked-alt"></i>');
    }

    // FAQ
    faqAccordions(){
        if(!this.path.includes('faq')){
            return;
        }
        const items = Array.from(this.dom.faq.find('.faq-item'));
        const faqAccordions = this.dom.faq.find('.faq-accordions');
        let template = '';
        items.forEach(item => {
            let title = jQuery(item).find('.faq-item-title').html().trim();
            let content = jQuery(item).find('.faq-item-content').html().trim();
            template = `
                <div class="tab-link">
                    <p>${title}</p>
                    <i class="fas tl-arrow fa-arrow-right"></i>
                </div>
                <div class="tab-content">${content}</div>
            ` + template;
        });
        faqAccordions.html(template);
    }

    /**
     * Handlers
     * all handlers name starts with _ (underline)
     */
    _buildSlider(el) {
        const slider = el.lightSlider({
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

    _bottomSliderCarouselFix() {
        let carouselItems = this.dom.newsSlider.find('.carousel-item');
        let items = carouselItems.find('.s2-item').parent();
        items.map((i, item) => {
            jQuery(item).find('.s2-item-content img').addClass('img-fluid').appendTo(jQuery(item).find('.img-s2'));
            jQuery(item).find('a[href="#"]').addClass('btn btn-block site-btn');
        });
        if (this.oldCarouselTemplate === '') {
            this.oldCarouselTemplate = this.dom.newsSlider.html();
        }
        if (this.dom.window.width() <= this.mobile) {
            jQuery('#newsSlider .carousel-item').remove();
            items.map((index, item) => {
                const activeClass = index === 0 ? ' active' : '';
                this.dom.newsSlider.find('.carousel-inner').append(`
                    <div class="carousel-item${activeClass}">${item.outerHTML}</div>
                `);
            });
        } else {
            if (this.dom.newsSlider.find('.carousel-item.active > .row').children().length < 3) {
                this.dom.newsSlider.html(this.oldCarouselTemplate);
            }
        }
    }

    _objectifyForm (formElement) {
        const form = formElement.serializeArray();
        const data = {};
        form.forEach(element => {
            data[element.name] = element.value;
        });
        return data;
    }

    _createDateFromGermanFormat(dateInput, timeInput = false){
        let date = dateInput.split('.');
        date.reverse();
        if(timeInput){
            date = [...date, ...timeInput.split(':')];
        }
        return new Date(...date);
    }

    _parseDateTime(dateInput,timeInput){
        let date = dateInput.split('.');
        // date[1] = parseInt(date[1]) - 1;
        date.reverse();
        date = [...date, ...timeInput.split(':')];
        return date;
    }

    _timelineHTMLFix() { // this will return a promise, basically will be an async task
        return new Promise((resolve, reject) => {
            const timelineWrap = this.dom.timeline.find('.timeline__wrap');
            let template = '<div class="timeline__items">';
            const timelineItems = Array.from(timelineWrap.find('.timeline__content'));
            timelineItems.forEach(item => {
                let timelineImg = jQuery(item).find('.timeline-img img').attr('src'),
                    timelineYear = jQuery(item).find('.timeline-year').html(),
                    timelineBody = jQuery(item).find('.timeline-body p').html();
                template += `
                    <div class="timeline__item">
                            <div class="timeline__content">
                                <img src="${timelineImg}" alt="" class="img-fluid">
                                <h2>${timelineYear}</h2>
                                <p>${timelineBody}</p>
                            </div>
                        </div>
                `;
            });
            template += '</div>';
            resolve(timelineWrap.html(template));
        });
    }
}