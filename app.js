/* ============================================================
   CHECKLIST DE FROTA — app.js
   ============================================================ */

// ============================================================
// DATA
// ============================================================
const DATA = {
  cavalo: [
    {
      id: 'elétrica', icon: '⚡', name: 'Elétrica',
      items: [
        'Faróis Dianteiros (alto, baixo)',
        'Lanternas Dianteiras',
        'Lanternas Traseiras (freio, ré, pisca)',
        'Pisca-Alertas (4 lados)',
        'Luz de Placa',
      ]
    },
    {
      id: 'documentos', icon: '📄', name: 'Documentos',
      items: [
        'CRLV do cavalo e carretas (válido)',
        'RNTRC / Licença ANTT',
        'Tacógrafo calibrado, lacrado e válido',
        'AET (se carga especial)',
      ]
    },
    {
      id: 'cabine', icon: '🪟', name: 'Cabine / Painel',
      items: [
        'Painel de instrumentos (sem alertas)',
        'Tacógrafo (funcionando / disco inserido)',
        'Rastreador (teclado bom, online e ativo)',
        'Estofados (boas condições)',
        'Carpetes, tapetes e capas (boas condições)',
        'Defletor de ar (boas condições)',
        'Partes Externas (escadas, parachoques, parabarros, pintura)',
      ]
    },
    {
      id: 'segurança', icon: '🛡️', name: 'Segurança',
      items: [
        'Extintor (validade e fixação)',
        'Macaco hidráulico (presente e funcional)',
        'Chave de roda, Triângulo de sinalização',
      ]
    },
    {
      id: 'motor', icon: '🔧', name: 'Motor / Mecânica',
      items: [
        'Nível do óleo do motor, cambio e direção hidráulica',
        'Nível do fluido de arrefecimento',
        'Vazamentos visíveis (motor, cambio e diferencial e arrefecimento)',
        'Correias e mangueiras (--)',
      ]
    },
  ],
  sider: [
    {
      id: 'estrutura', icon: '🏗️', name: 'Estrutura / Lona',
      items: [
        'Lonas laterais (rasgos ou furos)',
        'Amarrações (Catracas, Cintas, Reguas, Cantoneiras)' ,
        'Longarinas e travessas (danos)',
        'Porta traseira / alçapão',
        'Piso da carroceria',
      ]
    },
    {
      id: 'acoplamento-s', icon: '🔗', name: 'Acoplamento',
      items: [
        'Quinta roda, Gavião e Pino rei (condição e assentamento)',
        'Mangueiras de ar, Cabo elétrico',
      ]
    },
    {
      id: 'freios-s', icon: '🔴', name: 'Freios / Ar',
      items: [
        'Câmaras de freio (vazamentos)',
        'Mangueiras de ar (estado)',
        'Conexões rápidas (estado)',
      ]
    },
    {
      id: 'eletrica-s', icon: '⚡', name: 'Elétrica',
      items: [
        'Lanternas traseiras (freio, ré, pisca)',
        'Pisca-alertas traseiros',
        'Luz de placa traseira',
        'Lanternas laterais',
      ]
    },
    {
      id: 'pneus-s', icon: '⭕', name: 'Pneus',
      items: [
        'Calibragem (todos os eixos)',
        'Desgaste',
        'Danos visíveis (cortes, bolhas)',
        'Estepe (presente)',
      ]
    },
  ],
  rodotrem: [
   {
      id: 'acoplamentos-s', icon: '🔗', name: 'Acoplamento 1º Implemento',
      items: [
        'Quinta Roda, Gavião, Pino rei  — condição geral',
        'Trava de segurança do pino',
        'Jogo / folga excessiva',
        'Deformações ou trincas visíveis',
      ]
    },
    {
      id: 'segundo-impl', icon: '📦', name: '2º Implemento',
      items: [
        'Lonas laterais (rasgos ou furos)',
        'Amarrações das lonas',
        'Estrutura (longarinas e travessas)',
        'Câmaras de freio (vazamentos)',
        'Mangueiras de ar (estado)',
        'Lanternas Traseiros (freio, ré, pisca)',
        'Pneus',
        'Estepe do 2º implemento',
      ]
    },
    {
      id: 'rodotrem-geral', icon: '🔧', name: 'Geral Rodotrem',
      items: [
        'Comprimento total dentro do limite (≤30m)',
        'Largura dentro do limite',
        'documentação (presente)',
        'Sinalizações obrigatórias (retrorefletivos laterais)',
        'Luzes de contorno',
      ]
    },
  ]
};

// ============================================================
// STATE
// ============================================================
const state = {}; // key: `${tab}||${secId}||${itemIdx}` => { status: 'ok'|'nok'|'na'|'', obs: '' }

function getKey(tab, secId, idx) { return `${tab}||${secId}||${idx}`; }

function getState(tab, secId, idx) {
  const k = getKey(tab, secId, idx);
  if (!state[k]) state[k] = { status: '', obs: '' };
  return state[k];
}

// ============================================================
// RENDER
// ============================================================
function renderAll() {
  ['cavalo', 'sider', 'rodotrem'].forEach(tab => {
    const container = document.getElementById(`sections-${tab}`);
    container.innerHTML = '';
    DATA[tab].forEach(sec => {
      container.appendChild(buildSection(tab, sec));
    });
  });
  updateProgress();
}

function buildSection(tab, sec) {
  const wrap = document.createElement('div');
  wrap.className = 'section';
  wrap.id = `sec-${tab}-${sec.id}`;

  const header = document.createElement('div');
  header.className = 'section-header';
  header.innerHTML = `
    <span class="section-icon">${sec.icon}</span>
    <span class="section-name">${sec.name}</span>
    <span class="section-badge" id="badge-${tab}-${sec.id}">0/${sec.items.length}</span>
    <span class="section-chevron">▼</span>
  `;
  header.addEventListener('click', () => {
    wrap.classList.toggle('collapsed');
  });

  const body = document.createElement('div');
  body.className = 'section-body';

  sec.items.forEach((itemName, idx) => {
    body.appendChild(buildItem(tab, sec.id, idx, itemName));
  });

  wrap.appendChild(header);
  wrap.appendChild(body);
  return wrap;
}

function buildItem(tab, secId, idx, name) {
  const s = getState(tab, secId, idx);
  const div = document.createElement('div');
  div.className = `item${s.status ? ' status-' + s.status : ''}`;
  div.id = `item-${tab}-${secId}-${idx}`;

  div.innerHTML = `
    <div class="item-top">
      <span class="item-name">${name}</span>
      <div class="btn-group">
        <button class="btn-status${s.status==='ok'?' active-ok':''}" title="OK" onclick="setStatus('${tab}','${secId}',${idx},'ok')">✔</button>
        <button class="btn-status${s.status==='nok'?' active-nok':''}" title="NOK" onclick="setStatus('${tab}','${secId}',${idx},'nok')">✖</button>
        <button class="btn-status${s.status==='na'?' active-na':''}" title="N/A" onclick="setStatus('${tab}','${secId}',${idx},'na')">—</button>
      </div>
    </div>
    <span class="obs-toggle" onclick="toggleObs('${tab}','${secId}',${idx})">✏ observação</span>
    <div class="item-obs${s.obs ? ' visible' : ''}" id="obs-wrap-${tab}-${secId}-${idx}">
      <textarea class="obs-input" placeholder="Digite uma observação..." oninput="saveObs('${tab}','${secId}',${idx},this.value)">${s.obs}</textarea>
    </div>
  `;
  return div;
}

function setStatus(tab, secId, idx, status) {
  const s = getState(tab, secId, idx);
  s.status = s.status === status ? '' : status;
  const div = document.getElementById(`item-${tab}-${secId}-${idx}`);
  const newDiv = buildItem(tab, secId, idx, DATA[tab].find(x => x.id === secId).items[idx]);
  div.replaceWith(newDiv);
  if (s.status === 'nok') {
    document.getElementById(`obs-wrap-${tab}-${secId}-${idx}`).classList.add('visible');
  }
  updateBadge(tab, secId);
  updateProgress();
}

function toggleObs(tab, secId, idx) {
  document.getElementById(`obs-wrap-${tab}-${secId}-${idx}`).classList.toggle('visible');
}

function saveObs(tab, secId, idx, val) {
  getState(tab, secId, idx).obs = val;
}

function updateBadge(tab, secId) {
  const sec = DATA[tab].find(x => x.id === secId);
  let done = 0, hasNok = false;
  sec.items.forEach((_, idx) => {
    const s = getState(tab, secId, idx);
    if (s.status) done++;
    if (s.status === 'nok') hasNok = true;
  });
  const badge = document.getElementById(`badge-${tab}-${secId}`);
  badge.textContent = `${done}/${sec.items.length}`;
  badge.className = 'section-badge';
  if (done === sec.items.length) {
    badge.classList.add(hasNok ? 'has-nok' : 'all-ok');
  }
}

function updateProgress() {
  let total = 0, done = 0, ok = 0, nok = 0;
  ['cavalo', 'sider', 'rodotrem'].forEach(tab => {
    DATA[tab].forEach(sec => {
      sec.items.forEach((_, idx) => {
        total++;
        const s = getState(tab, sec.id, idx);
        if (s.status) done++;
        if (s.status === 'ok') ok++;
        if (s.status === 'nok') nok++;
      });
    });
  });
  const pct = total ? Math.round(done / total * 100) : 0;
  document.getElementById('pct').textContent = pct + '%';
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('chip-ok').textContent   = `✔ OK: ${ok}`;
  document.getElementById('chip-nok').textContent  = `✖ NOK: ${nok}`;
  document.getElementById('chip-pend').textContent = `⏳ Pendente: ${total - done}`;
}

// ============================================================
// TABS
// ============================================================
function switchTab(name) {
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.classList.toggle('active', ['cavalo', 'sider', 'rodotrem'][i] === name);
  });
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(`tab-${name}`).classList.add('active');
}

// ============================================================
// RESET
// ============================================================
function resetAll() {
  if (!confirm('Resetar todo o checklist?')) return;
  Object.keys(state).forEach(k => { delete state[k]; });
  renderAll();
}

// ============================================================
// PDF via window.print() — layout compacto, sem botão
// ============================================================
function gerarPDF() {
  const tabLabels   = { cavalo: 'CAVALO MECÂNICO', sider: 'SEMIRREBOQUE SIDER', rodotrem: 'RODOTREM 9 EIXOS' };
  const statusLabel = { ok: 'OK', nok: 'NOK', na: 'N/A', '': '---' };
  const statusColor = { ok: '#22c55e', nok: '#ef4444', na: '#9ca3af', '': '#f5a623' };

  // Abas com pelo menos 1 item preenchido
  const abasAtivas = ['cavalo', 'sider', 'rodotrem'].filter(tab =>
    DATA[tab].some(sec => sec.items.some((_, idx) => getState(tab, sec.id, idx).status !== ''))
  );

  if (abasAtivas.length === 0) {
    alert('Nenhuma aba foi preenchida ainda. Preencha pelo menos um item antes de gerar o relatório.');
    return;
  }

  let totalOk = 0, totalNok = 0, totalNa = 0, totalPend = 0;
  abasAtivas.forEach(tab => {
    DATA[tab].forEach(sec => {
      sec.items.forEach((_, idx) => {
        const s = getState(tab, sec.id, idx);
        if      (s.status === 'ok')  totalOk++;
        else if (s.status === 'nok') totalNok++;
        else if (s.status === 'na')  totalNa++;
        else                         totalPend++;
      });
    });
  });

  // Coleta NOKs apenas das abas ativas
  const nokItems = [];
  abasAtivas.forEach(tab => {
    DATA[tab].forEach(sec => {
      sec.items.forEach((itemName, idx) => {
        const s = getState(tab, sec.id, idx);
        if (s.status === 'nok') nokItems.push({ tab, sec: sec.name, name: itemName, obs: s.obs });
      });
    });
  });

  const dataVal = document.getElementById('id-data').value || '—';
  const hora    = document.getElementById('id-hora').value || '—';
  const placaC  = (document.getElementById('id-placa-cavalo').value || '').toUpperCase() || '—';
  const placaS1 = (document.getElementById('id-placa-semi1').value || '').toUpperCase() || '—';
  const placaS2 = (document.getElementById('id-placa-semi2').value || '').toUpperCase();
  const placaS3 = (document.getElementById('id-placa-semi3').value || '').toUpperCase();
  const placaS  = [placaS1, placaS2, placaS3].filter(p => p && p !== '—').join(' / ');
  const motor   = document.getElementById('id-motorista').value || '—';
  const conf    = document.getElementById('id-conferente').value || '—';
  const oper    = document.getElementById('id-operacao').value || '—';
  const gerado  = new Date().toLocaleString('pt-BR');

  // Monta colunas de itens por seção — 2 colunas para compactar
  let detalheHTML = '';
  abasAtivas.forEach(tab => {
    detalheHTML += `<div class="tab-bloco">
      <div class="p-tab-header">${tabLabels[tab]}</div>
      <div class="secoes-grid">`;

    DATA[tab].forEach(sec => {
      let itensHTML = '';
      sec.items.forEach((itemName, idx) => {
        const s   = getState(tab, sec.id, idx);
        const st  = s.status || '';
        const cor = statusColor[st];
        const lbl = statusLabel[st];
        itensHTML += `<div class="p-item${st === 'nok' ? ' p-item-nok' : ''}">
          <span class="p-pill" style="background:${cor}">${lbl}</span>
          <span class="p-item-name">${itemName}</span>
        </div>`;
        if (s.obs) {
          itensHTML += `<div class="p-obs">↳ ${s.obs}</div>`;
        }
      });

      detalheHTML += `<div class="secao-box">
        <div class="p-sec-header">${sec.name.toUpperCase()}</div>
        ${itensHTML}
      </div>`;
    });

    detalheHTML += `</div></div>`;
  });

  // NOKs compactos no rodapé (só se houver)
  let nokHTML = '';
  if (nokItems.length > 0) {
    nokHTML = `<div class="nok-bloco">
      <div class="nok-titulo">⚠ ITENS NÃO CONFORMES</div>
      <div class="nok-grid">`;
    nokItems.forEach((item, i) => {
      nokHTML += `<div class="nok-item">
        <span class="nok-num">${i + 1}</span>
        <div>
          <div class="nok-name">${item.name}</div>
          <div class="nok-sub">${tabLabels[item.tab]} › ${item.sec}</div>
          ${item.obs ? `<div class="nok-obs">Obs: ${item.obs}</div>` : ''}
        </div>
      </div>`;
    });
    nokHTML += `</div></div>`;
  }

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<title>Checklist — ${placaC} — ${dataVal}</title>
<style>
  @page { margin: 10mm 12mm; }
  @media print {
    html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 7.5px; color: #111; background: #fff; }

  /* ── TOPO ── */
  .topo {
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 3px solid #f5a623; padding-bottom: 5px; margin-bottom: 6px;
  }
  .topo-titulo { font-size: 16px; font-weight: 900; color: #f5a623; text-transform: uppercase; letter-spacing: 1px; line-height: 1; }
  .topo-sub    { font-size: 7px; color: #888; text-transform: uppercase; letter-spacing: 2px; }
  .topo-info   { text-align: right; font-size: 7px; color: #555; line-height: 1.6; }
  .topo-info strong { font-size: 11px; color: #111; }

  /* ── IDENTIFICAÇÃO ── */
  .id-row {
    display: grid; grid-template-columns: repeat(6, 1fr);
    gap: 0; border: 1px solid #ddd; border-radius: 4px;
    overflow: hidden; margin-bottom: 6px;
  }
  .id-cell { padding: 3px 6px; border-right: 1px solid #ddd; }
  .id-cell:last-child { border-right: none; }
  .id-label { font-size: 6px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #999; }
  .id-val   { font-size: 8px; font-weight: 700; color: #111; margin-top: 1px; }

  /* ── RESUMO ── */
  .resumo {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 4px; margin-bottom: 7px;
  }
  .r-box { border-radius: 3px; padding: 4px 6px; text-align: center; border: 1.5px solid; }
  .r-num { font-size: 14px; font-weight: 900; line-height: 1; }
  .r-lbl { font-size: 6px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-top: 1px; }
  .r-ok   { border-color: #22c55e; color: #22c55e; }
  .r-nok  { border-color: #ef4444; color: #ef4444; }
  .r-na   { border-color: #9ca3af; color: #9ca3af; }
  .r-pend { border-color: #f5a623; color: #f5a623; }

  /* ── TAB BLOCO ── */
  .tab-bloco { margin-bottom: 6px; }
  .p-tab-header {
    font-size: 8px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase;
    color: #fff; background: #1e2333; padding: 3px 7px;
    border-left: 4px solid #f5a623; margin-bottom: 3px;
  }

  /* ── GRID DE SEÇÕES (2 colunas) ── */
  .secoes-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 4px;
  }
  .secao-box { border: 1px solid #e5e7eb; border-radius: 3px; overflow: hidden; }
  .p-sec-header {
    font-size: 6.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
    color: #fff; background: #374151; padding: 2px 5px;
  }

  /* ── ITEM ── */
  .p-item {
    display: flex; align-items: center; gap: 4px;
    padding: 2px 5px; border-bottom: 1px solid #f3f4f6;
  }
  .p-item:last-child { border-bottom: none; }
  .p-item-nok { background: #fff5f5; }
  .p-item:nth-child(even):not(.p-item-nok) { background: #fafafa; }
  .p-pill {
    display: inline-block; min-width: 22px; text-align: center;
    font-size: 5.5px; font-weight: 800; padding: 1px 3px;
    border-radius: 2px; color: #fff; flex-shrink: 0; letter-spacing: 0.3px;
  }
  .p-item-name { font-size: 7px; color: #222; line-height: 1.3; }
  .p-obs {
    padding: 1px 5px 2px 31px; font-size: 6.5px;
    color: #666; font-style: italic; background: #fffbf0;
    border-bottom: 1px solid #f3f4f6;
  }

  /* ── NOK BLOCO ── */
  .nok-bloco { margin-top: 6px; }
  .nok-titulo {
    font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;
    color: #fff; background: #7f1d1d; padding: 3px 7px;
    border-left: 4px solid #ef4444; margin-bottom: 3px;
  }
  .nok-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3px; }
  .nok-item {
    display: flex; gap: 4px; align-items: flex-start;
    border: 1px solid #fca5a5; border-left: 3px solid #ef4444;
    border-radius: 3px; padding: 3px 5px; background: #fff5f5;
  }
  .nok-num  { font-size: 9px; font-weight: 900; color: #ef4444; flex-shrink: 0; line-height: 1.2; }
  .nok-name { font-size: 7px; font-weight: 700; color: #dc2626; line-height: 1.3; }
  .nok-sub  { font-size: 6px; color: #888; margin-top: 1px; }
  .nok-obs  { font-size: 6px; color: #991b1b; font-style: italic; margin-top: 2px; }

  /* ── RODAPÉ ── */
  .rodape {
    display: flex; justify-content: space-between;
    border-top: 1px solid #e5e7eb; padding-top: 3px;
    margin-top: 6px; font-size: 6px; color: #aaa;
  }
</style>
</head>
<body>

  <!-- TOPO -->
  <div class="topo">
    <div>
      <div class="topo-titulo">Checklist de Frota</div>
      <div class="topo-sub">Conferência de Veículo</div>
    </div>
    <div class="topo-info">
      <strong>${dataVal} ${hora}</strong>
      Operação: ${oper}
    </div>
  </div>

  <!-- IDENTIFICAÇÃO -->
  <div class="id-row">
    <div class="id-cell"><div class="id-label">Placa Cavalo</div><div class="id-val">${placaC}</div></div>
    <div class="id-cell" style="grid-column:span 2"><div class="id-label">Placas Semi</div><div class="id-val">${placaS}</div></div>
    <div class="id-cell"><div class="id-label">Motorista</div><div class="id-val">${motor}</div></div>
    <div class="id-cell"><div class="id-label">Conferente</div><div class="id-val">${conf}</div></div>
    <div class="id-cell" style="border-right:none;grid-column:span 2"><div class="id-label">Gerado em</div><div class="id-val">${gerado}</div></div>
  </div>

  <!-- RESUMO -->
  <div class="resumo">
    <div class="r-box r-ok">  <div class="r-num">${totalOk}</div>  <div class="r-lbl">OK</div></div>
    <div class="r-box r-nok"> <div class="r-num">${totalNok}</div> <div class="r-lbl">NOK</div></div>
    <div class="r-box r-na">  <div class="r-num">${totalNa}</div>  <div class="r-lbl">N/A</div></div>
    <div class="r-box r-pend"><div class="r-num">${totalPend}</div><div class="r-lbl">Pendente</div></div>
  </div>

  <!-- DETALHE -->
  ${detalheHTML}

  <!-- NOK SUMMARY -->
  ${nokHTML}

  <!-- RODAPÉ -->
  <div class="rodape">
    <span>Checklist de Frota — ${placaC} | Semi: ${placaS}</span>
    <span>${dataVal} ${hora} — ${oper}</span>
  </div>

</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) {
    alert('Por favor, permita pop-ups para este arquivo e tente novamente.');
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 600);
}

// ============================================================
// INIT
// ============================================================
function init() {
  const now = new Date();
  document.getElementById('id-data').value = now.toISOString().split('T')[0];
  document.getElementById('id-hora').value = now.toTimeString().slice(0, 5);
  renderAll();
}

init();
