/* ==========================================================================
   Histórias do Mundo — estilos
   Foco: idosos, tablet em paisagem, letras grandes, alto contraste.
   ========================================================================== */

/* Variáveis de tema. --escala controla o tamanho geral da letra. */
:root {
	--escala: 1;                 /* ajustada pelos botões A- / A+ */
	--fonte-base: 26px;          /* base > 24px exigido */
	--raio: 22px;
	--espaco: clamp(20px, 3vw, 40px);

	/* Modo claro (padrão) */
	--fundo: #F4ECDD;
	--fundo-barra: #8B5E34;
	--fundo-cartao: #FFFDF8;
	--texto: #241C12;
	--texto-suave: #5A4A36;
	--titulo: #6B3F14;
	--periodo-fundo: #E7D4B5;
	--periodo-texto: #5A3A12;
	--sombra: 0 10px 30px rgba(60, 40, 15, 0.18);
	--btn-fundo: #FFFFFF;
	--btn-texto: #3A2A16;
	--btn-borda: rgba(255, 255, 255, 0.6);
	--barra-texto: #FFF8EC;
	--realce: #B87333;
}

/* Modo escuro */
html[data-tema="escuro"] {
	--fundo: #12100D;
	--fundo-barra: #1E1A14;
	--fundo-cartao: #201B15;
	--texto: #F6EFE2;
	--texto-suave: #C9BCA6;
	--titulo: #F0C489;
	--periodo-fundo: #3A2F20;
	--periodo-texto: #F0D6A8;
	--sombra: 0 10px 30px rgba(0, 0, 0, 0.55);
	--btn-fundo: #2E271E;
	--btn-texto: #F6EFE2;
	--btn-borda: rgba(255, 255, 255, 0.12);
	--barra-texto: #F6EFE2;
	--realce: #E0A85C;
}

* { box-sizing: border-box; }

html, body {
	margin: 0;
	padding: 0;
	background: var(--fundo);
	color: var(--texto);
	font-family: "Segoe UI", "Noto Sans", system-ui, -apple-system, Arial, sans-serif;
	-webkit-text-size-adjust: none;
	scroll-behavior: smooth;
	overscroll-behavior-y: contain;
}

body {
	font-size: calc(var(--fonte-base) * var(--escala));
	line-height: 1.65;
	padding-top: 92px; /* espaço para a barra fixa */
}

/* ------------------------- Barra superior ------------------------- */
.barra {
	position: fixed;
	top: 0; left: 0; right: 0;
	height: 92px;
	z-index: 50;
	background: var(--fundo-barra);
	color: var(--barra-texto);
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 clamp(16px, 3vw, 40px);
	gap: 16px;
	box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
}

.barra-titulo {
	display: flex;
	align-items: center;
	gap: 14px;
	font-size: clamp(24px, 3.2vw, 34px);
	font-weight: 800;
	letter-spacing: 0.3px;
	white-space: nowrap;
}
.barra-emoji { font-size: 1.3em; }

.barra-controles {
	display: flex;
	align-items: center;
	gap: clamp(10px, 1.6vw, 18px);
}

/* Botões grandes e fáceis de tocar (mínimo ~64px) */
.btn {
	min-width: 68px;
	height: 68px;
	padding: 0 16px;
	border-radius: 18px;
	border: 2px solid var(--btn-borda);
	background: var(--btn-fundo);
	color: var(--btn-texto);
	font-size: 30px;
	font-weight: 700;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
	transition: transform 0.08s ease, filter 0.15s ease;
	-webkit-tap-highlight-color: transparent;
}
.btn:active { transform: scale(0.94); filter: brightness(0.95); }
.btn-icone { display: flex; align-items: baseline; gap: 2px; line-height: 1; }
.btn-icone small { font-size: 0.62em; font-weight: 800; }

/* ------------------------- Feed / cartões ------------------------- */
.feed {
	display: flex;
	flex-direction: column;
	gap: var(--espaco);
	padding: var(--espaco);
	max-width: 1600px;
	margin: 0 auto;
}

.cartao {
	background: var(--fundo-cartao);
	border-radius: var(--raio);
	box-shadow: var(--sombra);
	overflow: hidden;
	display: grid;
	grid-template-columns: 45% 55%; /* imagem 45% — texto 55% */
	min-height: 60vh;
	animation: aparecer 0.5s ease both;
}

@keyframes aparecer {
	from { opacity: 0; transform: translateY(24px); }
	to   { opacity: 1; transform: translateY(0); }
}

.cartao-imagem {
	width: 100%;
	height: 100%;
	min-height: 320px;
	object-fit: cover;
	display: block;
	background: #cdbfa6;
}

.cartao-conteudo {
	padding: clamp(24px, 3vw, 48px);
	display: flex;
	flex-direction: column;
	gap: clamp(14px, 1.6vw, 22px);
	justify-content: center;
}

.cartao-periodo {
	align-self: flex-start;
	background: var(--periodo-fundo);
	color: var(--periodo-texto);
	font-weight: 800;
	font-size: 0.72em;
	padding: 8px 18px;
	border-radius: 999px;
	letter-spacing: 0.4px;
}

.cartao-titulo {
	margin: 0;
	color: var(--titulo);
	font-size: clamp(30px, 4vw, 50px);
	line-height: 1.15;
	font-weight: 800;
}

.cartao-texto {
	margin: 0;
	color: var(--texto);
	font-size: 1em; /* herda a base (>=26px) */
}

.cartao-curiosidade {
	margin-top: 6px;
	background: rgba(184, 115, 51, 0.12);
	border-left: 8px solid var(--realce);
	border-radius: 12px;
	padding: 16px 20px;
	color: var(--texto-suave);
	font-size: 0.92em;
}
.cartao-curiosidade b { color: var(--titulo); }

/* Numeração discreta do cartão (ajuda a saber a posição) */
.cartao-numero {
	font-size: 0.62em;
	color: var(--texto-suave);
	opacity: 0.7;
	font-weight: 700;
}

/* ------------------------- Sentinela / carregando ------------------------- */
.sentinela {
	display: flex;
	justify-content: center;
	padding: 30px 0 60px;
}
.carregando {
	font-size: 0.8em;
	color: var(--texto-suave);
	font-weight: 700;
}

/* ------------------------- Botão voltar ao topo ------------------------- */
.voltar-topo {
	position: fixed;
	right: clamp(16px, 3vw, 40px);
	bottom: clamp(16px, 3vw, 40px);
	z-index: 40;
	padding: 18px 28px;
	font-size: 24px;
	font-weight: 800;
	color: #fff;
	background: var(--realce);
	border: none;
	border-radius: 999px;
	box-shadow: 0 8px 22px rgba(0, 0, 0, 0.3);
	cursor: pointer;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.25s ease, transform 0.08s ease;
}
.voltar-topo.visivel { opacity: 1; pointer-events: auto; }
.voltar-topo:active { transform: scale(0.94); }

/* ------------------------- Modo quiosque ------------------------- */
html[data-quiosque="1"] .barra { display: none; }
html[data-quiosque="1"] body { padding-top: var(--espaco); }
html[data-quiosque="1"] .voltar-topo { display: none; }

.sair-quiosque {
	display: none;
	position: fixed;
	top: 10px; left: 50%;
	transform: translateX(-50%);
	z-index: 60;
	padding: 12px 22px;
	font-size: 20px;
	font-weight: 700;
	border-radius: 999px;
	border: none;
	background: rgba(0,0,0,0.75);
	color: #fff;
	cursor: pointer;
}
html[data-quiosque="1"] .sair-quiosque.mostrar { display: block; }

/* ------------------------- Retrato: orientação ------------------------- */
/* O app é pensado para paisagem. Em retrato, sugerimos girar o tablet. */
.aviso-girar {
	display: none;
	position: fixed;
	inset: 0;
	z-index: 100;
	background: var(--fundo);
	color: var(--texto);
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 40px;
	gap: 20px;
}
.aviso-girar .icone-girar { font-size: 90px; animation: girar 2.2s ease-in-out infinite; }
.aviso-girar p { font-size: 32px; font-weight: 800; max-width: 700px; }
@keyframes girar { 0%,100%{transform:rotate(0)} 50%{transform:rotate(90deg)} }

/* Mostra o aviso apenas em telas pequenas em retrato (celulares/tablets). */
@media (orientation: portrait) and (max-width: 1100px) {
	.aviso-girar { display: flex; }
}

/* Em telas estreitas (fallback), empilha imagem e texto para não quebrar. */
@media (max-width: 720px) {
	.cartao { grid-template-columns: 1fr; min-height: unset; }
	.cartao-imagem { min-height: 220px; max-height: 40vh; }
}

/* Respeita quem prefere menos animação */
@media (prefers-reduced-motion: reduce) {
	.cartao { animation: none; }
	html, body { scroll-behavior: auto; }
	.aviso-girar .icone-girar { animation: none; }
}
