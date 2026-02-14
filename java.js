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

    /* =======================================
       OVERLAY DE VÍDEOS COM NAVEGAÇÃO
    ======================================= */
    const overlay = document.getElementById("overlayVideo");
    const player = document.getElementById("playerExpandido");
    const fechar = document.getElementById("fecharVideo");
    const descricao = document.getElementById("descricaoExpandida");
    const cardsVideo = document.querySelectorAll(".card-video");
    const galeriaMinis = document.getElementById("galeriaMinis");
    const btnAnterior = document.getElementById("videoAnterior");
    const btnProximo = document.getElementById("videoProximo");

    if (overlay && player && fechar && cardsVideo.length > 0) {
        let timeoutDescricao = null;
        let videoAtualIndex = 0;
        const todosVideos = Array.from(cardsVideo);

        // Cria miniaturas
        function criarMiniaturas() {
            galeriaMinis.innerHTML = '';
            
            todosVideos.forEach((card, index) => {
                const videoId = card.getAttribute('data-video-id');
                const titulo = card.querySelector('h3')?.textContent || '';
                
                const mini = document.createElement('div');
                mini.className = 'mini-video';
                mini.innerHTML = `
                    <img src="https://img.youtube.com/vi/${videoId}/mqdefault.jpg" alt="${titulo}">
                    <div class="mini-video-titulo">${titulo}</div>
                `;
                
                // Evento de click
                mini.addEventListener('click', () => abrirVideoIndex(index));

                // Touch melhorado para miniaturas
                let miniTouchStartX = 0;
                mini.addEventListener('touchstart', (e) => {
                    miniTouchStartX = e.touches[0].clientX;
                }, {passive: true});

                mini.addEventListener('touchend', (e) => {
                    const miniTouchEndX = e.changedTouches[0].clientX;
                    const diff = Math.abs(miniTouchEndX - miniTouchStartX);
                    
                    if (diff < 10) {
                        abrirVideoIndex(index);
                    }
                }, {passive: true});
                
                galeriaMinis.appendChild(mini);
            });
        }

        // Atualiza miniatura ativa
        function atualizarMiniaturaAtiva() {
            document.querySelectorAll('.mini-video').forEach((mini, index) => {
                mini.classList.toggle('ativo', index === videoAtualIndex);
            });
        }

        // Abre vídeo por índice
        function abrirVideoIndex(index) {
            videoAtualIndex = index;
            const card = todosVideos[index];
            const videoId = card.getAttribute('data-video-id');
            const texto = card.querySelector('h3')?.textContent || '';

            player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`;
            descricao.textContent = texto;
            overlay.style.display = "flex";
            descricao.classList.add("visivel");

            atualizarMiniaturaAtiva();

            if (timeoutDescricao) clearTimeout(timeoutDescricao);
            timeoutDescricao = setTimeout(() => {
                descricao.classList.remove("visivel");
            }, 4000);
        }

        // Fecha player
        function fecharPlayer(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            player.src = "";
            overlay.style.display = "none";
            descricao.textContent = "";
            descricao.classList.remove("visivel");
            if (timeoutDescricao) clearTimeout(timeoutDescricao);
            
            // Força o overlay a esconder
            overlay.classList.remove("ativo");
        }

        // Navega para vídeo anterior
        function videoAnterior() {
            videoAtualIndex = (videoAtualIndex - 1 + todosVideos.length) % todosVideos.length;
            abrirVideoIndex(videoAtualIndex);
        }

        // Navega para próximo vídeo
        function videoProximo() {
            videoAtualIndex = (videoAtualIndex + 1) % todosVideos.length;
            abrirVideoIndex(videoAtualIndex);
        }

        // Eventos nos cards - melhorado para mobile
        cardsVideo.forEach((card, index) => {
            card.addEventListener("click", () => abrirVideoIndex(index));
            
            // Touch melhorado - detecta arraste vs toque
            let touchStartY = 0;
            let touchStartX = 0;
            
            card.addEventListener("touchstart", (e) => {
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
            }, {passive: true});
            
            card.addEventListener("touchend", (e) => {
                const touchEndY = e.changedTouches[0].clientY;
                const touchEndX = e.changedTouches[0].clientX;
                const diffY = Math.abs(touchEndY - touchStartY);
                const diffX = Math.abs(touchEndX - touchStartX);
                
                // Só abre se foi um toque (movimento < 10px)
                if (diffY < 10 && diffX < 10) {
                    abrirVideoIndex(index);
                }
            }, {passive: true});
        });

        // Botões de navegação
        btnAnterior.addEventListener("click", videoAnterior);
        btnProximo.addEventListener("click", videoProximo);

        // Fechar - versão mobile-friendly
        fechar.addEventListener("click", fecharPlayer);
        fechar.addEventListener("touchend", function(e) {
            e.preventDefault();
            e.stopPropagation();
            fecharPlayer(e);
        }, {passive: false});

        // Fechar ao clicar fora
        overlay.addEventListener("click", function(e) {
            if (e.target === overlay) {
                fecharPlayer(e);
            }
        });

        // Adicione também touchend para mobile
        overlay.addEventListener("touchend", function(e) {
            if (e.target === overlay) {
                e.preventDefault();
                fecharPlayer(e);
            }
        }, {passive: false});

        // Navegação por teclado
        document.addEventListener("keydown", function(e) {
            if (overlay.style.display === "flex") {
                if (e.key === "Escape") fecharPlayer();
                if (e.key === "ArrowLeft") videoAnterior();
                if (e.key === "ArrowRight") videoProximo();
            }
        });

        // Cria miniaturas ao carregar
        criarMiniaturas();
    }

}); // Fecha o DOMContentLoaded principal
