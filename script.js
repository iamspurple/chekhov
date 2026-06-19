const header = document.querySelector(".header");
const hero = document.querySelector(".hero");

new IntersectionObserver(
  function (entries) {
    header.classList.toggle("dark", !entries[0].isIntersecting);
  },
  { threshold: 0.15 }
).observe(hero);

function formatDate(value) {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  return d + "." + m + "." + y;
}

document.getElementById("checkin").addEventListener("change", function () {
  document.getElementById("checkin-display").textContent = formatDate(this.value);
});

document.getElementById("checkout").addEventListener("change", function () {
  document.getElementById("checkout-display").textContent = formatDate(this.value);
});

document.querySelectorAll(".rooms-tab").forEach(function (tab) {
  tab.addEventListener("click", function () {
    document.querySelectorAll(".rooms-tab").forEach(function (t) {
      t.classList.remove("active");
    });
    this.classList.add("active");
  });
});
