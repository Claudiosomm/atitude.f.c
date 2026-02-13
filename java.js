/* =======================================
   INICIALIZAÇÃO GLOBAL
======================================= */
document.addEventListener('DOMContentLoaded', () => {

    /* =======================================
       MENU HAMBURGER (SEGURO)
    ======================================= */
    const menuToggle = document.querySelector('.menu-toggle');
    const menuSite = document.querySelector('.menu-site');

    if (menuToggle && menuSite) {
        menuToggle.addEventListener('click', () => {
            menuSite.classList.toggle('ativo');
        });

        // Fecha menu ao clicar em um link (mobile)
        menuSite.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuSite.classList.remove('ativo');
            });
        });
    }

    /* ======================================
       MENU ATIVO AUTOMÁTICO
    ====================================== */
    const linksMenu = document.querySelectorAll(".menu-site a");
    const paginaAtual = window.location.pathname.split("/").pop();

    linksMenu.forEach(link => {
        const href = link.getAttribute("href");
        if (
            href === paginaAtual ||
            (href === "index.html" && paginaAtual === "")
        ) {
            link.classList.add("ativo");
        }
    });

    /* =======================================
       SIMPLE LIGHTBOX — GALERIA (OFICIAL)
    ======================================= */
    if (typeof SimpleLightbox !== "undefined") {
        new SimpleLightbox('.galeria a.lightbox', {
            captions: true,
            captionsData: 'alt',
            captionDelay: 250,
            nav: true,
            close: true,
            showCounter: true,
            animationSpeed: 250
        });
    }

    /* =======================================
       FLIP DOS JOGADORES
    ======================================= */
    function isMobile() {
        return window.innerWidth <= 768;
    }

    function setupFlip() {
        const cards = document.querySelectorAll(".card");
        if (cards.length === 0) return;

        cards.forEach(card => {
            if (card.__flipInitialized) return;
            card.__flipInitialized = true;

            // PC → hover
            card.addEventListener("mouseenter", () => {
                if (!isMobile()) card.classList.add("virado");
            });

            card.addEventListener("mouseleave", () => {
                if (!isMobile()) card.classList.remove("virado");
            });

            // Mobile → clique
            card.addEventListener("click", function (e) {
                if (!isMobile()) return;

                const jaVirado = this.classList.contains("virado");

                document.querySelectorAll(".card.virado").forEach(c => {
                    if (c !== this) c.classList.remove("virado");
                });

                this.classList.toggle("virado", !jaVirado);
                e.stopPropagation();
            });
        });

        document.addEventListener('click', function (e) {
            if (!isMobile()) return;
            if (!e.target.closest('.card')) {
                document.querySelectorAll(".card.virado")
                    .forEach(c => c.classList.remove("virado"));
            }
        });
    }

    setupFlip();
    window.addEventListener('resize', setupFlip);

    /* =======================================
       CÁLCULO AUTOMÁTICO DE IDADE
    ======================================= */
    function calcularIdade(dataNasc) {
        const hoje = new Date();
        const nasc = new Date(dataNasc);
        let idade = hoje.getFullYear() - nasc.getFullYear();
        const mes = hoje.getMonth() - nasc.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) idade--;
        return idade;
    }

    document.querySelectorAll('.idade[data-nasc]').forEach(span => {
        span.textContent = calcularIdade(span.dataset.nasc);
    });

});
