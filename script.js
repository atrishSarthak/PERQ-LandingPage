import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/all";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(CustomEase, SplitText, ScrollTrigger);
CustomEase.create("hop", "0.8, 0, 0.2, 1");
CustomEase.create("hop2", "0.9, 0, 0.1, 1");

const lenis = new Lenis({ autoRaf: false, duration: 1.2 });
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
ScrollTrigger.refresh();

const splitText = (selector, type, className, mask = true) => {
  return SplitText.create(selector, {
    type: type,
    [`${type}Class`]: className,
    ...(mask && { mask: type }),
  });
};

const preloaderHeaderSplit = splitText(".preloader-header h1", "chars", "char");
const navSplit = splitText("nav a", "words", "word");
const headerSplit = splitText(".header h1", "chars", "char", false);
const footerSplit = splitText(".hero-footer p", "words", "word");

const preloaderImgInitRotations = [7.5, -2.5, -10, 12.5, -5, 5];
gsap.set(".preloader-img", {
  rotate: (i) => preloaderImgInitRotations[i],
});

const tl = gsap.timeline({ delay: 0.5 });

tl.to(".preloader-img", {
  scale: 1,
  clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  duration: 1,
  ease: "hop",
  stagger: 0.2,
});

tl.to(
  ".preloader-header h1 .char",
  {
    y: "0%",
    duration: 1,
    ease: "hop2",
    stagger: { each: 0.125, from: "random" },
  },
  "0.35",
);

tl.to(
  ".preloader-counter p",
  {
    y: "0%",
    duration: 1,
    ease: "hop2",
    onStart: () => {
      const counterEl = document.querySelector(".preloader-counter p");
      const counter = { value: 0 };

      gsap.to(counter, {
        value: 100,
        duration: 2,
        delay: 0.5,
        ease: "power2.inOut",
        onUpdate: () => {
          counterEl.textContent = String(Math.round(counter.value)).padStart(
            3,
            "0",
          );
        },
      });
    },
  },
  "<",
);

tl.to(
  ".preloader-counter p",
  {
    y: "-100%",
    duration: 0.75,
    ease: "hop2",
  },
  3.25,
);

tl.to(
  ".preloader-header h1 .char",
  {
    y: "-100%",
    duration: 0.75,
    ease: "hop2",
    stagger: { each: 0.125, from: "random" },
  },
  3.25,
);

tl.to(
  ".preloader-images .preloader-img",
  {
    scale: 0,
    clipPath: "polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)",
    duration: 1,
    ease: "hop2",
    stagger: -0.075,
  },
  3.5,
);

tl.to(
  ".preloader",
  {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    duration: 1,
    ease: "hop2",
  },
  4.35,
);

tl.to(
  ".header h1 .char",
  {
    y: "0%",
    duration: 1,
    ease: "hop",
    stagger: { each: 0.075, from: "random" },
  },
  4.65,
);

tl.to(
  "nav a .word",
  {
    y: "0%",
    duration: 1,
    ease: "hop",
    stagger: 0.075,
  },
  4.75,
);

tl.to(
  ".hero-footer p .word",
  {
    y: "0%",
    duration: 1,
    ease: "hop",
    stagger: 0.075,
  },
  4.75,
);

/* ---------- Stickygrid (MIMIR) ---------- */

const visionData = [
  { heading: "Design", index: 0 },
  { heading: "Innovation", index: 1 },
  { heading: "Enhancement", index: 2 },
];

const gridDuration = 0.8;
const gridPause = 0.5;
const gridStagger = 0.05;
const easeLine = "none";
const easeHead = "power1.inOut";

const dim = "rgba(255,255,255,0.2)";
const bright = "rgba(255,255,255,1)";

const getHeadingX = (i) => {
  const items = gsap.utils.toArray(".heading-item");
  return items[i] ? -items[i].offsetLeft : 0;
};

const descSplits = visionData.map((_, idx) =>
  SplitText.create(`.desc-block-${idx}`, {
    type: "lines",
    linesClass: "split-line",
    mask: "lines",
  }),
);
descSplits.forEach((s) => gsap.set(s.lines, { yPercent: 100 }));

gsap.set(".heading-item", { color: dim });
gsap.set(".heading-item-0", { color: bright });
gsap.set(".moving-heading", { force3D: true, transformOrigin: "0% 50%" });

gsap.utils.toArray(".grid-image").forEach((el) => {
  gsap.to(el, {
    yPercent: parseFloat(el.dataset.speed) * 50,
    ease: "none",
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});

const pinTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".pin-wrapper",
    start: "center center",
    end: "+=600%",
    scrub: 0.55,
    pin: true,
    invalidateOnRefresh: true,
  },
});

pinTl
  .to(".target", {
    width: "100vw",
    height: "100vh",
    marginLeft: 0,
    borderRadius: 0,
    ease: "none",
    duration: 1,
  })
  .to(".center-text", { opacity: 0, duration: 1 }, "<")
  .to(".target-overlay", { opacity: 1, duration: 0.2 })
  .to(descSplits[0].lines, {
    yPercent: 0,
    stagger: gridStagger,
    duration: gridDuration,
    ease: easeLine,
  })
  .to({}, { duration: gridPause });

for (let s = 0; s < visionData.length - 1; s++) {
  const next = s + 1;
  const label = `slide${next + 1}`;
  pinTl.addLabel(label);
  pinTl
    .to(".moving-heading", { x: () => getHeadingX(next), duration: gridDuration, ease: easeHead }, label)
    .to(descSplits[s].lines, { yPercent: -100, stagger: gridStagger, duration: gridDuration, ease: easeLine }, label)
    .to(`.heading-item-${s}`, { color: dim, duration: gridDuration }, label)
    .to(`.heading-item-${next}`, { color: bright, duration: gridDuration }, label)
    .to(descSplits[next].lines, { yPercent: 0, stagger: gridStagger, duration: gridDuration, ease: easeLine }, label);
  pinTl.to({}, { duration: gridPause });
}

window.addEventListener("load", () => ScrollTrigger.refresh());

