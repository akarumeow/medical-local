const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navClose = document.querySelector(".nav-close");

const setMenuState = (opened) => {
  navLinks.classList.toggle("open", opened);
  menuToggle?.setAttribute("aria-expanded", String(opened));
  document.body.classList.toggle("menu-open", opened);
};

menuToggle?.addEventListener("click", () => {
  const opened = !navLinks.classList.contains("open");
  setMenuState(opened);
});

navClose?.addEventListener("click", () => setMenuState(false));

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => setMenuState(false));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 600) {
    setMenuState(false);
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelector("#contactForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const status = document.querySelector("#formStatus");
  button.disabled = true;
  status.hidden = true;
  status.classList.remove("is-error");

  try {
    const response = await fetch(form.action, {
      method: form.method,
      headers: { Accept: "application/json" },
      body: new URLSearchParams(new FormData(form))
    });
    const responseText = await response.text();
    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(`Сервис вернул неожиданный ответ (HTTP ${response.status}). Проверьте настройки FormSubmit и попробуйте позже.`);
    }

    if (!response.ok || (result.success !== "true" && result.success !== true)) {
      throw new Error(result.message || `Сервис не смог принять заявку (HTTP ${response.status}).`);
    }

    status.textContent = "Заявка передана FormSubmit. Если адрес ещё не подтверждён, проверьте почту ee140214@gmail.com и подтвердите его, чтобы включить приём заявок.";
    form.reset();
  } catch (error) {
    console.error("Не удалось отправить заявку:", error);
    status.textContent = error instanceof TypeError
      ? "Не удалось связаться с FormSubmit. Проверьте подключение к интернету или попробуйте позже."
      : error.message || "Не удалось отправить заявку. Попробуйте позже.";
    status.classList.add("is-error");
  } finally {
    status.hidden = false;
    button.disabled = false;
  }
});
