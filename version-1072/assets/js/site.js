(function () {
    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            var isOpen = navLinks.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    document.querySelectorAll('img').forEach(function (image) {
        image.addEventListener('error', function () {
            image.classList.add('image-hidden');
        });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-slide-to]'));
    var currentSlide = 0;

    function setSlide(index) {
        if (!slides.length) {
            return;
        }

        currentSlide = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === currentSlide);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === currentSlide);
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            var index = Number(dot.getAttribute('data-slide-to')) || 0;
            setSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            setSlide(currentSlide + 1);
        }, 5200);
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-site-search]'));
    var searchCards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));

    function normalizeText(value) {
        return String(value || '').toLowerCase().trim();
    }

    function filterCards(value) {
        var keyword = normalizeText(value);

        searchCards.forEach(function (card) {
            var haystack = normalizeText([
                card.getAttribute('data-title'),
                card.getAttribute('data-tags'),
                card.textContent
            ].join(' '));

            card.classList.toggle('is-filtered', keyword.length > 0 && haystack.indexOf(keyword) === -1);
        });
    }

    searchInputs.forEach(function (input) {
        input.addEventListener('input', function () {
            filterCards(input.value);
        });
    });

    var playerCard = document.querySelector('[data-player]');

    if (playerCard) {
        var video = playerCard.querySelector('video');
        var button = playerCard.querySelector('[data-play-button]');
        var source = playerCard.getAttribute('data-video-src');
        var hlsInstance = null;
        var started = false;

        function showButton() {
            if (button) {
                button.classList.remove('is-hidden');
            }
        }

        function hideButton() {
            if (button) {
                button.classList.add('is-hidden');
            }
        }

        function startPlayer() {
            if (!video || !source) {
                return;
            }

            hideButton();

            if (started) {
                video.play().catch(showButton);
                return;
            }

            started = true;

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });

                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(showButton);
                });
                hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        showButton();
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                video.addEventListener('loadedmetadata', function () {
                    video.play().catch(showButton);
                }, { once: true });
            } else {
                video.src = source;
                video.play().catch(showButton);
            }
        }

        if (button) {
            button.addEventListener('click', startPlayer);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    startPlayer();
                }
            });

            video.addEventListener('play', hideButton);
            video.addEventListener('pause', showButton);
            video.addEventListener('ended', showButton);
        }

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }
})();
