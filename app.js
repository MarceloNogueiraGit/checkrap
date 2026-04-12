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
        'Faróis dianteiros (baixo)',
        'Faróis dianteiros (alto)',
        'Lanternas dianteiras',
        'Lanternas traseiras',
        'Pisca-alertas (4 lados)',
        'Luz de ré',
        'Luz de placa',
        'Tomada elétrica semirreboque (7 pinos)',
      ]
    },
    {
      id: 'documentos', icon: '📄', name: 'Documentos',
      items: [
        'CRLV do cavalo (válido)',
        'CNH do motorista (categoria E, válida)',
        'MOPP (se carga perigosa)',
        'RNTRC / Licença ANTT',
        'Tacógrafo calibrado e lacrado',
        'AET (se carga especial)',
      ]
    },
    {
      id: 'cabine', icon: '🪟', name: 'Cabine / Painel',
      items: [
        'Painel de instrumentos (sem alertas)',
        'Tacógrafo (funcionando / disco inserido)',
        'Rastreador (online e ativo)',
        'Ar-condicionado',
        'Cinto de segurança (motorista)',
        'Cinto de segurança (passageiro)',
        'Retrovisores regulados',
      ]
    },
    {
      id: 'segurança', icon: '🛡️', name: 'Segurança',
      items: [
        'Extintor (validade e fixação)',
        'Macaco hidráulico (presente e funcional)',
        'Chave de roda',
        'Triângulo de sinalização',
      ]
    },
    {
      id: 'motor', icon: '🔧', name: 'Motor / Mecânica',
      items: [
        'Nível do óleo do motor',
        'Nível do óleo do câmbio',
        'Nível do fluido de arrefecimento',
        'Nível do óleo de direção hidráulica',
        'Vazamentos visíveis (motor)',
        'Vazamentos visíveis (câmbio)',
        'Vazamentos visíveis (diferencial)',
        'Correias e mangueiras (aparência)',
      ]
    },
  ],
  sider: [
    {
      id: 'estrutura', icon: '🏗️', name: 'Estrutura / Lona',
      items: [
        'Lonas laterais (rasgos ou furos)',
        'Amarrações das lonas',
        'Longarinas e travessas (danos)',
        'Porta traseira / alçapão',
        'Piso da carroceria',
      ]
    },
    {
      id: 'acoplamento-s', icon: '🔗', name: 'Acoplamento',
      items: [
        'Pino rei (condição e assentamento)',
        'Quinta roda encaixada e travada',
        'Mangueiras de ar conectadas',
        'Cabo elétrico conectado (7 pinos)',
      ]
    },
    {
      id: 'freios-s', icon: '🔴', name: 'Freios / Ar',
      items: [
        'Câmaras de freio (vazamentos)',
        'Freio de mola (funcionamento)',
        'Mangueiras de ar (estado)',
        'Conexões rápidas (estado)',
      ]
    },
    {
      id: 'eletrica-s', icon: '⚡', name: 'Elétrica',
      items: [
        'Lanternas traseiras',
        'Pisca-alertas traseiros',
        'Luz de placa traseira',
        'Lanternas laterais',
      ]
    },
    {
      id: 'pneus-s', icon: '⭕', name: 'Pneus',
      items: [
        'Calibragem (todos os eixos)',
        'Desgaste / sulcos mínimos',
        'Danos visíveis (cortes, bolhas)',
        'Estepe (presente e calibrado)',
      ]
    },
  ],
  rodotrem: [
    {
      id: 'primeiro-impl', icon: '📦', name: '1º Implemento (igual ao Sider)',
      items: [
        'Lonas laterais (rasgos ou furos)',
        'Amarrações das lonas',
        'Estrutura (longarinas e travessas)',
        'Pino rei — encaixe e condição',
        'Quinta roda — travamento',
        'Câmaras de freio (vazamentos)',
        'Mangueiras de ar (estado)',
        'Lanternas e pisca traseiros',
        'Pneus — calibragem e desgaste',
        'Estepe (presente e calibrado)',
      ]
    },
    {
      id: 'gaviao', icon: '🦅', name: 'Gavião (Pino de Conexão)',
      items: [
        'Gavião — condição geral',
        'Pino de conexão travado',
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
        'Pino rei do 2º implemento — condição',
        'Câmaras de freio (vazamentos)',
        'Mangueiras de ar (estado)',
        'Lanternas e pisca traseiros',
        'Pneus — calibragem e desgaste',
        'Estepe do 2º implemento',
      ]
    },
    {
      id: 'rodotrem-geral', icon: '🔧', name: 'Geral Rodotrem',
      items: [
        'Comprimento total dentro do limite (≤30m)',
        'Largura dentro do limite',
        'AET (autorização especial de trânsito) presente',
        'Sinalizações obrigatórias (retrorefletivos laterais)',
        'Luzes de contorno (se exigido)',
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
// PDF via window.print() — sem dependência externa
// ============================================================
function gerarPDF() {
  const tabLabels  = { cavalo: 'CAVALO MECÂNICO', sider: 'SEMIRREBOQUE SIDER', rodotrem: 'RODOTREM 9 EIXOS' };
  const statusLabel = { ok: 'OK', nok: 'NOK', na: 'N/A', '': '---' };
  const statusColor = { ok: '#22c55e', nok: '#ef4444', na: '#6b7280', '': '#f5a623' };

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
  const placaC  = document.getElementById('id-placa-cavalo').value || '—';
  const placaS  = document.getElementById('id-placa-semi').value || '—';
  const motor   = document.getElementById('id-motorista').value || '—';
  const conf    = document.getElementById('id-conferente').value || '—';
  const oper    = document.getElementById('id-operacao').value || '—';
  const gerado  = new Date().toLocaleString('pt-BR');

  // Monta linhas de detalhe apenas das abas ativas
  let detalheHTML = '';
  abasAtivas.forEach(tab => {
    detalheHTML += `<div class="p-tab-header">${tabLabels[tab]}</div>`;
    DATA[tab].forEach(sec => {
      detalheHTML += `<div class="p-sec-header">${sec.icon} ${sec.name.toUpperCase()}</div>`;
      sec.items.forEach((itemName, idx) => {
        const s   = getState(tab, sec.id, idx);
        const st  = s.status || '';
        const cor = statusColor[st];
        const lbl = statusLabel[st];
        detalheHTML += `
          <div class="p-item${st === 'nok' ? ' p-item-nok' : ''}">
            <span class="p-pill" style="background:${cor};color:#000">${lbl}</span>
            <span class="p-item-name">${itemName}</span>
          </div>
          ${s.obs ? `<div class="p-obs">↳ Obs: ${s.obs}</div>` : ''}
        `;
      });
    });
  });

  // Monta HTML do NOK summary
  let nokHTML = '';
  if (nokItems.length > 0) {
    nokHTML = `<div class="p-tab-header p-nok-title">⚠ ITENS NÃO CONFORMES (NOK)</div>`;
    nokItems.forEach((item, i) => {
      nokHTML += `
        <div class="p-nok-item">
          <div class="p-nok-name">${i + 1}. ${item.name}</div>
          <div class="p-nok-sub">${tabLabels[item.tab]} › ${item.sec}</div>
          ${item.obs ? `<div class="p-nok-obs">Obs: ${item.obs}</div>` : ''}
        </div>
      `;
    });
  }

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<title>Checklist Frota — ${placaC} — ${dataVal}</title>
<style>
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display: none; }
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #fff; color: #111; font-size: 11px; }
  .capa { padding: 32px 28px 24px; border-bottom: 4px solid #f5a623; page-break-after: always; }
  .capa-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
  .capa-titulo { font-size: 32px; font-weight: 900; color: #f5a623; letter-spacing: 2px; text-transform: uppercase; line-height: 1; }
  .capa-sub { font-size: 12px; color: #666; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }
  .capa-data { text-align: right; font-size: 10px; color: #888; }
  .capa-data strong { display: block; font-size: 18px; color: #111; font-weight: 800; }
  .id-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid #e0e0e0; border-radius: 6px; overflow: hidden; margin-bottom: 20px; }
  .id-cell { padding: 8px 12px; border-bottom: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0; }
  .id-cell:nth-child(2n) { border-right: none; }
  .id-cell.full { grid-column: 1 / -1; border-right: none; }
  .id-cell:last-child, .id-cell:nth-last-child(2):not(.full) { border-bottom: none; }
  .id-label { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 2px; }
  .id-val { font-size: 13px; font-weight: 600; color: #111; }
  .resumo { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 10px; }
  .resumo-box { border-radius: 6px; padding: 12px 8px; text-align: center; border: 2px solid; }
  .resumo-num { font-size: 28px; font-weight: 900; line-height: 1; }
  .resumo-lbl { font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-top: 3px; }
  .r-ok   { border-color: #22c55e; color: #22c55e; }
  .r-nok  { border-color: #ef4444; color: #ef4444; }
  .r-na   { border-color: #6b7280; color: #6b7280; }
  .r-pend { border-color: #f5a623; color: #f5a623; }
  .detalhe { padding: 16px 28px; }
  .p-tab-header { font-size: 14px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; color: #fff; background: #1e2333; padding: 8px 12px; margin: 16px 0 4px; border-left: 5px solid #f5a623; page-break-after: avoid; }
  .p-sec-header { font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #f5a623; background: #f8f8f8; padding: 5px 10px; border-bottom: 1px solid #e8e8e8; page-break-after: avoid; }
  .p-item { display: flex; align-items: center; gap: 8px; padding: 5px 10px; border-bottom: 1px solid #f0f0f0; page-break-inside: avoid; }
  .p-item-nok { background: #fff5f5; }
  .p-item:nth-child(even) { background: #fafafa; }
  .p-item-nok:nth-child(even) { background: #fff0f0; }
  .p-pill { display: inline-block; min-width: 32px; text-align: center; font-size: 7px; font-weight: 800; padding: 2px 5px; border-radius: 3px; letter-spacing: 0.5px; flex-shrink: 0; }
  .p-item-name { font-size: 10px; color: #222; }
  .p-obs { padding: 3px 10px 5px 50px; font-size: 9px; color: #666; font-style: italic; border-bottom: 1px solid #f0f0f0; }
  .p-nok-title { background: #7f1d1d !important; border-left-color: #ef4444 !important; margin-top: 24px; }
  .p-nok-item { border: 1px solid #fca5a5; border-left: 4px solid #ef4444; border-radius: 4px; padding: 8px 12px; margin: 6px 0; page-break-inside: avoid; background: #fff5f5; }
  .p-nok-name { font-weight: 700; font-size: 11px; color: #dc2626; }
  .p-nok-sub  { font-size: 9px; color: #666; margin-top: 2px; }
  .p-nok-obs  { font-size: 9px; color: #991b1b; font-style: italic; margin-top: 4px; }
  .p-footer { padding: 12px 28px; border-top: 1px solid #e0e0e0; font-size: 8px; color: #aaa; display: flex; justify-content: space-between; margin-top: 20px; }
  .print-btn { display: block; margin: 20px auto; padding: 14px 32px; background: linear-gradient(135deg,#e8521a,#f5a623); border: none; border-radius: 8px; color: #000; font-size: 16px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; }
</style>
</head>
<body>
<button class="print-btn no-print" onclick="window.print()">🖨 Imprimir / Salvar PDF</button>
<div class="capa">
  <div class="capa-header">
    <div>
      <div class="capa-titulo">Checklist</div>
      <div class="capa-sub">Conferência de Frota</div>
    </div>
    <div class="capa-data"><strong>${dataVal}</strong>${hora}</div>
  </div>
  <div class="id-grid">
    <div class="id-cell"><div class="id-label">Placa Cavalo</div><div class="id-val">${placaC}</div></div>
    <div class="id-cell"><div class="id-label">Placa Semirreboque</div><div class="id-val">${placaS}</div></div>
    <div class="id-cell"><div class="id-label">Motorista</div><div class="id-val">${motor}</div></div>
    <div class="id-cell"><div class="id-label">Conferente</div><div class="id-val">${conf}</div></div>
    <div class="id-cell full"><div class="id-label">Operação</div><div class="id-val">${oper}</div></div>
  </div>
  <div class="resumo">
    <div class="resumo-box r-ok">  <div class="resumo-num">${totalOk}</div>  <div class="resumo-lbl">OK</div></div>
    <div class="resumo-box r-nok"> <div class="resumo-num">${totalNok}</div> <div class="resumo-lbl">NOK</div></div>
    <div class="resumo-box r-na">  <div class="resumo-num">${totalNa}</div>  <div class="resumo-lbl">N/A</div></div>
    <div class="resumo-box r-pend"><div class="resumo-num">${totalPend}</div><div class="resumo-lbl">Pendente</div></div>
  </div>
</div>
<div class="detalhe">${detalheHTML}${nokHTML}</div>
<div class="p-footer">
  <span>Checklist de Frota — ${placaC}</span>
  <span>Gerado em: ${gerado}</span>
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
