const selector = {
  introText: ".intro",
  outroText: ".outro",
  introLetters: ".intro .char",
  outroLetters: ".outro .char",
  majesty: ".majesty",
  hearts: ".hearts > svg",
  heartExclaim: ".heart-exclaim",
  heartFace: {
    svg: ".heart-face",
    heart: ".heart-body",
    tinyEyes: ".tiny-eyes",
    tinyMouth: ".tiny-mouth",
    bigEyes: ".big-eye",
    bigMouth: ".big-mouth",
    eyeShine: ".eye-shine"
  }
};

const color = {
  dark: getCSSVar("--dark"),
  lite: getCSSVar("--lite"),
  red: getCSSVar("--red"),
  pink: getCSSVar("--pink")
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  .matches;
const userInputs = document.querySelectorAll(".textarea-wrapper");
const counters = document.querySelectorAll(".character-count");
const previewAnchorEl = document.querySelector(".preview");
const copyBtn = document.querySelector(".copy");
const toggleBtn = document.querySelector(".toggle");
const introTextContainer = document.querySelector(selector.introText);
const outroTextContainer = document.querySelector(selector.outroText);
const heartCount = document.querySelectorAll(selector.hearts).length;
const middleHeart = Math.floor(heartCount / 2);
const globalTimeline = gsap.timeline({ repeat: -1 });
const duration = 2.5;

const eyeQuiverTimeline = gsap.timeline({ paused: true });
eyeQuiverTimeline.to(selector.heartFace.eyeShine, {
  x: 1,
  y: 1,
  repeat: -1,
  yoyo: true,
  duration: 0.1,
  ease: "power4.inOut"
});

const majestySpinTimeline = gsap.timeline({ paused: true });
majestySpinTimeline.to(selector.majesty, {
  rotate: 360,
  repeat: -1,
  duration: 10,
  ease: "linear"
});

function introTextAnimation() {
  const tl = gsap.timeline();

  tl.to(selector.introText, {
    opacity: 1,
    duration: duration / 10
  })
    .from(selector.introLetters, {
      opacity: 0,
      duration: duration / 10,
      stagger: { amount: 0.8 }
    })
    .fromTo(
      selector.introLetters,
      {
        z: reduceMotion ? 0 : -30,
        rotateX: 40
      },
      {
        z: 0,
        rotateX: 0,
        duration,
        ease: "elastic.out(1, 0.2)",
        stagger: { amount: 0.8 }
      },
      "<"
    )
    .fromTo(
      selector.introText,
      {
        z: reduceMotion ? 0 : -20
      },
      {
        z: 0,
        duration: duration * 1.5,
        ease: "slow(0.7, 0.4, false)"
      },
      `-=${duration}`
    )
    .to(
      selector.introLetters,
      {
        opacity: 0,
        duration: duration / 3,
        ease: "back.in(2)",
        stagger: { amount: 0.3 }
      },
      `-=${duration / 2}`
    );

  return tl;
}

function heartsAnimation() {
  const tl = gsap.timeline();

  tl.to("html", {
    "--color-text": color.lite,
    "--color-bg": color.red,
    duration: duration / 8
  })
    .to(
      selector.hearts,
      {
        opacity: 1,
        y: 0,
        ease: "expo.out",
        duration: reduceMotion ? 0.001 : duration / 2,
        stagger: {
          amount: reduceMotion ? 0 : 0.25,
          from: "center"
        }
      },
      "<"
    )
    .to(selector.hearts, {
      xPercent: (i) => {
        const offset = Math.abs(middleHeart - i) * 60;
        return i < middleHeart ? offset * -1 : offset;
      },
      rotate: (i) => {
        if (reduceMotion) return;
        const deg = Math.abs(middleHeart - i) * 15;
        return i < middleHeart ? deg * -1 : deg;
      },
      duration: duration / 5,
      ease: "slow(0.7, 0.7, false)"
    })
    .to(selector.hearts, {
      scale: (i) => (i === middleHeart ? 1.5 : 0.25),
      opacity: (i) => (i === middleHeart ? 1 : 0),
      xPercent: (i) => {
        const offset = Math.abs(middleHeart - i) * -140;
        return i < middleHeart ? offset * -1 : offset;
      },
      rotate: 0,
      duration: reduceMotion ? 1 : duration / 8,
      ease: "elastic.out(1.4, 0.8)"
    })
    .set(
      selector.heartExclaim,
      {
        opacity: 1
      },
      "<"
    )
    .fromTo(
      selector.heartExclaim,
      {
        yPercent: -60
      },
      {
        yPercent: -120,
        duration: reduceMotion ? 0.001 : duration / 8,
        ease: "elastic.out(1, 0.6)"
      },
      "<"
    );

  return tl;
}

function tinyHeartFaceAnimation() {
  const tl = gsap.timeline();

  tl.set(selector.heartExclaim, {
    opacity: 0
  })
    .to([selector.heartFace.tinyEyes, selector.heartFace.bigMouth], {
      opacity: 1,
      duration: 0.2
    })
    .to(
      selector.heartFace.svg,
      {
        scale: reduceMotion ? 3 : 5,
        duration: reduceMotion ? 1.5 : duration / 2.5,
        ease: reduceMotion ? "elastic.out(1, 0.6)" : "elastic.out(1.6, 0.3)",
        force3D: false
      },
      "<"
    )
    .set(
      selector.hearts,
      {
        color: color.red
      },
      "<"
    )
    .to(
      "html",
      {
        "--color-text": color.dark,
        "--color-bg": color.lite,
        duration: reduceMotion ? 0.5 : 0.001
      },
      "<"
    )
    .to(
      selector.heartFace.svg,
      {
        scale: reduceMotion ? 2.5 : 2,
        duration: duration / 6,
        ease: "back.out(1.8)"
      },
      "+=0.5"
    );

  return tl;
}

function bigHeartFaceAnimation() {
  const tl = gsap.timeline();

  tl.set([selector.heartFace.tinyEyes, selector.heartFace.bigMouth], {
    opacity: 0
  })
    .set(
      [
        selector.heartFace.bigEyes,
        selector.heartFace.tinyMouth,
        selector.heartFace.eyeShine
      ],
      {
        opacity: 1
      }
    )
    .to(selector.heartFace.svg, {
      scale: 8,
      duration: reduceMotion ? 1.5 : duration / 2.5,
      ease: reduceMotion ? "elastic.out(1, 0.6)" : "elastic.out(1.4, 0.3)",
      force3D: false
    })
    .set(
      "html",
      {
        "--color-bg": color.pink,
        onComplete: () => {
          eyeQuiverTimeline.play();
          !reduceMotion && majestySpinTimeline.play();
        }
      },
      "<"
    )
    .set(
      selector.majesty,
      {
        opacity: 0.2
      },
      "<"
    )
    .to(
      selector.heartFace.svg,
      {
        scale: 30,
        duration: reduceMotion ? 0.001 : duration / 9,
        ease: "back.in(2)",
        force3D: false,
        onComplete: () => {
          eyeQuiverTimeline.pause();
          !reduceMotion && majestySpinTimeline.pause();
        }
      },
      `+=${duration / 1.5}`
    )
    .set(selector.majesty, { opacity: 0 })
    .set(selector.heartFace.svg, { opacity: 0 })
    .to("html", {
      "--color-text": color.lite,
      "--color-bg": color.red,
      duration: duration / 8,
      ease: "power2.out"
    });

  return tl;
}

function outroTextAnimation() {
  const tl = gsap.timeline();

  tl.to(selector.outroText, {
    opacity: 1,
    duration: duration / 4
  })
    .to(
      "html",
      {
        "--color-bg": color.dark,
        duration,
        ease: "power3.in"
      },
      "+=1.5"
    )
    .to(
      selector.outroText,
      {
        opacity: 0,
        duration,
        ease: "power3.out"
      },
      "-=1.5"
    );

  return tl;
}

function getCSSVar(color) {
  return getComputedStyle(document.documentElement).getPropertyValue(color);
}

function setUserInputCounters(max) {
  counters.forEach((counter) => {
    counter.querySelector(".count").textContent = 0;
    counter.querySelector(".max-count").textContent = max;
  });
}

function splitText() {
  const split = Splitting();

  // How to Accessibly Split Text: https://css-irl.info/how-to-accessibly-split-text/
  split.forEach((s) => {
    s.el.setAttribute("aria-label", s.el.innerText);
    s.words.forEach((word) => {
      word.setAttribute("aria-hidden", true);
    });
  });
}

function createShareLink() {
  const intro = document.getElementById("user-intro").value;
  const outro = document.getElementById("user-outro").value;
  const url = new URL("https://codepen.io/hexagoncircle/full/PoOberB");

  if (intro) url.searchParams.append("intro", intro);
  if (outro) url.searchParams.append("outro", outro);

  return url;
}

function init() {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("intro")) {
    introTextContainer.textContent = urlParams.get("intro");
  }
  if (urlParams.has("outro")) {
    outroTextContainer.textContent = urlParams.get("outro");
  }

  splitText();
  setUserInputCounters(80);
  globalTimeline
    .add(introTextAnimation())
    .add(heartsAnimation())
    .add(tinyHeartFaceAnimation())
    .add(bigHeartFaceAnimation())
    .add(outroTextAnimation());
}

copyBtn.addEventListener("click", (e) => {
  navigator.clipboard.writeText(createShareLink());
  e.target.classList.add("copied");
  setTimeout(() => e.target.classList.remove("copied"), 1400);
});

toggleBtn.addEventListener("click", (e) => {
  const expanded = e.target.getAttribute("aria-expanded") === "true";

  e.target.setAttribute("aria-expanded", !expanded);
  e.target.parentNode.classList.toggle("expanded");

  globalTimeline.paused(!globalTimeline.paused());
  eyeQuiverTimeline.paused(globalTimeline.paused());
  !reduceMotion && majestySpinTimeline.paused(globalTimeline.paused());
});

userInputs.forEach((el) => {
  const textarea = el.querySelector("textarea");
  const characterCount = el.nextElementSibling;
  const count = characterCount.querySelector(".count");
  const max = characterCount.querySelector(".max-count");

  textarea.addEventListener("input", () => {
    el.dataset.replicatedValue = textarea.value;
    count.textContent = textarea.value.length;
    previewAnchorEl.href = createShareLink();

    characterCount.classList.toggle(
      "at-max",
      count.textContent === max.textContent
    );
    el.classList.toggle("has-value", count.textContent > 0);
  });

  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  });
});

init();
