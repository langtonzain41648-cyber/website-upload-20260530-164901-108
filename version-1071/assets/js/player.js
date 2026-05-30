function initMoviePlayer(videoId, coverId, playId, src) {
  var video = document.getElementById(videoId);
  var cover = document.getElementById(coverId);
  var play = document.getElementById(playId);
  var hls = null;
  var ready = false;

  if (!video || !cover || !src) {
    return;
  }

  function attach() {
    if (ready) {
      return;
    }

    ready = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.load();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      return;
    }

    video.src = src;
    video.load();
  }

  function start() {
    attach();
    cover.classList.add("is-hidden");
    var attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(function () {
        cover.classList.remove("is-hidden");
      });
    }
  }

  cover.addEventListener("click", start);

  if (play) {
    play.addEventListener("click", function (event) {
      event.stopPropagation();
      start();
    });
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      start();
    }
  });

  video.addEventListener("play", function () {
    cover.classList.add("is-hidden");
  });

  window.addEventListener("pagehide", function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
