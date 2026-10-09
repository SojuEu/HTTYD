# HTTYD — fan site (versão atualizada)

Abra `index.html` direto no navegador; não precisa de build nem de servidor.

## O que mudou
- **Tema Automático / Claro / Escuro** (vindo do DINO): botão de tema na barra, fora do menu (clique alterna Automático → Claro → Escuro), escolha salva no navegador, aplicada antes da página aparecer (sem "piscar") e sincronizada com o sistema no modo Automático.
- **Carousel da home**: um slide por filme com fundo, pôster, sinopse e botão; troca em fade, barra de progresso, contador, botão de pausa, pausa ao passar o mouse/focar, setas, abas, gesto de deslizar e respeito a "reduzir movimento". Os carousels das classes ganharam contador e acabamento visual.
- **Dados em vez de 160 funções**: os textos dos 32 painéis de dragões estão em `js/dragons.js`. Os botões usam `data-panel="tex1" data-view="desc|feat|abil|alert|hide"`. Clicar de novo no mesmo botão recolhe o painel.
- **Organização**: `css/estilo.css` (tokens → base → layout → componentes → responsivo), `js/site.js` (tema, navbar, carousel, painéis), `js/dragons.js` (dados).

## Bugs e inconsistências corrigidos
- Erro de JS em todas as páginas (`meuCarrossel` não existia) e botões que dependiam de `onclick` global.
- 9 imagens com maiúscula/minúscula errada (quebravam fora do Windows) e 4 com acento corrompido pelo zip (`soluço-desenhando.jpg` etc.).
- IDs duplicados (`accordionExample`, `collapseEight`, `offcanvasWithBothOptionsLabel`, `liveaction`), com acordeões ligados ao alvo errado.
- `alt` ausente, vazio ou `"..."` em ~200 imagens; `loading="lazy"` nas imagens abaixo da navbar (o site tem ~99 MB de imagens).
- Títulos repetidos em 5 páginas, descrição "Free Web tutorials", autor escrito de duas formas, `og:image` com espaço no começo, tag inválida `<quote>`.
- Ortografia nos alertas dos dragões (CUIDADE, JAMAS, PODERA, ESCONDASSE…).

## Responsividade
- Painel `.container` não estoura mais a largura (antes: margem fixa + largura 100%); tabelas rolam dentro de `.table-responsive`.
- `background-attachment: fixed` desligado em telas pequenas/touch; texto alinhado à esquerda (antes justificado); botões dos painéis quebram linha no celular.
- Testado sem rolagem horizontal nas 17 páginas em 320, 360 e 414 px.

## Como adicionar um dragão
1. Copie um bloco de card de uma página de classe e troque o `id="texN"` por um número novo.
2. Em `js/dragons.js`, crie `"texN": { "desc": "...", "feat": [...], "abil": [...], "alert": {"tone":"danger","text":"..."} }`.
3. Use `data-panel="texN"` nos botões.

## Ajustes da 2ª rodada
- Cor de destaque agora é o vermelho da logo (uma variável: `--accent` / `--ember` em `css/estilo.css`).
- Botão de tema fora do dropdown, sempre visível; o menu abre em linha a partir de 768 px (antes só em 992 px).
- Pôsteres em grade com proporção 2:3 igual para todos (2 por linha no celular).
- Cards e carousels com o mesmo raio de borda e espaço entre eles.
- Acordeões sem o bloco azul do Bootstrap (item aberto só ganha texto e filete vermelhos).
- Banguela dançante volta ao rodapé também no celular (acima do texto).

## Livros (3ª rodada)
- Cada livro abre num **modal centralizado** (capa + sinopse + detalhes), por cima da página e sempre no topo; fecha com X, Esc ou clicando fora.
- O bug vinha do `backdrop-filter` do painel `.container`: ele faz elementos `position: fixed` ficarem presos ao painel. Os modais agora ficam no fim do `<body>`.
