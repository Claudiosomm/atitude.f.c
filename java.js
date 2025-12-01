/* java.js - script global
   - toggle do menu mobile
   - lightbox simples para imagens (abre em overlay)
   - função para pedir URL do YouTube e embutir na caixa
*/
document.addEventListener('DOMContentLoaded', function(){

    // MENU mobile toggle
    const toggleBtn = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if(toggleBtn && sidebar){
      toggleBtn.addEventListener('click', function(){
        sidebar.classList.toggle('open');
      });
      // clique fora fecha (em mobile)
      document.addEventListener('click', function(e){
        if(window.innerWidth <= 900){
          if(!sidebar.contains(e.target) && !toggleBtn.contains(e.target)){
            sidebar.classList.remove('open');
          }
        }
      });
    }
  
    // LIGHTBOX
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.className = 'lightbox-overlay';
    lightboxOverlay.innerHTML = `
      <div>
        <img class="lightbox-img" src="" alt="">
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(lightboxOverlay);
  
    lightboxOverlay.addEventListener('click', function(){
      lightboxOverlay.classList.remove('open');
      lightboxOverlay.querySelector('.lightbox-img').src = '';
      lightboxOverlay.querySelector('.lightbox-caption').textContent = '';
    });
  
    // adiciona listener a imagens com data-lightbox
    document.querySelectorAll('[data-lightbox]').forEach(function(img){
      img.addEventListener('click', function(e){
        const src = e.currentTarget.dataset.src || e.currentTarget.src;
        const caption = e.currentTarget.getAttribute('data-caption') || '';
        lightboxOverlay.querySelector('.lightbox-img').src = src;
        lightboxOverlay.querySelector('.lightbox-caption').textContent = caption;
        lightboxOverlay.classList.add('open');
      });
    });
  
    // Função para carregar vídeo do YouTube em um container
    window.loadYoutubeInBox = function(containerSelector, defaultUrl) {
      const container = document.querySelector(containerSelector);
      if(!container) return;
      // se a função for chamada sem URL, pede via prompt (rápido e simples)
      let url = defaultUrl || prompt('Cole a URL do vídeo do YouTube (ex: https://www.youtube.com/watch?v=abc123):');
      if(!url) return;
      // extrair ID do youtube
      const videoIdMatch = url.match(/(?:v=|\/embed\/|\.be\/)([A-Za-z0-9_-]{6,})/);
      if(!videoIdMatch){
        alert('URL do YouTube inválida. Cole a URL completa.');
        return;
      }
      const id = videoIdMatch[1];
      // limpar e inserir iframe responsivo
      container.innerHTML = `
        <div style="position:relative;padding-top:56.25%;height:0;overflow:hidden;border-radius:8px;">
          <iframe src="https://www.youtube.com/embed/${id}" title="YouTube video" frameborder="0"
            style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe>
        </div>
      `;
    };
  
    });
    document.addEventListener("DOMContentLoaded", () => {
        const lightbox = document.getElementById("lightbox");
        const imgs = document.querySelectorAll(".galeria img");

        imgs.forEach(img => {
            img.addEventListener("click", () => {
                lightbox.style.display = "flex";
                lightbox.innerHTML = `<img src="${img.src}">`;
            });
        });

        lightbox.addEventListener("click", () => {
            lightbox.style.display = "none";
        });
    });
