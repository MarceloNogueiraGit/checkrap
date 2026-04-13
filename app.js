// ─── ESTADO ───────────────────────────────────────────────────────────────────
const equipAtivos = new Set();

// ─── DADOS DOS CHECKLISTS ─────────────────────────────────────────────────────
const itens = {
  cavalo: [
    "Pintura / Defletor de Ar",
    "Parabrisa / Limpadores / Esguicho",
    "Escada / Parachoques / Paralamas",
    "Farol Diant.: Piscas / Milhas / Luz Baixa / Luz Alta (DRL se houver)",
    "Lanterna Tras.: Luz de Posição / Freio / Pisca / Ré",
    "5ª Roda / Gavião / Pino Rei",
    "Conectores e Mangueiras de Ar e Elétrica",
    "Nível de Óleo (Motor / Câmbio / Diferencial)",
    "Nível de Arrefecimento",
    "Óleo e Arrefecimento s/ Vazamentos",
    "Documentação do Cavalo Mecânico",
    "Opacidade",
    "Tacógrafo",
    "Extintor"
  ],
  sider: [
    "Documentação da Carreta",
    "Sinalização Reflexiva Laterais",
    "Luz de Sinalização Laterais",
    "Lanterna Tras.: Luz de Posição / Freio / Pisca / Ré",
    "Porta e Assoalho",
    "Lonas Laterais / Teto / Cabo de Aço",
    "Cintas / Catracas / Cantoneiras / Réguas",
    "Extintor / Estepe",
    "Pés Hidráulicos / Manivela",
    "Paralama / Parachoque / Escada / Degraus"
  ],
  rodotrem_c1: [
    "Documentação da Carreta",
    "Sinalização Reflexiva Laterais",
    "Luz de Sinalização Laterais",
    "Lanterna Tras.: Luz de Posição / Freio / Pisca / Ré",
    "Porta e Assoalho",
    "Lonas Laterais / Teto / Cabo de Aço",
    "Cintas / Catracas / Cantoneiras / Réguas",
    "Extintor / Estepe",
    "Pés Hidráulicos / Manivela",
    "Paralama / Parachoque / Escada / Degraus",
    "5ª Roda / Gavião / Pino Rei"
  ],
  rodotrem_c2: [
    "Documentação da Carreta",
    "Lanterna Tras.: Luz de Posição / Freio / Pisca / Ré",
    "Lonas Laterais / Teto / Cabo de Aço",
    "Cintas / Catracas / Cantoneiras / Réguas",
    "Extintor / Estepe",
    "Pés Hidráulicos / Manivela",
    "Paralama / Parachoque / Escada / Degraus"
  ],
  rodocacamba: [
    "Documentação da Carreta",
    "Sinalização Reflexiva Laterais",
    "Luz de Sinalização Laterais",
    "Lanterna Tras.: Luz de Posição / Freio / Pisca / Ré",
    "Caçamba / Estrutura",
    "Mecanismo de Basculamento",
    "Cilindro Hidráulico / Mangueiras",
    "Extintor / Estepe",
    "Pés Hidráulicos / Manivela",
    "Paralama / Parachoque / Escada / Degraus"
  ]
};

const equipLabels = {
  cavalo:      "Cavalo Mecânico",
  sider:       "Sider",
  rodotrem_c1: "Rodotrem — 1ª Carreta",
  rodotrem_c2: "Rodotrem — 2ª Carreta",
  rodocacamba: "Rodocaçamba"
};

const equipConfig = {
  cavalo:      { badge: "",       color: "var(--accent2)" },
  sider:       { badge: "blue",   color: "#2563eb" },
  rodotrem:    { badge: "green",  color: "#16a34a" },
  rodocacamba: { badge: "purple", color: "#7c3aed" }
};

// ─── MÁSCARAS ─────────────────────────────────────────────────────────────────
function maskPlaca(el) {
  let v = el.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (v.length > 3) v = v.slice(0, 3) + '-' + v.slice(3, 7);
  el.value = v;
}

function maskKm(el) {
  let v = el.value.replace(/\D/g, '');
  v = v.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  el.value = v;
}

// ─── TIPO CHECKLIST ───────────────────────────────────────────────────────────
function toggleTipo(el) {
  document.querySelectorAll('.tipo-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

// ─── EQUIPAMENTOS ─────────────────────────────────────────────────────────────
function toggleEquip(equip) {
  const btn = document.querySelector(`.equip-btn[data-equip="${equip}"]`);
  const fields = document.getElementById('fields-' + equip);

  if (equipAtivos.has(equip)) {
    equipAtivos.delete(equip);
    btn.classList.remove('active');
    if (fields) fields.classList.remove('visible');
  } else {
    equipAtivos.add(equip);
    btn.classList.add('active');
    if (fields) fields.classList.add('visible');
  }
  renderChecklists();
}

// ─── RENDER CHECKLISTS ────────────────────────────────────────────────────────
function renderChecklists() {
  const container = document.getElementById('checklists-container');
  container.innerHTML = '';

  if (equipAtivos.size === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">🚛</div>
        <p>Selecione ao menos um equipamento acima<br>para exibir o checklist</p>
      </div>`;
    return;
  }

  const order = ['cavalo', 'sider', 'rodotrem', 'rodocacamba'];
  order.forEach(equip => {
    if (!equipAtivos.has(equip)) return;

    if (equip === 'rodotrem') {
      renderSection(container, 'rodotrem', equipLabels.rodotrem_c1, 'green', itens.rodotrem_c1, 'rodotrem_c1');
      renderSection(container, 'rodotrem', equipLabels.rodotrem_c2, 'green', itens.rodotrem_c2, 'rodotrem_c2');
    } else {
      const cfg = equipConfig[equip];
      renderSection(container, equip, equipLabels[equip] || equip, cfg.badge, itens[equip], equip);
    }
  });
}

function renderSection(container, equip, label, badgeClass, items, key) {
  const sec = document.createElement('div');
  sec.className = 'checklist-section visible';
  sec.dataset.key = key;

  sec.innerHTML = `
    <div class="section-title" style="margin-top:8px">${label}</div>
    <div class="card">
      <div class="equip-header">
        <span class="equip-badge ${badgeClass}">${label}</span>
      </div>
      ${items.map((item, i) => renderItem(key, i, item)).join('')}
    </div>`;

  container.appendChild(sec);
}

function renderItem(key, i, label) {
  return `
    <div class="item-row" id="row-${key}-${i}">
      <div class="item-main">
        <span class="item-num">${i + 1}</span>
        <span class="item-label">${label}</span>
        <div class="item-btns">
          <button class="st-btn" onclick="setStatus('${key}',${i},'ok',this)">OK</button>
          <button class="st-btn" onclick="setStatus('${key}',${i},'nok',this)">NOK</button>
          <button class="st-btn" onclick="setStatus('${key}',${i},'na',this)">—</button>
          <button class="obs-btn" onclick="toggleObs('${key}',${i},this)" title="Observação">💬</button>
        </div>
      </div>
      <div class="obs-area" id="obs-area-${key}-${i}">
        <textarea placeholder="Observação..." oninput="updateObsBtn('${key}',${i})"></textarea>
      </div>
    </div>`;
}

// ─── STATUS ───────────────────────────────────────────────────────────────────
function setStatus(key, i, status, btn) {
  const row = document.getElementById(`row-${key}-${i}`);
  row.querySelectorAll('.st-btn').forEach(b => b.classList.remove('ok-active', 'nok-active', 'na-active'));
  btn.classList.add(status + '-active');
}

// ─── OBSERVAÇÕES ──────────────────────────────────────────────────────────────
function toggleObs(key, i, btn) {
  const area = document.getElementById(`obs-area-${key}-${i}`);
  area.classList.toggle('open');
  if (area.classList.contains('open')) area.querySelector('textarea').focus();
}

function updateObsBtn(key, i) {
  const area = document.getElementById(`obs-area-${key}-${i}`);
  const ta = area.querySelector('textarea');
  const btn = document.querySelector(`#row-${key}-${i} .obs-btn`);
  btn.classList.toggle('has-obs', ta.value.trim().length > 0);
}

// ─── GERAR PDF ────────────────────────────────────────────────────────────────
function gerarPDF() {
  // Coleta dados de identificação
  const motorista  = document.getElementById('motorista').value  || '—';
  const conferente = document.getElementById('conferente').value || '—';
  const data       = document.getElementById('data').value       || '—';
  const hora       = document.getElementById('hora').value       || '—';
  const tipoAtivo  = document.querySelector('.tipo-btn.active');
  const tipo       = tipoAtivo ? tipoAtivo.querySelector('span').textContent : '—';

  // Monta linhas de placas
  const placaLines = [];
  if (equipAtivos.has('cavalo')) {
    const p = document.getElementById('placa-cavalo').value;
    const k = document.getElementById('km-cavalo').value;
    placaLines.push(`<strong>Cavalo:</strong> ${p || '—'} &nbsp;|&nbsp; <strong>KM:</strong> ${k || '—'}`);
  }
  if (equipAtivos.has('sider')) {
    const p = document.getElementById('placa-sider').value;
    placaLines.push(`<strong>Sider:</strong> ${p || '—'}`);
  }
  if (equipAtivos.has('rodotrem')) {
    const p1 = document.getElementById('placa-rodotrem1').value;
    const p2 = document.getElementById('placa-rodotrem2').value;
    placaLines.push(`<strong>Rodotrem 1ª:</strong> ${p1 || '—'} &nbsp;|&nbsp; <strong>2ª:</strong> ${p2 || '—'}`);
  }
  if (equipAtivos.has('rodocacamba')) {
    const p1 = document.getElementById('placa-rodocacamba1').value;
    const p2 = document.getElementById('placa-rodocacamba2').value;
    const p3 = document.getElementById('placa-rodocacamba3').value;
    placaLines.push(`<strong>Rodocaçamba:</strong> ${p1 || '—'} / ${p2 || '—'} / ${p3 || '—'}`);
  }

  // Conta status
  let cntOk = 0, cntNok = 0, cntNa = 0, cntPend = 0;
  document.querySelectorAll('.item-row').forEach(row => {
    const ok  = row.querySelector('.st-btn.ok-active');
    const nok = row.querySelector('.st-btn.nok-active');
    const na  = row.querySelector('.st-btn.na-active');
    if (ok) cntOk++;
    else if (nok) cntNok++;
    else if (na) cntNa++;
    else cntPend++;
  });

  const geradoEm = new Date().toLocaleString('pt-BR');

  // Monta cabeçalho
  const pdfHeader = document.getElementById('pdf-header');
  pdfHeader.innerHTML = `
    <div class="pdf-title">CHECK<span>LIST</span> DE FROTA</div>
    <div class="pdf-meta">
      <span><strong>Data/Hora:</strong> ${data} ${hora}</span>
      <span><strong>Operação:</strong> ${tipo}</span>
      <span><strong>Motorista:</strong> ${motorista}</span>
      <span><strong>Conferente:</strong> ${conferente}</span>
      ${placaLines.map(l => `<span>${l}</span>`).join('')}
      <span><strong>Gerado em:</strong> ${geradoEm}</span>
    </div>
    <div class="pdf-counters">
      <span class="cnt cnt-ok">✔ OK: ${cntOk}</span>
      <span class="cnt cnt-nok">✘ NOK: ${cntNok}</span>
      <span class="cnt cnt-na">— N/A: ${cntNa}</span>
      <span class="cnt cnt-pend">⚠ Pendente: ${cntPend}</span>
    </div>`;

  // Monta corpo 2 colunas
  const pdfCols = document.getElementById('pdf-cols');
  pdfCols.innerHTML = '';

  const nokList = [];
  const order = ['cavalo', 'sider', 'rodotrem_c1', 'rodotrem_c2', 'rodocacamba'];

  order.forEach(key => {
    if (!itens[key]) return;
    const equip = key.startsWith('rodotrem') ? 'rodotrem' : key;
    if (!equipAtivos.has(equip)) return;

    let rowsHtml = '';
    itens[key].forEach((label, i) => {
      const row = document.getElementById(`row-${key}-${i}`);
      if (!row) return;
      const ok  = row.querySelector('.st-btn.ok-active');
      const nok = row.querySelector('.st-btn.nok-active');
      const na  = row.querySelector('.st-btn.na-active');
      const obs = row.querySelector('textarea').value.trim();

      let statusClass = 'pend', statusLabel = 'PEND';
      if (ok)  { statusClass = 'ok';  statusLabel = 'OK'; }
      if (nok) { statusClass = 'nok'; statusLabel = 'NOK'; }
      if (na)  { statusClass = 'na';  statusLabel = 'N/A'; }

      if (nok) nokList.push({ label, key, sectionLabel: equipLabels[key] || key, obs });

      rowsHtml += `
        <div class="pdf-item">
          <span class="pdf-badge ${statusClass}">${statusLabel}</span>
          <div class="pdf-item-text">
            ${label}
            ${obs ? `<div class="pdf-item-obs">${obs}</div>` : ''}
          </div>
        </div>`;
    });

    const sec = document.createElement('div');
    sec.className = 'pdf-section';
    sec.innerHTML = `
      <div class="pdf-section-header">${equipLabels[key] || key}</div>
      ${rowsHtml}`;
    pdfCols.appendChild(sec);
  });

  // Seção NOK
  if (nokList.length > 0) {
    const nokSec = document.createElement('div');
    nokSec.className = 'pdf-nok-section';
    nokSec.innerHTML = `
      <div class="pdf-nok-header">⚠ Itens Não Conformes (${nokList.length})</div>
      ${nokList.map((n, i) => `
        <div class="pdf-nok-item">
          <strong>${i + 1}. ${n.label}</strong>
          <div class="nok-loc">${n.sectionLabel}</div>
          ${n.obs ? `<div class="nok-obs">${n.obs}</div>` : ''}
        </div>`).join('')}`;
    pdfCols.appendChild(nokSec);
  }

  // Rodapé
  const pdfFooter = document.getElementById('pdf-footer');
  const placaResume = equipAtivos.has('cavalo')
    ? (document.getElementById('placa-cavalo').value || '') : '';
  pdfFooter.innerHTML = `
    <span>Checklist de Frota${placaResume ? ' — ' + placaResume : ''} | ${motorista}</span>
    <span>${data} ${hora} — ${tipo}</span>`;

  window.print();
}

// ─── LIMPAR TUDO ──────────────────────────────────────────────────────────────
function limparTudo() {
  if (!confirm('Deseja limpar todos os dados do checklist?')) return;
  document.querySelectorAll('input[type=text], input[type=date], input[type=time], textarea')
    .forEach(el => el.value = '');
  document.querySelectorAll('.tipo-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.equip-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.equip-fields').forEach(f => f.classList.remove('visible'));
  equipAtivos.clear();
  renderChecklists();
  initDefaults();
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
function initDefaults() {
  const hoje = new Date();
  document.getElementById('data').value = hoje.toISOString().split('T')[0];
  const hh = String(hoje.getHours()).padStart(2, '0');
  const mm = String(hoje.getMinutes()).padStart(2, '0');
  document.getElementById('hora').value = `${hh}:${mm}`;
}

document.addEventListener('DOMContentLoaded', initDefaults);
