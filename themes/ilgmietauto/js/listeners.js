class Listeners {
    constructor(dom) {
        this.mobile = 991;
        this.dom = dom;
        this.oldCarouselTemplate = '';
        this.path = document.location.href;
    }

    init() {
        this.documentReady();
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
        this.dom.newsSlider.find('.ns-arrow').on('click', (e) => {
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
        this.dom.tabs.find('.tab-link').on('click', function () {
            const link = jQuery(this);
            const arrow = link.find('.tl-arrow');
            _this.dom.preise.find('.tl-arrow').removeClass('fa-arrow-down').addClass('fa-arrow-right');
            _this.dom.preise.find('.tab-content').slideUp();
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