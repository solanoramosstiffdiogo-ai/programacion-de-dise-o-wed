
document.addEventListener("DOMContentLoaded", () => {
  // =====================================
  // 1. MENÚ PARA CELULARES Y TABLETS
  // =====================================
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const abierto = nav.classList.toggle("open");

      menuButton.setAttribute("aria-expanded", String(abierto));
      menuButton.setAttribute(
        "aria-label",
        abierto ? "Cerrar menú" : "Abrir menú"
      );
    });

    nav.querySelectorAll("a").forEach((enlace) => {
      enlace.addEventListener("click", () => {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menú");
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  // =====================================
  // 2. ANIMACIONES AL DESPLAZARSE
  // =====================================
  const elementos = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver(
      (entradas, observer) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
            observer.unobserve(entrada.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    elementos.forEach((elemento) => {
      observador.observe(elemento);
    });
  } else {
    elementos.forEach((elemento) => {
      elemento.classList.add("visible");
    });
  }

  // =====================================
  // 3. CARRUSEL AUTOMÁTICO DE IMÁGENES
  // =====================================
  const carrusel = document.querySelector(".visual-carousel");

  if (carrusel) {
    const diapositivas = [
      ...carrusel.querySelectorAll(".visual-slide")
    ];

    const puntos = [
      ...carrusel.querySelectorAll(".carousel-dot")
    ];

    const anterior = carrusel.querySelector(".carousel-prev");
    const siguiente = carrusel.querySelector(".carousel-next");

    let indiceActual = 0;
    let temporizador = null;

    const mostrarDiapositiva = (nuevoIndice) => {
      if (!diapositivas.length) return;

      indiceActual =
        (nuevoIndice + diapositivas.length) % diapositivas.length;

      diapositivas.forEach((diapositiva, indice) => {
        const activa = indice === indiceActual;

        diapositiva.classList.toggle("active", activa);
        diapositiva.setAttribute("aria-hidden", String(!activa));
      });

      puntos.forEach((punto, indice) => {
        const activo = indice === indiceActual;

        punto.classList.toggle("active", activo);
        punto.setAttribute("aria-current", activo ? "true" : "false");
      });
    };

    const detenerCarrusel = () => {
      if (temporizador) {
        clearInterval(temporizador);
        temporizador = null;
      }
    };

    const iniciarCarrusel = () => {
      detenerCarrusel();

      if (
        diapositivas.length > 1 &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        temporizador = setInterval(() => {
          mostrarDiapositiva(indiceActual + 1);
        }, 5000);
      }
    };

    anterior?.addEventListener("click", () => {
      mostrarDiapositiva(indiceActual - 1);
      iniciarCarrusel();
    });

    siguiente?.addEventListener("click", () => {
      mostrarDiapositiva(indiceActual + 1);
      iniciarCarrusel();
    });

    puntos.forEach((punto, indice) => {
      punto.addEventListener("click", () => {
        mostrarDiapositiva(indice);
        iniciarCarrusel();
      });
    });

    carrusel.addEventListener("mouseenter", detenerCarrusel);
    carrusel.addEventListener("mouseleave", iniciarCarrusel);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        detenerCarrusel();
      } else {
        iniciarCarrusel();
      }
    });

    mostrarDiapositiva(0);
    iniciarCarrusel();
  }

  // =====================================
  // 4. FILTROS DEL PORTAFOLIO
  // =====================================
  const botonesFiltro = document.querySelectorAll(".filter-btn");
  const proyectos = document.querySelectorAll(".project-card");

  botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
      const categoria = boton.dataset.filter;

      botonesFiltro.forEach((otro) => {
        otro.classList.toggle("active", otro === boton);
      });

      proyectos.forEach((proyecto) => {
        const coincide =
          categoria === "todos" ||
          proyecto.dataset.category === categoria;

        proyecto.hidden = !coincide;
      });
    });
  });

  // =====================================
  // 5. FORMULARIO DE CONTACTO
  // =====================================
  const formulario = document.querySelector("#contact-form");

  if (formulario) {
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();

      const datos = new FormData(formulario);

      const nombre = String(datos.get("nombre") || "").trim();
      const negocio = String(datos.get("negocio") || "").trim();
      const servicio = String(datos.get("servicio") || "").trim();
      const mensaje = String(datos.get("mensaje") || "").trim();

      if (!nombre || !servicio) {
        alert("Completa tu nombre y selecciona un servicio.");
        return;
      }

      const asunto = encodeURIComponent(
        `Consulta web de ${nombre}`
      );

      const cuerpo = encodeURIComponent(
        `Hola Stiff, quiero consultar sobre un proyecto web.\n\n` +
        `Nombre: ${nombre}\n` +
        `Negocio o marca: ${negocio || "No indicado"}\n` +
        `Servicio: ${servicio}\n\n` +
        `Detalles del proyecto:\n${mensaje || "Quisiera conversar sobre mi idea."}\n\n` +
        `Enviado desde la página web de STIFF SOLANO.`
      );

      const correo = "solanoramosstiffdiogo@gmail.com";

      window.location.href =
        `mailto:${correo}?subject=${asunto}&body=${cuerpo}`;
    });
  }

  // =====================================
  // 6. AÑO AUTOMÁTICO DEL PIE DE PÁGINA
  // =====================================
  const anio = document.querySelector("#year");

  if (anio) {
    anio.textContent = new Date().getFullYear();
  }

  // =====================================
  // 7. LUZ QUE SIGUE AL CURSOR EN PC
  // =====================================
  const luz = document.querySelector(".cursor-glow");
  const tieneCursor = window.matchMedia("(pointer: fine)").matches;

  if (luz && tieneCursor) {
    window.addEventListener(
      "pointermove",
      (evento) => {
        luz.style.left = `${evento.clientX}px`;
        luz.style.top = `${evento.clientY}px`;
      },
      { passive: true }
    );
  }

  // =====================================
  // 8. MOVIMIENTO 3D SUAVE DEL ROBOT
  // =====================================
  const marcoRobot = document.querySelector(".robot-frame");
  const zonaRobot = document.querySelector(".robot-hero");
  const movimientoReducido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    marcoRobot &&
    zonaRobot &&
    window.matchMedia("(pointer: fine)").matches &&
    !movimientoReducido
  ) {
    zonaRobot.addEventListener("pointermove", (evento) => {
      const rectangulo = zonaRobot.getBoundingClientRect();

      const x = (evento.clientX - rectangulo.left) / rectangulo.width;
      const y = (evento.clientY - rectangulo.top) / rectangulo.height;

      const giroY = (x - 0.5) * 7;
      const giroX = (0.5 - y) * 5;

      marcoRobot.style.animation = "none";
      marcoRobot.style.transform =
        `perspective(1200px) rotateX(${giroX}deg) rotateY(${giroY}deg)`;
    });

    zonaRobot.addEventListener("pointerleave", () => {
      marcoRobot.style.transform = "";
      marcoRobot.style.animation = "";
    });
  }
});
