const WHOP_PAYMENT_URL = "https://whop.com/pay/avishi-shreya";

const track = document.getElementById("track");
const slides = Array.from(document.querySelectorAll("[data-slide]"));
const progressFill = document.getElementById("progressFill");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const likeBtn = document.getElementById("likeBtn");
const likeCount = document.getElementById("likeCount");
const commentBtn = document.getElementById("commentBtn");
const commentCount = document.getElementById("commentCount");
const shareBtn = document.getElementById("shareBtn");
const saveBtn = document.getElementById("saveBtn");
const vinyl = document.getElementById("vinyl");
const bigHeart = document.getElementById("bigHeart");

const commentSheet = document.getElementById("commentSheet");
const shareSheet = document.getElementById("shareSheet");
const backdrop = document.getElementById("sheetBackdrop");
const commentList = document.getElementById("commentList");
const commentInput = document.getElementById("commentInput");
const commentPost = document.getElementById("commentPost");

const COMMENTS = [
  [{ user: "@dev.maya", text: "okay this intro is so smooth", likes: 42 }, { user: "@codesen", text: "the typing effect?? obsessed", likes: 18 }, { user: "@hiringmgr", text: "impressive. are you open to work?", likes: 7 }],
  [{ user: "@productguru", text: "product-minded AND ships fast? rare combo", likes: 31 }, { user: "@web3watcher", text: "whale watching, love it", likes: 12 }],
  [{ user: "@solana_dev", text: "solana + ocr + qa?? unstoppable", likes: 56 }, { user: "@css_witch", text: "that skill marquee though", likes: 23 }],
  [{ user: "@ml_engineer", text: "93.75% with NO ml libraries?? teach me", likes: 89 }, { user: "@pythonista", text: "pixel-vector matching is clever", likes: 15 }],
  [{ user: "@evdriver", text: "ev charging + solana, what a combo", likes: 27 }, { user: "@perfnerd", text: "LCP under 2.5s. perf queen", likes: 34 }],
  [{ user: "@retrodev", text: "a windows hta in 2023, respect", likes: 19 }, { user: "@regexranger", text: "regex clipboard go brrr", likes: 8 }],
  [{ user: "@nftdegen", text: "<50ms whale tracking is insane", likes: 44 }, { user: "@originsnft", text: "the origins looking good", likes: 11 }],
  [{ user: "@nielitgang", text: "nielit gang where you at", likes: 16 }, { user: "@carmelite", text: "carmel school represent", likes: 9 }],
  [{ user: "@collabs", text: "invoice sent. let's talk", likes: 5 }, { user: "@designerdy", text: "that gradient button is everything", likes: 21 }, { user: "@recruiterraj", text: "sending this to my team", likes: 13 }],
];

const state = slides.map((s, i) => ({
  likes: parseInt(s.dataset.likes, 10),
  liked: false,
  saved: false,
  comments: COMMENTS[i].length,
  userComments: [],
}));

let current = -1;
let scrollTimer = null;
let sheetOpen = false;

function goTo(i) {
  i = Math.max(0, Math.min(slides.length - 1, i));
  track.scrollTo({ top: i * track.clientHeight, behavior: reducedMotion ? "auto" : "smooth" });
}

function activeIndex() {
  return Math.round(track.scrollTop / track.clientHeight);
}

function update() {
  const i = activeIndex();
  progressFill.style.width = ((i + 1) / slides.length) * 100 + "%";
  const st = state[i];
  likeCount.textContent = st.likes;
  likeBtn.classList.toggle("active", st.liked);
  commentCount.textContent = st.comments;
  saveBtn.classList.toggle("saved", st.saved);
  if (i !== current) {
    current = i;
    slides.forEach((s, j) => s.classList.toggle("active", j === i));
    runCounters(slides[i]);
  }
}

track.addEventListener("scroll", () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(update, 40);
}, { passive: true });

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeSheets(); return; }
  if (sheetOpen) return;
  if (["ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); goTo(activeIndex() + 1); }
  else if (["ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); goTo(activeIndex() - 1); }
  else if (e.key === "Home") goTo(0);
  else if (e.key === "End") goTo(slides.length - 1);
});

let touchY = null;
track.addEventListener("touchstart", e => { touchY = e.touches[0].clientY; }, { passive: true });
track.addEventListener("touchend", e => {
  if (sheetOpen || touchY === null) return;
  const dy = touchY - e.changedTouches[0].clientY;
  if (Math.abs(dy) > 60) goTo(activeIndex() + (dy > 0 ? 1 : -1));
  touchY = null;
}, { passive: true });

const WORDS = ["full-stack dev", "android builder", "qa automation", "ai explorer", "web3 degen", "ocr tinkerer"];
const rotator = document.getElementById("rotator");
let wordIdx = 0;
function cycleWord() {
  rotator.classList.remove("swap");
  void rotator.offsetWidth;
  rotator.textContent = WORDS[wordIdx % WORDS.length];
  rotator.classList.add("swap");
  wordIdx++;
}
rotator.textContent = WORDS[0];
setInterval(() => { if (!document.hidden) cycleWord(); }, 2400);

function runCounters(slide) {
  slide.querySelectorAll(".counter").forEach(el => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    if (reducedMotion) { el.textContent = target.toFixed(decimals); return; }
    const start = performance.now();
    const dur = 1200;
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

document.querySelectorAll(".tilt").forEach(card => {
  if (reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  card.addEventListener("pointerleave", () => { card.style.transform = ""; });
});

function popIcon(btn) {
  btn.classList.remove("pop");
  void btn.offsetWidth;
  btn.classList.add("pop");
}

likeBtn.addEventListener("click", () => {
  const st = state[activeIndex()];
  st.liked = !st.liked;
  st.likes += st.liked ? 1 : -1;
  update();
  popIcon(likeBtn);
});

saveBtn.addEventListener("click", () => {
  const st = state[activeIndex()];
  st.saved = !st.saved;
  update();
  popIcon(saveBtn);
});

let lastTap = 0;
track.addEventListener("pointerup", e => {
  if (sheetOpen) return;
  if (e.target.closest("a, button, input, .sheet, .more-btn")) return;
  const now = Date.now();
  if (now - lastTap < 300) {
    const st = state[activeIndex()];
    if (!st.liked) { st.liked = true; st.likes++; update(); }
    showBigHeart();
  }
  lastTap = now;
});

function showBigHeart() {
  if (reducedMotion) return;
  bigHeart.classList.remove("show");
  void bigHeart.offsetWidth;
  bigHeart.classList.add("show");
}

function openSheet(which) {
  sheetOpen = true;
  commentSheet.classList.toggle("open", which === "comment");
  shareSheet.classList.toggle("open", which === "share");
  backdrop.classList.add("open");
  track.style.overflowY = "hidden";
  if (which === "comment") renderComments();
}

function closeSheets() {
  sheetOpen = false;
  commentSheet.classList.remove("open");
  shareSheet.classList.remove("open");
  backdrop.classList.remove("open");
  track.style.overflowY = "";
}

commentBtn.addEventListener("click", () => openSheet("comment"));
shareBtn.addEventListener("click", () => openSheet("share"));
backdrop.addEventListener("click", closeSheets);
document.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", closeSheets));

function renderComments() {
  const st = state[activeIndex()];
  const all = [...COMMENTS[activeIndex()], ...st.userComments.map(c => ({ ...c, you: true }))];
  commentList.innerHTML = all.map(c => `
    <div class="comment">
      <div class="comment-avatar">${c.user[1].toUpperCase()}</div>
      <div class="comment-body">
        <b>${c.you ? "you" : c.user}</b>
        <p>${c.text}</p>
      </div>
      <span class="comment-likes">♥ ${c.likes || ""}</span>
    </div>`).join("");
}

function postComment() {
  const text = commentInput.value.trim();
  if (!text) return;
  const st = state[activeIndex()];
  st.userComments.push({ user: "you", text, likes: 0 });
  st.comments++;
  commentInput.value = "";
  renderComments();
  update();
}
commentPost.addEventListener("click", postComment);
commentInput.addEventListener("keydown", e => { if (e.key === "Enter") postComment(); });

const copyLink = document.getElementById("copyLink");
copyLink.addEventListener("click", async () => {
  const original = "copy link";
  try {
    await navigator.clipboard.writeText(location.href);
    copyLink.textContent = "copied!";
  } catch {
    copyLink.textContent = location.href;
  }
  setTimeout(() => { copyLink.textContent = original; }, 1600);
});

const shareUrl = () => encodeURIComponent(location.href);
const shareText = () => encodeURIComponent("Avishi Shreya — SDE portfolio");
document.getElementById("shareX").href = `https://twitter.com/intent/tweet?text=${shareText()}&url=${shareUrl()}`;
document.getElementById("shareLinkedin").href = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl()}`;
document.getElementById("shareWhatsapp").href = `https://wa.me/?text=${shareText()}%20${shareUrl()}`;

vinyl.addEventListener("click", () => vinyl.classList.toggle("paused"));

document.getElementById("invoiceBtn").href = WHOP_PAYMENT_URL;

document.querySelectorAll(".more-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const cap = btn.closest(".caption-text");
    cap.classList.toggle("expanded");
    btn.textContent = cap.classList.contains("expanded") ? "less" : "more";
  });
});

update();
