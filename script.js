const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
  const opened = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", opened);
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
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
      body: new URLSearchParams(new FormData(form))
    });
    const result = await response.json();

    if (!response.ok || (result.success !== "true" && result.success !== true)) {
      throw new Error(result.message || "Сервис не смог принять заявку.");
    }

    status.textContent = "Заявка передана FormSubmit. Если адрес ещё не подтверждён, проверьте почту ee140214@gmail.com и подтвердите его, чтобы включить приём заявок.";
    form.reset();
  } catch (error) {
    console.error("Не удалось отправить заявку:", error);
    status.textContent = "Не удалось отправить заявку. Проверьте подключение к интернету и попробуйте ещё раз.";
    status.classList.add("is-error");
  } finally {
    status.hidden = false;
    button.disabled = false;
  }
});
