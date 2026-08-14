/* ============================================
   CONFIG - CHANGE THESE VALUES FOR FLORENCE
   ============================================ */
const CONFIG = {
  herName: "Florence",
  birthdayMonth: "August",   // must match one of the month button labels exactly
  myName: "Dumisa",       // <-- put your real name here
  caseId: "FLR-0826",
  photoPath: "assets/our-photo.jpg",
  finalMessage:
`Florence,

If you've made it this far, congratulations.

You successfully investigated the case.

Although... I may have made the investigation slightly unfair. 

I wanted to make you something instead of just sending you another ordinary "Happy Birthday."

You're someone who is genuinely curious about the world, who enjoys discovering things, solving little mysteries, and getting excited about things that most people wouldn't even notice.

So I thought... why not give you a little mystery of your own?

I hope this birthday brings you beautiful moments, unexpected adventures, and plenty of reasons to smile.

And selfishly... I hope I get to be part of some of those moments.

Happy Birthday, Florence.

You are definitely someone worth getting to know, one mystery at a time.

- {{MYNAME}}`
};
/* ============================================
   END CONFIG
   ============================================ */

const MONTHS = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];

const SUSPECTS = [
  { id: "SUSPECT_01", threat: "LOW", behavior: [
      "Has access to the internet",
      "Knows Florence",
      "Has suspicious intentions"
  ]},
  { id: "SUSPECT_02", threat: "MEDIUM", behavior: [
      "Has excellent taste",
      "Knows Florence's birthday",
      "May have been planning something"
  ]},
  { id: "SUSPECT_03", threat: "EXTREMELY SUSPICIOUS", behavior: [
      "Knows Florence",
      "Wanted to make her smile",
      "Has been thinking about her",
      "Built this entire system"
  ]}
];

let suspectIndex = 0;
let audioUnlocked = false;

function $(id) { return document.getElementById(id); }

function playSound(id) {
  if (!audioUnlocked) return;
  const el = $(id);
  if (!el) return;
  try {
    el.currentTime = 0;
    el.play().catch(() => {});
  } catch (e) {}
}

function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  ["audio-boot","audio-typing","audio-click","audio-success","audio-error","audio-reveal"].forEach(id => {
    const el = $(id);
    if (!el) return;
    el.volume = 0.5;
    el.play().then(() => { el.pause(); el.currentTime = 0; }).catch(() => {});
  });
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo(0, 0);
}

function typeLines(el, lines, speed = 18, lineDelay = 250) {
  return new Promise(resolve => {
    el.textContent = "";
    let li = 0, ci = 0;

    function typeChar() {
      const line = lines[li];
      if (ci === 0 && li > 0) el.textContent += "\n";
      if (ci < line.length) {
        el.textContent += line[ci];
        ci++;
        if (ci % 3 === 0) playSound("audio-typing");
        setTimeout(typeChar, speed);
      } else {
        li++;
        ci = 0;
        if (li < lines.length) {
          setTimeout(typeChar, lineDelay);
        } else {
          resolve();
        }
      }
    }
    typeChar();
  });
}

async function runBoot() {
  const lines = [
    "[ SYSTEM BOOT ]",
    "",
    "Initializing secure environment...",
    "Loading investigation modules...... OK",
    "Loading encrypted birthday file... OK",
    "Establishing connection........... OK",
    "",
    "WARNING:",
    "This system contains information",
    "intended for one person only.",
    "",
    "IDENTITY VERIFICATION REQUIRED."
  ];
  await typeLines($("boot-terminal"), lines, 14, 180);
  $("name-input-wrap").classList.remove("hidden");
  $("name-input").focus();
}

$("btn-verify").addEventListener("click", () => {
  unlockAudio();
  playSound("audio-click");
  const val = $("name-input").value.trim();
  if (!val) {
    $("name-input").focus();
    return;
  }
  $("name-input-wrap").classList.add("hidden");
  showScreen("screen-verify");
  runVerify(val);
});

$("name-input").addEventListener("keydown", e => {
  if (e.key === "Enter") $("btn-verify").click();
});

async function runVerify(nameTyped) {
  const displayName = nameTyped.toUpperCase();
  const lines = [
    "> Searching database...",
    "",
    `> ${displayName} found.`,
    "",
    "IDENTITY:",
    displayName,
    "",
    "STATUS:",
    "VERIFIED",
    "",
    "ACCESS LEVEL:",
    "SUBJECT",
    "",
    `WELCOME, ${displayName}.`,
    "",
    "There is a case waiting for you.",
    "",
    "CASE ID:",
    CONFIG.caseId
  ];
  await typeLines($("verify-terminal"), lines, 12, 160);
  playSound("audio-success");
  $("btn-open-case").classList.remove("hidden");
  $("case-subject").textContent = displayName;
  $("case-id-display").textContent = CONFIG.caseId;
}

$("btn-open-case").addEventListener("click", () => {
  playSound("audio-click");
  showScreen("screen-case");
});

$("btn-start-investigation").addEventListener("click", () => {
  playSound("audio-click");
  showScreen("screen-birthday");
  buildMonthGrid();
});

function buildMonthGrid() {
  const grid = $("month-grid");
  grid.innerHTML = "";
  MONTHS.forEach(month => {
    const btn = document.createElement("button");
    btn.className = "month-btn";
    btn.textContent = month;
    btn.addEventListener("click", () => handleMonthPick(month, btn));
    grid.appendChild(btn);
  });
}

async function handleMonthPick(month, btnEl) {
  playSound("audio-click");
  const correct = month.toUpperCase() === CONFIG.birthdayMonth.toUpperCase();
  document.querySelectorAll(".month-btn").forEach(b => b.disabled = true);

  if (correct) {
    btnEl.classList.add("correct");
    playSound("audio-success");
    const lines = [
      "> Birthday month confirmed.",
      "",
      "SUBJECT PROFILE:",
      "MATCH",
      "",
      "One more thing...",
      "",
      "The system seems to know",
      "more about you than expected."
    ];
    await typeLines($("birthday-terminal"), lines, 12, 160);
    $("btn-continue-trace").classList.remove("hidden");
  } else {
    btnEl.classList.add("wrong");
    playSound("audio-error");
    const lines = [
      "> Verification failed.",
      "",
      "That doesn't look right.",
      "",
      "Try again."
    ];
    await typeLines($("birthday-terminal"), lines, 12, 140);
    setTimeout(() => {
      document.querySelectorAll(".month-btn").forEach(b => {
        b.disabled = false;
        b.classList.remove("wrong");
      });
      $("birthday-terminal").textContent = "";
    }, 1400);
  }
}

$("btn-continue-trace").addEventListener("click", () => {
  playSound("audio-click");
  showScreen("screen-trace");
  runTrace();
});

async function runTrace() {
  $("trace-progress").style.width = "0%";
  const lines = [
    "[ TRACE MODE ]",
    "",
    "Searching for the person",
    "behind the birthday file...",
    "",
    "Scanning..."
  ];
  await typeLines($("trace-terminal"), lines, 14, 180);

  let pct = 0;
  await new Promise(resolve => {
    const interval = setInterval(() => {
      pct += 4;
      $("trace-progress").style.width = Math.min(pct, 100) + "%";
      if (pct >= 100) {
        clearInterval(interval);
        resolve();
      }
    }, 40);
  });

  playSound("audio-success");
  $("trace-terminal").textContent += "\n\n3 possible suspects detected.";
  $("btn-investigate-suspects").classList.remove("hidden");
}

$("btn-investigate-suspects").addEventListener("click", () => {
  playSound("audio-click");
  suspectIndex = 0;
  showScreen("screen-suspects");
  renderSuspect();
});

function renderSuspect() {
  const s = SUSPECTS[suspectIndex];
  $("suspect-id").textContent = s.id;
  $("threat-level").textContent = s.threat;
  const list = $("suspect-list");
  list.innerHTML = "";
  s.behavior.forEach(b => {
    const li = document.createElement("li");
    li.textContent = b;
    list.appendChild(li);
  });
  $("btn-next-suspect").textContent = suspectIndex === SUSPECTS.length - 1 ? "IDENTIFY SUSPECT" : "NEXT SUSPECT";
}

$("btn-next-suspect").addEventListener("click", () => {
  playSound("audio-click");
  suspectIndex++;
  if (suspectIndex < SUSPECTS.length) {
    renderSuspect();
  } else {
    showScreen("screen-reveal");
    runReveal();
  }
});

async function runReveal() {
  const lines = [
    "> Running analysis...",
    "",
    "> Comparing known individuals...",
    "",
    "> Searching relationship data...",
    "",
    "> Match found.",
    "",
    "IDENTITY CONFIRMED."
  ];
  await typeLines($("reveal-terminal"), lines, 14, 220);
  playSound("audio-reveal");
  $("reveal-name").textContent = CONFIG.myName;
  $("reveal-name").classList.remove("hidden");
  await new Promise(r => setTimeout(r, 600));
  $("reveal-terminal").textContent += "\n\nMOTIVE:\nCLASSIFIED";
  $("btn-reveal-motive").classList.remove("hidden");
}

$("btn-reveal-motive").addEventListener("click", () => {
  playSound("audio-click");
  showScreen("screen-decrypt");
  runDecrypt();
});

async function runDecrypt() {
  const lines = [
    "ACCESSING FINAL FILE...",
    "",
    "FILE:",
    "why.florence",
    "",
    "STATUS:",
    "ENCRYPTED",
    "",
    "Decrypting..."
  ];
  await typeLines($("decrypt-terminal"), lines, 14, 180);

  const steps = [12, 34, 67, 91, 100];
  for (const pct of steps) {
    await new Promise(r => setTimeout(r, 260));
    $("decrypt-progress").style.width = pct + "%";
    $("decrypt-terminal").textContent += `\n${pct}%`;
  }
  await new Promise(r => setTimeout(r, 400));
  playSound("audio-success");
  $("decrypt-terminal").textContent += "\n\nDECRYPTION COMPLETE.";
  document.documentElement.style.setProperty("--accent", "var(--pink)");

  await new Promise(r => setTimeout(r, 900));
  showScreen("screen-message");
  runMessage();
}

async function runMessage() {
  const el = $("message-text");
  el.textContent = "";
  const fullText = CONFIG.finalMessage.replace("{{MYNAME}}", CONFIG.myName);
  const chars = fullText.split("");
  let i = 0;
  await new Promise(resolve => {
    function step() {
      if (i < chars.length) {
        el.textContent += chars[i];
        i++;
        setTimeout(step, 8);
      } else {
        resolve();
      }
    }
    step();
  });
  $("btn-close-case").classList.remove("hidden");
}

$("btn-close-case").addEventListener("click", () => {
  playSound("audio-click");
  showScreen("screen-closed");
  runClosed();
});

async function runClosed() {
  const lines1 = [
    "CLOSING CASE...",
    "",
    "Saving investigation..."
  ];
  await typeLines($("closed-terminal"), lines1, 14, 200);

  const bar = "\n\n[####################] 100%";
  $("closed-terminal").textContent += bar;
  await new Promise(r => setTimeout(r, 500));
  playSound("audio-success");

  $("closed-terminal").textContent += "\n\nCASE CLOSED.\n\nBut...";
  await new Promise(r => setTimeout(r, 1200));
  $("closed-terminal").textContent += "\n\nsome investigations\nare worth continuing.";
  $("btn-continue-final").classList.remove("hidden");
}

$("btn-continue-final").addEventListener("click", () => {
  playSound("audio-click");
  showScreen("screen-final");
});

window.addEventListener("DOMContentLoaded", () => {
  runBoot();
});