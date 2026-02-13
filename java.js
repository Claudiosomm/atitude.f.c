<script>

document.addEventListener("DOMContentLoaded", function(){

    const overlay = document.getElementById("overlayVideo");
    const player = document.getElementById("playerExpandido");
    const fechar = document.getElementById("fecharVideo");
    const descricao = document.getElementById("descricaoExpandida");

    const cards = document.querySelectorAll(".card-video");

    let timeoutDescricao;

    function fecharPlayer(){

        player.src = "";
        overlay.style.display = "none";
        descricao.textContent = "";

    }

    cards.forEach(function(card){

        card.addEventListener("click", function(){

            const iframe = card.querySelector("iframe");
            const texto = card.querySelector("h3").textContent;

            if(!iframe) return;

            const url = iframe.src.split("?")[0];

            player.src = url + "?autoplay=1";

            descricao.textContent = texto;

            overlay.style.display = "flex";

            descricao.classList.add("visivel");

            clearTimeout(timeoutDescricao);

            timeoutDescricao = setTimeout(function(){

                descricao.classList.remove("visivel");

            }, 4000);

        });

    });

    fechar.addEventListener("click", fecharPlayer);

    overlay.addEventListener("click", function(e){

        if(e.target === overlay){

            fecharPlayer();

        }

    });

    document.addEventListener("keydown", function(e){

        if(e.key === "Escape"){

            fecharPlayer();

        }

    });

});

</script>
