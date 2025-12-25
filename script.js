// Mobile menu
const burger = document.getElementById("burger");
const mobile = document.getElementById("mobile");

function closeMobile(){
  if (!mobile || !burger) return;
  mobile.style.display = "none";
  mobile.setAttribute("aria-hidden", "true");
  burger.setAttribute("aria-expanded", "false");
}

burger?.addEventListener("click", () => {
  const opened = burger.getAttribute("aria-expanded") === "true";
  if (opened) closeMobile();
  else{
    mobile.style.display = "block";
    mobile.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
  }
});

mobile?.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "a") closeMobile();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMobile();
});
document.addEventListener("click", (e) => {
  const t = e.target;
  if (!mobile || !burger) return;
  if (mobile.style.display !== "block") return;
  if (mobile.contains(t) || burger.contains(t)) return;
  closeMobile();
});

// Year
document.getElementById("year").textContent = String(new Date().getFullYear());

// Copy email
const copyBtn = document.getElementById("copyMail");
copyBtn?.addEventListener("click", async () => {
  const mail = "contact@lysis.fr"; // change ici si besoin
  try {
    await navigator.clipboard.writeText(mail);
    copyBtn.textContent = "Copié ✅";
    setTimeout(() => (copyBtn.textContent = "Copier l’email"), 1200);
  } catch {
    window.prompt("Copie l’email :", mail);
  }
});

// Scroll reveal that REPLAYS each time you scroll back into view
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-in");
    else entry.target.classList.remove("is-in");
  });
}, { threshold: 0.18 });

reveals.forEach(el => io.observe(el));

// Animated waveform SVG (procedural)
const paths = {
  a: document.querySelector(".wave__path--a"),
  b: document.querySelector(".wave__path--b"),
  c: document.querySelector(".wave__path--c")
};
const dotsGroup = document.querySelector(".wave__dots");

function makePath(t, amp, freq, yBase){
  // ⚠️ on génère encore sur une largeur "800" (logique),
  // le viewBox élargi du SVG gère la marge pour éviter la coupe.
  const w = 800;
  const points = 64;
  const step = w / points;

  let d = `M 0 ${yBase}`;
  for (let i = 0; i <= points; i++){
    const x = i * step;
    const n1 = Math.sin((i * 0.35) + t * (0.0018 * freq));
    const n2 = Math.sin((i * 0.12) + t * (0.0011 * freq) + 1.7);
    const y = yBase + (n1 * amp) + (n2 * (amp * 0.45));
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

function renderDots(t){
  if (!dotsGroup) return;
  const count = 18;
  const w = 800;

  let out = "";
  for (let i = 0; i < count; i++){
    const x = (w / (count - 1)) * i;
    const y = 130 + Math.sin((i * 0.35) + t * 0.003) * 26;
    const r = 2.2 + (Math.sin(t * 0.005 + i) + 1) * 0.55;
    out += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r.toFixed(2)}" fill="rgba(234,240,255,.9)"/>`;
  }
  dotsGroup.innerHTML = out;
}

function tick(t){
  if (paths.a) paths.a.setAttribute("d", makePath(t, 34, 1.0, 120));
  if (paths.b) paths.b.setAttribute("d", makePath(t, 22, 1.35, 132));
  if (paths.c) paths.c.setAttribute("d", makePath(t, 14, 1.7, 144));
  renderDots(t);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// Update mailto body from mock form inputs
const mailtoBtn = document.getElementById("mailtoBtn");
const f1 = document.getElementById("f1");
const f2 = document.getElementById("f2");
const f3 = document.getElementById("f3");

function updateMailto(){
  const name = encodeURIComponent((f1?.value || "").trim());
  const proj = encodeURIComponent((f2?.value || "").trim());
  const msg  = encodeURIComponent((f3?.value || "").trim());

  const body =
    `Bonjour,%0A%0AJe m’appelle ${name || "..."}%0A` +
    `Projet : ${proj || "..."}%0A%0A` +
    `${msg || "Message : ..."}%0A%0AMerci !`;

  const email = "contact@lysis.fr"; // change ici si besoin
  if (mailtoBtn) mailtoBtn.href = `mailto:${email}?subject=Demande%20-%20Lysis&body=${body}`;
}

[f1,f2,f3].forEach(el => el?.addEventListener("input", updateMailto));
updateMailto();
