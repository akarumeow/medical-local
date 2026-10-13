const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navClose = document.querySelector(".nav-close");

const formMessages = {
  ru: {
    unexpected: "Сервис вернул неожиданный ответ. Проверьте настройки FormSubmit и попробуйте позже.",
    rejected: "Сервис не смог принять заявку. Попробуйте позже.",
    sent: "Заявка передана FormSubmit. Если адрес ещё не подтверждён, проверьте почту ee140214@gmail.com и подтвердите его, чтобы включить приём заявок.",
    network: "Не удалось связаться с FormSubmit. Проверьте подключение к интернету или попробуйте позже.",
    failed: "Не удалось отправить заявку. Попробуйте позже."
  },
  en: {
    unexpected: "The service returned an unexpected response. Check your FormSubmit settings and try again later.",
    rejected: "The service could not accept your enquiry. Please try again later.",
    sent: "Your enquiry was sent to FormSubmit. If the address has not yet been verified, check ee140214@gmail.com and confirm it to enable submissions.",
    network: "Could not connect to FormSubmit. Check your internet connection or try again later.",
    failed: "Could not send your enquiry. Please try again later."
  },
  ro: {
    unexpected: "Serviciul a returnat un răspuns neașteptat. Verificați setările FormSubmit și încercați din nou mai târziu.",
    rejected: "Serviciul nu a putut accepta solicitarea. Încercați din nou mai târziu.",
    sent: "Solicitarea a fost trimisă către FormSubmit. Dacă adresa nu a fost încă verificată, verificați ee140214@gmail.com și confirmați-o pentru a activa primirea solicitărilor.",
    network: "Nu s-a putut realiza conexiunea cu FormSubmit. Verificați conexiunea la internet sau încercați din nou mai târziu.",
    failed: "Solicitarea nu a putut fi trimisă. Încercați din nou mai târziu."
  }
};

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

const serviceFilters = document.querySelectorAll("[data-service-filter]");
const serviceGroups = document.querySelectorAll("[data-service-group]");

serviceFilters.forEach(filter => {
  filter.addEventListener("click", () => {
    const selectedGroup = filter.dataset.serviceFilter;

    serviceFilters.forEach(button => {
      const isSelected = button === filter;
      button.classList.toggle("is-active", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });

    serviceGroups.forEach(group => {
      group.hidden = selectedGroup !== "all" && group.dataset.serviceGroup !== selectedGroup;
    });
  });
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
      throw new Error(`${formMessages[window.currentSiteLanguage || "ru"].unexpected} (HTTP ${response.status}).`);
    }

    if (!response.ok || (result.success !== "true" && result.success !== true)) {
      throw new Error(result.message || `${formMessages[window.currentSiteLanguage || "ru"].rejected} (HTTP ${response.status}).`);
    }

    status.textContent = formMessages[window.currentSiteLanguage || "ru"].sent;
    form.reset();
  } catch (error) {
    console.error("Не удалось отправить заявку:", error);
    status.textContent = error instanceof TypeError
      ? formMessages[window.currentSiteLanguage || "ru"].network
      : error.message || formMessages[window.currentSiteLanguage || "ru"].failed;
    status.classList.add("is-error");
  } finally {
    status.hidden = false;
    button.disabled = false;
  }
});
