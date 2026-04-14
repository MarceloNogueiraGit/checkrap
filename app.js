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
        'Cintas, catracas, cantoneiras , réguas',
        'Amarrações das lonas',
        'Pino rei — encaixe e condição',
        'Quinta roda — travamento',
        'Lanternas e pisca traseiros (luz de posição, ré)',
        'faixas reflexivas e luz de sinalização laterais',
        'Estepe, extintor (presente e calibrado, extintor na validade)',
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
        'Cintas, catracas, cantoneiras , réguas',
        'Amarrações das lonas',
        'Pino rei do 2º implemento — condição',
        'Lanternas e pisca traseiros',
        'Estepe e extintor do 2º implemento',
      ]
    },
    {
      id: 'rodotrem-geral', icon: '🔧', name: 'Geral Rodotrem',
      items: [
        'Comprimento total dentro do limite (≤30m)',
        'Sinalizações obrigatórias (retrorefletivos laterais)',
        'Luzes de contorno (se exigido)',
      ]
    },
  ]
};

// ============================================================
// STATE
// ============================================================
const state = {};

function getKey(tab, secId, idx) { return `${tab}||${secId}||${idx}`; }

function getState(tab, secId, idx) {
  const k = getKey(tab, secId, idx);
  if (!state[k]) state[k] = { status: '', obs: '', fotos: [] };
  if (!state[k].fotos) state[k].fotos = [];
  return state[k];
}

// ============================================================
// FOTO — captura, compressão e cache em memória
// ============================================================

// Abre input file (câmera no mobile, galeria no desktop)
function abrirCamera(tab, secId, idx) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment'; // câmera traseira no mobile
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    comprimirFoto(file, (dataUrl) => {
      const s = getState(tab, secId, idx);
      s.fotos.push(dataUrl);
      // Re-renderiza só as miniaturas sem reconstruir o item inteiro
      renderFotos(tab, secId, idx);
    });
  };
  input.click();
}

// Comprime a foto para baixa qualidade (max 400px, JPEG 40%)
function comprimirFoto(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 400;
      let w = img.width, h = img.height;
      if (w > h && w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
      else if (h > MAX)     { w = Math.round(w * MAX / h); h = MAX; }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/jpeg', 0.4));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Renderiza miniaturas de fotos dentro do item (sem re-render completo)
function renderFotos(tab, secId, idx) {
  const s = getState(tab, secId, idx);
  const wrap = document.getElementById(`fotos-wrap-${tab}-${secId}-${idx}`);
  if (!wrap) return;
  if (s.fotos.length === 0) {
    wrap.innerHTML = '';
    wrap.classList.remove('visible');
    return;
  }
  wrap.classList.add('visible');
  wrap.innerHTML = s.fotos.map((src, fi) => `
    <div class="foto-thumb-wrap">
      <img class="foto-thumb" src="${src}" alt="foto ${fi+1}"/>
      <button class="foto-del" onclick="deletarFoto('${tab}','${secId}',${idx},${fi})" title="Remover foto">✕</button>
    </div>
  `).join('');
}

function deletarFoto(tab, secId, idx, fi) {
  const s = getState(tab, secId, idx);
  s.fotos.splice(fi, 1);
  renderFotos(tab, secId, idx);
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
  header.addEventListener('click', () => wrap.classList.toggle('collapsed'));

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

  const fotoCount = s.fotos.length;

  div.innerHTML = `
    <div class="item-top">
      <span class="item-name">${name}</span>
      <div class="btn-group">
        <button class="btn-status${s.status==='ok'?' active-ok':''}"  title="OK"  onclick="setStatus('${tab}','${secId}',${idx},'ok')">✔</button>
        <button class="btn-status${s.status==='nok'?' active-nok':''}" title="NOK" onclick="setStatus('${tab}','${secId}',${idx},'nok')">✖</button>
        <button class="btn-status${s.status==='na'?' active-na':''}"   title="N/A" onclick="setStatus('${tab}','${secId}',${idx},'na')">—</button>
        <button class="btn-status btn-cam${fotoCount > 0 ? ' has-foto' : ''}" title="Foto" onclick="abrirCamera('${tab}','${secId}',${idx})">📷${fotoCount > 0 ? `<span class="foto-badge">${fotoCount}</span>` : ''}</button>
      </div>
    </div>
    <span class="obs-toggle" onclick="toggleObs('${tab}','${secId}',${idx})">✏ observação</span>
    <div class="item-obs${s.obs ? ' visible' : ''}" id="obs-wrap-${tab}-${secId}-${idx}">
      <textarea class="obs-input" placeholder="Digite uma observação..." oninput="saveObs('${tab}','${secId}',${idx},this.value)">${s.obs}</textarea>
    </div>
    <div class="fotos-wrap${fotoCount > 0 ? ' visible' : ''}" id="fotos-wrap-${tab}-${secId}-${idx}">
      ${s.fotos.map((src, fi) => `
        <div class="foto-thumb-wrap">
          <img class="foto-thumb" src="${src}" alt="foto ${fi+1}"/>
          <button class="foto-del" onclick="deletarFoto('${tab}','${secId}',${idx},${fi})" title="Remover">✕</button>
        </div>
      `).join('')}
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
// SELETOR DE VEÍCULOS
// ============================================================
function toggleVeiculo(tipo) {
  const item = document.getElementById('vbtn-' + tipo).closest('.veiculo-item');
  item.classList.toggle('active');
}

// ============================================================
// PDF via window.print() — layout compacto, sem botão
// ============================================================
function gerarPDF() {
  const tabLabels   = { cavalo: 'CAVALO MECÂNICO', sider: 'SEMIRREBOQUE SIDER', rodotrem: 'RODOTREM 9 EIXOS' };
  const statusLabel = { ok: 'OK', nok: 'NOK', na: 'N/A', '': '---' };
  const statusColor = { ok: '#22c55e', nok: '#ef4444', na: '#9ca3af', '': '#f5a623' };

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

  const nokItems = [];
  abasAtivas.forEach(tab => {
    DATA[tab].forEach(sec => {
      sec.items.forEach((itemName, idx) => {
        const s = getState(tab, sec.id, idx);
        if (s.status === 'nok') nokItems.push({ tab, sec: sec.name, secId: sec.id, name: itemName, obs: s.obs, fotos: s.fotos || [] });
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

  // ── Detalhe por aba/seção ──
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
        const temFoto = s.fotos && s.fotos.length > 0;
        itensHTML += `<div class="p-item${st === 'nok' ? ' p-item-nok' : ''}">
          <span class="p-pill" style="background:${cor}">${lbl}</span>
          <span class="p-item-name">${itemName}${temFoto ? ' <span class="p-cam-icon">📷</span>' : ''}</span>
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

  // ── Seção de fotos agrupadas por seção ──
  let fotosHTML = '';
  // Coleta todas as seções que têm pelo menos 1 foto em qualquer item
  abasAtivas.forEach(tab => {
    DATA[tab].forEach(sec => {
      const itensComFoto = [];
      sec.items.forEach((itemName, idx) => {
        const s = getState(tab, sec.id, idx);
        if (s.fotos && s.fotos.length > 0) {
          itensComFoto.push({ name: itemName, fotos: s.fotos, obs: s.obs, status: s.status });
        }
      });
      if (itensComFoto.length === 0) return;

      fotosHTML += `
        <div class="foto-grupo">
          <div class="foto-grupo-header">
            <span class="foto-grupo-tab">${tabLabels[tab]}</span>
            <span class="foto-grupo-sec"> › ${sec.name.toUpperCase()}</span>
          </div>`;

      itensComFoto.forEach(item => {
        fotosHTML += `<div class="foto-item-label">${item.name}${item.obs ? ` — <em>${item.obs}</em>` : ''}</div>
          <div class="foto-grid">`;
        item.fotos.forEach((src, fi) => {
          fotosHTML += `<img class="foto-img" src="${src}" alt="foto ${fi+1}"/>`;
        });
        fotosHTML += `</div>`;
      });

      fotosHTML += `</div>`;
    });
  });

  const temFotos = fotosHTML.length > 0;

  // ── NOKs ──
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
          ${item.obs  ? `<div class="nok-obs">Obs: ${item.obs}</div>` : ''}
          ${item.fotos.length > 0 ? `<div class="nok-obs">📷 ${item.fotos.length} foto(s) registrada(s)</div>` : ''}
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

  .topo { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #f5a623; padding-bottom: 5px; margin-bottom: 6px; }
  .topo-titulo { font-size: 16px; font-weight: 900; color: #f5a623; text-transform: uppercase; letter-spacing: 1px; line-height: 1; }
  .topo-sub    { font-size: 7px; color: #888; text-transform: uppercase; letter-spacing: 2px; }
  .topo-info   { text-align: right; font-size: 7px; color: #555; line-height: 1.6; }
  .topo-info strong { font-size: 11px; color: #111; }

  .id-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 0; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; margin-bottom: 6px; }
  .id-cell { padding: 3px 6px; border-right: 1px solid #ddd; }
  .id-cell:last-child { border-right: none; }
  .id-label { font-size: 6px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #999; }
  .id-val   { font-size: 8px; font-weight: 700; color: #111; margin-top: 1px; }

  .resumo { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin-bottom: 7px; }
  .r-box  { border-radius: 3px; padding: 4px 6px; text-align: center; border: 1.5px solid; }
  .r-num  { font-size: 14px; font-weight: 900; line-height: 1; }
  .r-lbl  { font-size: 6px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-top: 1px; }
  .r-ok   { border-color: #22c55e; color: #22c55e; }
  .r-nok  { border-color: #ef4444; color: #ef4444; }
  .r-na   { border-color: #9ca3af; color: #9ca3af; }
  .r-pend { border-color: #f5a623; color: #f5a623; }

  .tab-bloco { margin-bottom: 6px; }
  .p-tab-header { font-size: 8px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; color: #fff; background: #1e2333; padding: 3px 7px; border-left: 4px solid #f5a623; margin-bottom: 3px; }
  .secoes-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
  .secao-box    { border: 1px solid #e5e7eb; border-radius: 3px; overflow: hidden; }
  .p-sec-header { font-size: 6.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #fff; background: #374151; padding: 2px 5px; }

  .p-item { display: flex; align-items: center; gap: 4px; padding: 2px 5px; border-bottom: 1px solid #f3f4f6; }
  .p-item:last-child { border-bottom: none; }
  .p-item-nok { background: #fff5f5; }
  .p-item:nth-child(even):not(.p-item-nok) { background: #fafafa; }
  .p-pill { display: inline-block; min-width: 22px; text-align: center; font-size: 5.5px; font-weight: 800; padding: 1px 3px; border-radius: 2px; color: #fff; flex-shrink: 0; letter-spacing: 0.3px; }
  .p-item-name { font-size: 7px; color: #222; line-height: 1.3; }
  .p-cam-icon  { font-size: 6px; }
  .p-obs { padding: 1px 5px 2px 31px; font-size: 6.5px; color: #666; font-style: italic; background: #fffbf0; border-bottom: 1px solid #f3f4f6; }

  .nok-bloco  { margin-top: 6px; }
  .nok-titulo { font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #fff; background: #7f1d1d; padding: 3px 7px; border-left: 4px solid #ef4444; margin-bottom: 3px; }
  .nok-grid   { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3px; }
  .nok-item   { display: flex; gap: 4px; align-items: flex-start; border: 1px solid #fca5a5; border-left: 3px solid #ef4444; border-radius: 3px; padding: 3px 5px; background: #fff5f5; }
  .nok-num    { font-size: 9px; font-weight: 900; color: #ef4444; flex-shrink: 0; line-height: 1.2; }
  .nok-name   { font-size: 7px; font-weight: 700; color: #dc2626; line-height: 1.3; }
  .nok-sub    { font-size: 6px; color: #888; margin-top: 1px; }
  .nok-obs    { font-size: 6px; color: #991b1b; font-style: italic; margin-top: 2px; }

  /* ── FOTOS ── */
  .foto-secao-titulo { font-size: 8px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; color: #fff; background: #1e3a5f; padding: 3px 7px; border-left: 4px solid #3b82f6; margin: 8px 0 4px; page-break-after: avoid; }
  .foto-grupo { margin-bottom: 8px; page-break-inside: avoid; }
  .foto-grupo-header { background: #f0f4ff; border-left: 3px solid #3b82f6; padding: 2px 6px; margin-bottom: 3px; }
  .foto-grupo-tab  { font-size: 6.5px; font-weight: 900; color: #1e3a5f; text-transform: uppercase; letter-spacing: 1px; }
  .foto-grupo-sec  { font-size: 6.5px; color: #4b5563; }
  .foto-item-label { font-size: 6.5px; color: #374151; font-style: italic; margin: 2px 0 2px 4px; }
  .foto-grid { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 4px; }
  .foto-img  { width: 80px; height: 60px; object-fit: cover; border-radius: 3px; border: 1px solid #e5e7eb; }

  .rodape { display: flex; justify-content: space-between; border-top: 1px solid #e5e7eb; padding-top: 3px; margin-top: 6px; font-size: 6px; color: #aaa; }
</style>
</head>
<body>

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

  <div class="id-row">
    <div class="id-cell"><div class="id-label">Placa Cavalo</div><div class="id-val">${placaC}</div></div>
    <div class="id-cell" style="grid-column:span 2"><div class="id-label">Placas Semi</div><div class="id-val">${placaS}</div></div>
    <div class="id-cell"><div class="id-label">Motorista</div><div class="id-val">${motor}</div></div>
    <div class="id-cell"><div class="id-label">Conferente</div><div class="id-val">${conf}</div></div>
    <div class="id-cell" style="border-right:none"><div class="id-label">Gerado em</div><div class="id-val">${gerado}</div></div>
  </div>

  <div class="resumo">
    <div class="r-box r-ok">  <div class="r-num">${totalOk}</div>  <div class="r-lbl">OK</div></div>
    <div class="r-box r-nok"> <div class="r-num">${totalNok}</div> <div class="r-lbl">NOK</div></div>
    <div class="r-box r-na">  <div class="r-num">${totalNa}</div>  <div class="r-lbl">N/A</div></div>
    <div class="r-box r-pend"><div class="r-num">${totalPend}</div><div class="r-lbl">Pendente</div></div>
  </div>

  ${detalheHTML}
  ${nokHTML}

  ${temFotos ? `<div class="foto-secao-titulo">📷 REGISTROS FOTOGRÁFICOS</div>${fotosHTML}` : ''}

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
