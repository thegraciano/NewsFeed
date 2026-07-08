/* ==========================================================================
   Histórias do Mundo — lógica do aplicativo
   Tudo funciona offline: as ilustrações são desenhadas aqui mesmo (SVG),
   sem baixar nada da internet. Não há links externos nem saídas do app.
   ========================================================================== */
(function () {
	"use strict";

	var HISTORIAS = window.HISTORIAS || [];
	var LOTE = 6;              // quantos cartões carregar por vez
	var totalRenderizado = 0;  // contador absoluto de cartões no feed

	var feed = document.getElementById("feed");
	var sentinela = document.getElementById("sentinela");
	var html = document.documentElement;

	/* ----------------------------------------------------------------------
	   1) Ilustração em SVG (imagem grande de cada cartão)
	   Desenha um fundo em degradê com as cores do tema e um grande ícone,
	   além de uma faixa com o período histórico. Assim toda notícia tem
	   imagem, mesmo sem internet.
	---------------------------------------------------------------------- */
	function criarImagem(item, indice) {
		var c1 = item.cor && item.cor[0] ? item.cor[0] : "#B98A4E";
		var c2 = item.cor && item.cor[1] ? item.cor[1] : "#6E4A24";
		var id = "g" + indice;
		var emoji = item.e || "📜";
		var periodo = (item.p || "").replace(/&/g, "e");

		var svg =
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice">' +
			'<defs>' +
			'<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
			'<stop offset="0" stop-color="' + c1 + '"/>' +
			'<stop offset="1" stop-color="' + c2 + '"/>' +
			'</linearGradient>' +
			'</defs>' +
			'<rect width="800" height="900" fill="url(#' + id + ')"/>' +
			// círculos decorativos suaves
			'<circle cx="120" cy="140" r="180" fill="#ffffff" opacity="0.06"/>' +
			'<circle cx="680" cy="760" r="220" fill="#000000" opacity="0.08"/>' +
			// ícone principal grande
			'<text x="400" y="470" font-size="340" text-anchor="middle" dominant-baseline="central">' + emoji + '</text>' +
			// faixa com o período histórico
			'<rect x="0" y="770" width="800" height="130" fill="#000000" opacity="0.30"/>' +
			'<text x="400" y="838" font-size="46" fill="#FFFFFF" font-family="Segoe UI, Arial, sans-serif" font-weight="bold" text-anchor="middle">' +
			escapar(periodo) + '</text>' +
			'</svg>';

		return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
	}

	/* Escapa caracteres especiais para uso seguro dentro do SVG/HTML */
	function escapar(txt) {
		return String(txt)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	/* ----------------------------------------------------------------------
	   2) Monta um cartão completo (imagem + texto)
	---------------------------------------------------------------------- */
	function criarCartao(item, absoluto) {
		var artigo = document.createElement("article");
		artigo.className = "cartao";
		artigo.setAttribute("data-abs", String(absoluto));

		var numeroNaBase = (absoluto % HISTORIAS.length) + 1;

		var img = document.createElement("img");
		img.className = "cartao-imagem";
		img.alt = item.t || "Ilustração histórica";
		img.loading = "lazy";
		img.src = criarImagem(item, absoluto);

		var conteudo = document.createElement("div");
		conteudo.className = "cartao-conteudo";
		conteudo.innerHTML =
			'<span class="cartao-periodo">' + escapar(item.p || "") + " · " + escapar(item.c || "") + '</span>' +
			'<h2 class="cartao-titulo">' + escapar(item.t || "") + '</h2>' +
			'<p class="cartao-texto">' + escapar(item.txt || "") + '</p>' +
			(item.cur
				? '<div class="cartao-curiosidade"><b>Você sabia?</b> ' + escapar(item.cur) + '</div>'
				: "") +
			'<span class="cartao-numero">História número ' + numeroNaBase + " de " + HISTORIAS.length + '</span>';

		artigo.appendChild(img);
		artigo.appendChild(conteudo);
		return artigo;
	}

	/* ----------------------------------------------------------------------
	   3) Carregamento progressivo (rolagem infinita)
	   O feed nunca termina: quando chega ao fim da lista, recomeça do início,
	   permitindo horas de leitura apenas deslizando para baixo.
	---------------------------------------------------------------------- */
	function carregarLote() {
		if (HISTORIAS.length === 0) return;
		var fragmento = document.createDocumentFragment();
		for (var i = 0; i < LOTE; i++) {
			var item = HISTORIAS[totalRenderizado % HISTORIAS.length];
			fragmento.appendChild(criarCartao(item, totalRenderizado));
			totalRenderizado++;
		}
		feed.appendChild(fragmento);
	}

	// Observa a sentinela: quando ela aparece na tela, carrega mais histórias.
	var observador = new IntersectionObserver(
		function (entradas) {
			entradas.forEach(function (entrada) {
				if (entrada.isIntersecting) carregarLote();
			});
		},
		{ rootMargin: "1200px 0px" } // carrega com antecedência, sem travar
	);

	/* ----------------------------------------------------------------------
	   4) Preferências salvas (fonte, tema) — localStorage
	---------------------------------------------------------------------- */
	var CHAVE_ESCALA = "hm_escala";
	var CHAVE_TEMA = "hm_tema";
	var CHAVE_POSICAO = "hm_posicao";

	function lerNumero(chave, padrao) {
		try {
			var v = parseFloat(localStorage.getItem(chave));
			return isNaN(v) ? padrao : v;
		} catch (e) {
			return padrao;
		}
	}
	function salvar(chave, valor) {
		try { localStorage.setItem(chave, String(valor)); } catch (e) {}
	}

	// ----- Tamanho da letra -----
	var escala = lerNumero(CHAVE_ESCALA, 1);
	function aplicarEscala() {
		escala = Math.max(0.85, Math.min(1.8, escala));
		html.style.setProperty("--escala", String(escala));
		salvar(CHAVE_ESCALA, escala);
	}
	aplicarEscala();

	document.getElementById("btnMaisFonte").addEventListener("click", function () {
		escala += 0.12; aplicarEscala();
	});
	document.getElementById("btnMenosFonte").addEventListener("click", function () {
		escala -= 0.12; aplicarEscala();
	});

	// ----- Modo claro / escuro -----
	var tema = null;
	try { tema = localStorage.getItem(CHAVE_TEMA); } catch (e) {}
	if (tema !== "escuro" && tema !== "claro") tema = "claro"; // padrão: claro
	function aplicarTema() {
		html.setAttribute("data-tema", tema);
		document.getElementById("iconeTema").textContent = tema === "escuro" ? "☀️" : "🌙";
		var meta = document.querySelector('meta[name="theme-color"]');
		if (meta) meta.setAttribute("content", tema === "escuro" ? "#12100D" : "#8B5E34");
		salvar(CHAVE_TEMA, tema);
	}
	aplicarTema();
	document.getElementById("btnTema").addEventListener("click", function () {
		tema = tema === "escuro" ? "claro" : "escuro";
		aplicarTema();
	});

	/* ----------------------------------------------------------------------
	   5) Tela cheia
	---------------------------------------------------------------------- */
	function pedirTelaCheia() {
		var el = document.documentElement;
		var p = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
		if (p) { try { p.call(el); } catch (e) {} }
	}
	function sairTelaCheia() {
		var s = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
		if (s && document.fullscreenElement) { try { s.call(document); } catch (e) {} }
	}
	document.getElementById("btnTelaCheia").addEventListener("click", function () {
		if (document.fullscreenElement) sairTelaCheia(); else pedirTelaCheia();
	});

	/* ----------------------------------------------------------------------
	   6) Modo quiosque (leitor dedicado para aulas e instituições)
	   Esconde a barra, entra em tela cheia e evita saídas acidentais.
	   Para sair: toque cinco vezes seguidas no canto superior da tela.
	---------------------------------------------------------------------- */
	var quiosque = false;
	var btnSair = document.getElementById("sairQuiosque");

	function entrarQuiosque() {
		quiosque = true;
		html.setAttribute("data-quiosque", "1");
		pedirTelaCheia();
		window.addEventListener("beforeunload", avisarSaida);
	}
	function sairQuiosque() {
		quiosque = false;
		html.removeAttribute("data-quiosque");
		btnSair.classList.remove("mostrar");
		window.removeEventListener("beforeunload", avisarSaida);
		sairTelaCheia();
	}
	function avisarSaida(e) {
		e.preventDefault();
		e.returnValue = "";
		return "";
	}
	document.getElementById("btnQuiosque").addEventListener("click", entrarQuiosque);
	btnSair.addEventListener("click", sairQuiosque);

	// Toques repetidos no topo revelam o botão discreto de sair do quiosque.
	var toques = 0, tempoToque = 0;
	document.addEventListener("click", function (e) {
		if (!quiosque) return;
		if (e.clientY > 90) return; // apenas no topo da tela
		var agora = Date.now();
		toques = (agora - tempoToque < 1200) ? toques + 1 : 1;
		tempoToque = agora;
		if (toques >= 5) { btnSair.classList.add("mostrar"); toques = 0; }
	});

	/* ----------------------------------------------------------------------
	   7) Voltar ao início
	---------------------------------------------------------------------- */
	var voltarTopo = document.getElementById("voltarTopo");
	voltarTopo.addEventListener("click", function () {
		window.scrollTo({ top: 0, behavior: "smooth" });
	});

	/* ----------------------------------------------------------------------
	   8) Salvar e restaurar a posição de leitura automaticamente
	   Guarda qual cartão está no topo da tela. Ao reabrir, o app carrega
	   os cartões necessários e volta exatamente ao último ponto lido.
	---------------------------------------------------------------------- */
	function cartaoNoTopo() {
		var cartoes = feed.getElementsByClassName("cartao");
		var limite = 100; // um pouco abaixo da barra
		for (var i = 0; i < cartoes.length; i++) {
			var r = cartoes[i].getBoundingClientRect();
			if (r.bottom > limite) return cartoes[i];
		}
		return null;
	}

	var aguardando = false;
	function aoRolar() {
		// Mostra/esconde o botão de voltar ao topo
		if (window.scrollY > 600) voltarTopo.classList.add("visivel");
		else voltarTopo.classList.remove("visivel");

		if (aguardando) return;
		aguardando = true;
		window.requestAnimationFrame(function () {
			var topo = cartaoNoTopo();
			if (topo) salvar(CHAVE_POSICAO, topo.getAttribute("data-abs"));
			aguardando = false;
		});
	}
	window.addEventListener("scroll", aoRolar, { passive: true });

	function restaurarPosicao() {
		var alvo = lerNumero(CHAVE_POSICAO, 0);
		if (!alvo || alvo < LOTE) return; // nada a restaurar
		// Garante que existam cartões suficientes até o ponto salvo.
		var limite = alvo + LOTE + 2;
		var seguranca = 0;
		while (totalRenderizado <= limite && seguranca < 400) {
			carregarLote();
			seguranca++;
		}
		var alvoEl = feed.querySelector('.cartao[data-abs="' + alvo + '"]');
		if (alvoEl) {
			// Sem animação para ir direto ao ponto certo.
			var y = alvoEl.getBoundingClientRect().top + window.scrollY - 96;
			window.scrollTo(0, y);
		}
	}

	/* ----------------------------------------------------------------------
	   9) Proteção: impedir saída para outros sites
	   O app não tem links externos, mas por segurança bloqueamos qualquer
	   clique em link que tente abrir outro endereço.
	---------------------------------------------------------------------- */
	document.addEventListener("click", function (e) {
		var a = e.target && e.target.closest ? e.target.closest("a") : null;
		if (a) { e.preventDefault(); }
	});

	/* ----------------------------------------------------------------------
	   10) Registrar o Service Worker (funcionamento offline / PWA)
	---------------------------------------------------------------------- */
	if ("serviceWorker" in navigator) {
		window.addEventListener("load", function () {
			navigator.serviceWorker.register("sw.js").catch(function () {});
		});
	}

	/* ----------------------------------------------------------------------
	   11) Iniciar o aplicativo
	---------------------------------------------------------------------- */
	carregarLote();          // primeiro lote
	carregarLote();          // segundo lote (garante rolagem)
	observador.observe(sentinela);
	restaurarPosicao();      // volta ao último ponto lido

	// Primeira interação do usuário tenta abrir em tela cheia (exigência dos navegadores).
	var jaTentou = false;
	document.addEventListener("click", function () {
		if (jaTentou) return;
		jaTentou = true;
		if (!document.fullscreenElement) pedirTelaCheia();
	}, { once: true });
})();
