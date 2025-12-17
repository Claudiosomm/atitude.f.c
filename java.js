/* =======================================
   LIGHTBOX COM NAVEGAÇÃO
======================================= */
const imagens = document.querySelectorAll('.foto-galeria');

if (imagens.length > 0) {
    let indiceAtual = 0;

    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';

    const imgGrande = document.createElement('img');
    imgGrande.id = "lightbox-img";

    const btnPrev = document.createElement('div');
    btnPrev.id = "btn-prev";
    btnPrev.classList.add("lightbox-btn");
    btnPrev.innerHTML = "&#10094;";

    const btnNext = document.createElement('div');
    btnNext.id = "btn-next";
    btnNext.classList.add("lightbox-btn");
    btnNext.innerHTML = "&#10095;";

    lightbox.appendChild(imgGrande);
    lightbox.appendChild(btnPrev);
    lightbox.appendChild(btnNext);
    document.body.appendChild(lightbox);

    imagens.forEach((img, index) => {
        img.addEventListener('click', () => {
            indiceAtual = index;
            mostrarImagem();
            lightbox.classList.add('ativo');
        });
    });

    function mostrarImagem() {
        imgGrande.src = imagens[indiceAtual].src;
    }

    btnNext.addEventListener('click', (e) => {
        e.stopPropagation();
        indiceAtual = (indiceAtual + 1) % imagens.length;
        mostrarImagem();
    });

    btnPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        indiceAtual = (indiceAtual - 1 + imagens.length) % imagens.length;
        mostrarImagem();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('ativo');
        }
    });
}

/* ======================================================
   FLIP DOS JOGADORES (PC = hover / CELULAR = clique)
====================================================== */
function isMobile() {
    return window.innerWidth <= 768;
}

function setupFlip() {
    const cards = document.querySelectorAll(".card");
    if (cards.length === 0) return;

    cards.forEach(card => {
        if (card.__flipInitialized) return;
        card.__flipInitialized = true;

        card.addEventListener("mouseenter", () => {
            if (!isMobile()) card.classList.add("virado");
        });

        card.addEventListener("mouseleave", () => {
            if (!isMobile()) card.classList.remove("virado");
        });

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

/* =======================================
   CÁLCULO AUTOMÁTICO DE IDADE
======================================= */
function isValidDateString(s) {
    if (!s) return false;
    const d = new Date(s);
    return !Number.isNaN(d.getTime());
}

function calcularIdade(dataNasc) {
    if (!isValidDateString(dataNasc)) return '';

    const hoje = new Date();
    const nasc = new Date(dataNasc);

    let idade = hoje.getFullYear() - nasc.getFullYear();
    const mes = hoje.getMonth() - nasc.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
}

function atualizarIdades() {
    document.querySelectorAll('.idade[data-nasc]').forEach(span => {
        const data = span.getAttribute('data-nasc');
        span.textContent = calcularIdade(data) || '—';
    });

    document.querySelectorAll('.data-nascimento[data-nasc]').forEach(span => {
        const data = span.getAttribute('data-nasc');
        if (!isValidDateString(data)) return;

        const d = new Date(data);
        span.textContent =
            `${String(d.getDate()).padStart(2, '0')}/` +
            `${String(d.getMonth() + 1).padStart(2, '0')}/` +
            d.getFullYear();
    });
}

/* =======================================
   MENU HAMBURGER
======================================= */
const menuToggle = document.querySelector('.menu-toggle');
const menuSite = document.querySelector('.menu-site');

if (menuToggle && menuSite) {
    menuToggle.addEventListener('click', () => {
        menuSite.classList.toggle('ativo');
    });

    menuSite.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuSite.classList.remove('ativo');
        });
    });
}

/* =======================================
   INICIALIZAÇÃO
======================================= */
document.addEventListener('DOMContentLoaded', () => {
    setupFlip();
    atualizarIdades();

    (function atualizarMeiaNoite() {
        const agora = new Date();
        const ms =
            new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 1) - agora;

        setTimeout(() => {
            atualizarIdades();
            atualizarMeiaNoite();
        }, ms + 1000);
    })();
});

window.addEventListener('resize', setupFlip);
