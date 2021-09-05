var config = {
  velocity: 0.15,
  sunRotation: 0,
  sunScale: 1,
  sunFill: "#333",
  sunStroke: "#dd9363",
  sunDirection: true,
  oceanLightness: 37,
  nightMode: false,
};

$(document).ready(() => {
  // Add Scroll listener
  $(window).scroll(function(){
    let yScroll = $(this).scrollTop();
    if(yScroll > 20) {
      if (!$('.site-header').hasClass("fixed")) {
        $('.site-header').addClass("fixed");
      }
    } else {
      if ($('.site-header').hasClass("fixed")) {
        $('.site-header').removeClass("fixed");
      }
    }
  });

  // Enable Navigation dropdown on small screens
  $('#site-nav .nav-toggler').click(() => {
    if(!$('.site-header').hasClass("toggled")) {
      $("#site-nav .nav-bar").animate({ height: "100%" }, "fast", () => 
        $('.site-header').addClass("toggled")
      );
    } else {
      $("#site-nav .nav-bar").animate({ height: "0%" }, "fast", () => 
        $('.site-header').removeClass("toggled")
      );
    }
  })

  // Enable Documention section
  $('#documentation .section-title').click(() => {
    if(!$('#documentation').closest('.section').hasClass("toggled")) {
      $("#documentation ul").toggle("slow", () => 
        $('#documentation').closest('.section').addClass("toggled")
      );
    } else {''
      $("#documentation ul").hide('fast', () => {
        $('#documentation').closest('.section').removeClass("toggled")
      });
    }
  })

  $("#banner .section-inner").animate({ left: "50%" }, "slow", () => {
    $("#banner .border-gradient").animate({ width: "100%" }, "fast", () =>
      $("#banner").setDone()
    );
  });

  window.requestAnimationFrame(loadCanvasArt);
  $(window).on("resize scroll", () => {
    
    // Animate About-section
    if ($("#about").shouldAnimate()) {
      $("#about .section-inner").animate({ left: "0%" }, "slow", () => {
        $("#about .border-gradient").animate({ width: "100%" }, "fast", () =>
          $("#about").setDone()
        );
      });
    }

    // Animate Artwork-section
    if ($("#artwork").shouldAnimate()) {
      $("#artwork .section-inner").animate({ right: "0%" }, "slow", () => {
        $("#artwork .border-gradient-reverse").animate({ width: "100%" }, "fast", () =>
          $("#artwork").setDone()
        );
      });
    }

    // Animate Documentation-section
    if ($("#documentation").shouldAnimate()) {
      $("#documentation .section-inner").animate(
        { left: "0%" },
        "slow",
        () => {
          $("#documentation .border-gradient").animate(
            { width: "100%" },
            "fast",
            () => $("#documentation").setDone()
          );
        }
      );
    }
  });
});

const loadCanvasArt = () => {

  let canvas = document.getElementById("canvas-art");
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  canvas.addEventListener("mouseenter", (e) => {
    config.nightMode = true;
    config.sunFill = "hsl(57, 64%, 22%)";
    config.sunStroke = "#f3f1c9";

    // Draw dark background on hover
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  canvas.addEventListener("mouseleave", (e) => {
    config.sunFill = "#333";
    config.sunStroke = "#dd9363";
    config.nightMode = false;
  });

  // Calculate animation variables
  if (config.sunDirection) {
    config.sunRotation += config.velocity;
    config.sunScale += config.velocity / 200;
    config.oceanLightness -= 8 / 200;
  } else {
    config.sunRotation -= config.velocity;
    config.sunScale -= config.velocity / 200;
    config.oceanLightness += 8 / 200;
  }

  if (config.sunRotation > 30) {
    config.sunDirection = false;
  } else if (config.sunRotation <= 0) {
    config.sunDirection = true;
  }

  // Draw dark background on nightmode
  if (config.nightMode) {
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Animate and draw the sun
  ctx.rotate((config.sunRotation * Math.PI) / 180);
  ctx.scale(config.sunScale, config.sunScale);
  drawPolygon(
    ctx,
    [
      [200, 20],
      [225, 37],
      [225, 63],
      [200, 80],
      [175, 63],
      [175, 37],
    ],
    { fillColor: config.sunFill, stroke: true, strokeColor: config.sunStroke, strokeWidth: 15 }
  );
  ctx.restore();
  // Reset identity matrix
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Mountains
  drawPolygon(
    ctx,
    [
      [158, 250],
      [188, 175],
      [218, 250],
    ],
    { fillColor: "rgba(207, 106, 63, 1)" }
  );
  drawPolygon(
    ctx,
    [
      [113, 250],
      [148, 135],
      [183, 250],
    ],
    { fillColor: "rgba(232, 206, 171, 1)" }
  );
  drawPolygon(
    ctx,
    [
      [38, 250],
      [88, 75],
      [138, 250],
    ],
    { fillColor: "rgba(143, 51, 21, 1)" }
  );
  drawPolygon(
    ctx,
    [
      [203, 250],
      [233, 105],
      [262, 250],
    ],
    { fillColor: "rgba(221, 147, 99, 0.8)" }
  );

  // Draw Ocean
  let ocean = new Path2D("M35 260 A20 17.5 0 0 0 265 260");
  ctx.fillStyle = `hsl(197, 100%, ${config.oceanLightness}%)`;
  ctx.fill(ocean);

  // Mountain Reflections
  drawPolygon(
    ctx,
    [
      [158, 260],
      [188, 300],
      [218, 260],
    ],
    { fillColor: "rgba(207, 106, 63, 0.4)" }
  );
  drawPolygon(
    ctx,
    [
      [113, 260],
      [148, 320],
      [183, 260],
    ],
    { fillColor: "rgba(232, 206, 171, 0.4)" }
  );
  drawPolygon(
    ctx,
    [
      [38, 260],
      [88, 330],
      [138, 260],
    ],
    { fillColor: "rgba(143, 51, 21, 0.4)" }
  );
  drawPolygon(
    ctx,
    [
      [203, 260],
      [233, 325],
      [262, 260],
    ],
    { fillColor: "rgba(221, 147, 99, 0.4)" }
  );

  // Draw dark overlay on nightmode
  if (config.nightMode) {
    ctx.fillStyle = "rgba(34, 34, 34, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  window.requestAnimationFrame(loadCanvasArt);
};

const drawPolygon = (ctx, path, options) => {
  let started = false;
  ctx.fillStyle = options.fillColor;
  ctx.strokeStyle = options.strokeColor;
  ctx.lineWidth = options.strokeWidth;
  for (const point of path) {
    if (!started) {
      ctx.beginPath();
      ctx.moveTo(point[0], point[1]);
      started = true;
      continue;
    }
    ctx.lineTo(point[0], point[1]);
  }
  ctx.closePath();
  ctx.fill();
  if (options.stroke) ctx.stroke();
};

$.fn.setDone = function () {
  if (!$(this).hasClass("done")) {
    $(this).addClass("done");
  }
};

$.fn.shouldAnimate = function () {
  if (!$(this).hasClass("done")) {
    let top = $(this).offset().top;
    let bottom = top + $(this).outerHeight();
    let vTop = $(window).scrollTop();
    let vBottom = vTop + $(window).height();
    return bottom > vTop && top < vBottom;
  }
  return false;
};
