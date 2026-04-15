/* ============================================================
   CHECKLIST FROTA — app.js
   ============================================================ */

/* ─── ESTADO ─────────────────────────────────────────────────── */
const equipAtivos = new Set();
const fotosCache  = {}; // { "key-index": [{ dataUrl, compressed }] }

/* ─── DADOS DOS CHECKLISTS ───────────────────────────────────── */
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
  cavalo:      { badge: ""       },
  sider:       { badge: "blue"   },
  rodotrem:    { badge: "green"  },
  rodocacamba: { badge: "purple" }
};

/* ─── MÁSCARAS ───────────────────────────────────────────────── */
function maskPlaca(el) {
  let v = el.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (v.length > 3) v = v.slice(0,3) + '-' + v.slice(3,7);
  el.value = v;
}

function maskKm(el) {
  let v = el.value.replace(/\D/g,'');
  v = v.replace(/\B(?=(\d{3})+(?!\d))/g,'.');
  el.value = v;
}

/* ─── TIPO CHECKLIST (SELECT) ────────────────────────────────── */
function onTipoChange(sel) {
  const val = sel.value;
  // auto-seleciona equipamento se tipo for sider ou rodotrem
  if (val === 'Sider' && !equipAtivos.has('sider')) {
    toggleEquip('sider');
  } else if (val === 'Rodotrem' && !equipAtivos.has('rodotrem')) {
    toggleEquip('rodotrem');
  }
}

/* ─── EQUIPAMENTOS ───────────────────────────────────────────── */
function toggleEquip(equip) {
  const btn    = document.querySelector(`.equip-btn[data-equip="${equip}"]`);
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

/* ─── RENDER CHECKLISTS ──────────────────────────────────────── */
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

  ['cavalo','sider','rodotrem','rodocacamba'].forEach(equip => {
    if (!equipAtivos.has(equip)) return;
    if (equip === 'rodotrem') {
      renderSection(container, 'green',  equipLabels.rodotrem_c1, itens.rodotrem_c1, 'rodotrem_c1');
      renderSection(container, 'green',  equipLabels.rodotrem_c2, itens.rodotrem_c2, 'rodotrem_c2');
    } else {
      renderSection(container, equipConfig[equip].badge, equipLabels[equip], itens[equip], equip);
    }
  });
}

function renderSection(container, badgeClass, label, items, key) {
  const sec = document.createElement('div');
  sec.className = 'checklist-section visible';
  sec.dataset.key = key;
  sec.innerHTML = `
    <div class="section-title" style="margin-top:8px">${label}</div>
    <div class="card">
      <span class="equip-label ${badgeClass}">${label}</span>
      ${items.map((item, i) => renderItem(key, i, item)).join('')}
    </div>`;
  container.appendChild(sec);
}

function renderItem(key, i, label) {
  return `
    <div class="item-row" id="row-${key}-${i}">
      <div class="item-main">
        <span class="item-num">${i+1}</span>
        <span class="item-label">${label}</span>
        <div class="item-btns">
          <button class="st-btn" onclick="setStatus('${key}',${i},'ok',this)">OK</button>
          <button class="st-btn" onclick="setStatus('${key}',${i},'nok',this)">NOK</button>
          <button class="st-btn" onclick="setStatus('${key}',${i},'na',this)">—</button>
          <button class="obs-btn" onclick="toggleObs('${key}',${i},this)" title="Observação">💬</button>
          <button class="cam-btn" onclick="togglePhoto('${key}',${i},this)" title="Foto">📷</button>
        </div>
      </div>
      <div class="obs-area"   id="obs-area-${key}-${i}">
        <textarea placeholder="Observação..." oninput="updateObsBtn('${key}',${i})"></textarea>
      </div>
      <div class="photo-area" id="photo-area-${key}-${i}">
        <button class="photo-add-btn" onclick="triggerCamera('${key}',${i})">＋</button>
        <input type="file" id="file-${key}-${i}" accept="image/*" capture="environment"
               style="display:none" onchange="handlePhoto(event,'${key}',${i})">
      </div>
    </div>`;
}

/* ─── STATUS ─────────────────────────────────────────────────── */
function setStatus(key, i, status, btn) {
  const row = document.getElementById(`row-${key}-${i}`);
  row.querySelectorAll('.st-btn').forEach(b => b.classList.remove('ok-active','nok-active','na-active'));
  btn.classList.add(status + '-active');
}

/* ─── OBSERVAÇÕES ────────────────────────────────────────────── */
function toggleObs(key, i, btn) {
  const area = document.getElementById(`obs-area-${key}-${i}`);
  area.classList.toggle('open');
  if (area.classList.contains('open')) area.querySelector('textarea').focus();
}

function updateObsBtn(key, i) {
  const area = document.getElementById(`obs-area-${key}-${i}`);
  const btn  = document.querySelector(`#row-${key}-${i} .obs-btn`);
  btn.classList.toggle('has-obs', area.querySelector('textarea').value.trim().length > 0);
}

/* ─── FOTOS ──────────────────────────────────────────────────── */
function togglePhoto(key, i, btn) {
  const area = document.getElementById(`photo-area-${key}-${i}`);
  area.classList.toggle('open');
}

function triggerCamera(key, i) {
  document.getElementById(`file-${key}-${i}`).click();
}

function compressImage(file, maxW, maxH, quality) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
        if (h > maxH) { w = Math.round(w * maxH / h); h = maxH; }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function handlePhoto(event, key, i) {
  const file = event.target.files[0];
  if (!file) return;

  // Comprime para cache/preview (media qualidade)
  const compressed = await compressImage(file, 800, 600, 0.6);
  const fotoKey = `${key}-${i}`;
  if (!fotosCache[fotoKey]) fotosCache[fotoKey] = [];
  fotosCache[fotoKey].push(compressed);

  renderPhotoPreviews(key, i);

  // Marca botão e borda
  const camBtn = document.querySelector(`#row-${key}-${i} .cam-btn`);
  camBtn.classList.add('has-photo');
  document.getElementById(`row-${key}-${i}`).classList.add('has-photo');

  // Limpa input para permitir nova foto do mesmo item
  event.target.value = '';
}

function renderPhotoPreviews(key, i) {
  const area    = document.getElementById(`photo-area-${key}-${i}`);
  const fotoKey = `${key}-${i}`;
  const fotos   = fotosCache[fotoKey] || [];

  // Remove previews existentes, mantém botão e input
  area.querySelectorAll('.photo-preview').forEach(el => el.remove());
  const addBtn  = area.querySelector('.photo-add-btn');

  fotos.forEach((src, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'photo-preview';
    wrap.innerHTML = `
      <img src="${src}" alt="foto ${idx+1}">
      <button class="photo-remove" onclick="removePhoto('${key}',${i},${idx})">✕</button>`;
    area.insertBefore(wrap, addBtn);
  });
}

function removePhoto(key, i, idx) {
  const fotoKey = `${key}-${i}`;
  fotosCache[fotoKey].splice(idx, 1);
  renderPhotoPreviews(key, i);

  if (!fotosCache[fotoKey].length) {
    document.querySelector(`#row-${key}-${i} .cam-btn`).classList.remove('has-photo');
    document.getElementById(`row-${key}-${i}`).classList.remove('has-photo');
  }
}

/* ─── GERAR PDF ──────────────────────────────────────────────── */
function gerarPDF() {

  // — Identificação
  const motorista  = document.getElementById('motorista').value  || '—';
  const conferente = document.getElementById('conferente').value || '—';
  const data       = document.getElementById('data').value       || '—';
  const hora       = document.getElementById('hora').value       || '—';
  const tipoSel    = document.getElementById('tipo-select');
  const tipo       = tipoSel && tipoSel.value ? tipoSel.value : '—';

  // — Placas
  const placaLines = [];
  if (equipAtivos.has('cavalo')) {
    const p = document.getElementById('placa-cavalo').value;
    const k = document.getElementById('km-cavalo').value;
    placaLines.push(`<strong>Cavalo:</strong> ${p||'—'} &nbsp;|&nbsp; <strong>KM:</strong> ${k||'—'}`);
  }
  if (equipAtivos.has('sider')) {
    placaLines.push(`<strong>Sider:</strong> ${document.getElementById('placa-sider').value||'—'}`);
  }
  if (equipAtivos.has('rodotrem')) {
    const p1 = document.getElementById('placa-rodotrem1').value;
    const p2 = document.getElementById('placa-rodotrem2').value;
    placaLines.push(`<strong>Rodotrem 1ª:</strong> ${p1||'—'} &nbsp;|&nbsp; <strong>2ª:</strong> ${p2||'—'}`);
  }
  if (equipAtivos.has('rodocacamba')) {
    const p1 = document.getElementById('placa-rodocacamba1').value;
    const p2 = document.getElementById('placa-rodocacamba2').value;
    const p3 = document.getElementById('placa-rodocacamba3').value;
    placaLines.push(`<strong>Rodocaçamba:</strong> ${p1||'—'} / Dolly: ${p2||'—'} / ${p3||'—'}`);
  }

  // — Nome do arquivo PDF
  let nomePDF = 'Checklist';
  if (equipAtivos.has('cavalo')) {
    const p = document.getElementById('placa-cavalo').value;
    if (p) nomePDF = `Checklist-${p}`;
  } else {
    // Pega a primeira placa disponível
    const primeiraPlaca =
      (equipAtivos.has('sider')       && document.getElementById('placa-sider').value)       ||
      (equipAtivos.has('rodotrem')    && document.getElementById('placa-rodotrem1').value)    ||
      (equipAtivos.has('rodocacamba') && document.getElementById('placa-rodocacamba1').value) ||
      null;
    if (primeiraPlaca) nomePDF = `Checklist-${primeiraPlaca}`;
  }

  // — Contadores
  let cntOk = 0, cntNok = 0, cntNa = 0, cntPend = 0;
  document.querySelectorAll('.item-row').forEach(row => {
    if      (row.querySelector('.st-btn.ok-active'))  cntOk++;
    else if (row.querySelector('.st-btn.nok-active')) cntNok++;
    else if (row.querySelector('.st-btn.na-active'))  cntNa++;
    else                                               cntPend++;
  });

  // — Cabeçalho PDF
  document.getElementById('pdf-header').innerHTML = `
    <div class="pdf-title">CHECK<span>LIST</span> DE FROTA</div>
    <div class="pdf-meta">
      <span><strong>Data/Hora:</strong> ${data} ${hora}</span>
      <span><strong>Operação:</strong> ${tipo}</span>
      <span><strong>Motorista:</strong> ${motorista}</span>
      <span><strong>Conferente:</strong> ${conferente}</span>
      ${placaLines.map(l => `<span>${l}</span>`).join('')}
    </div>
    <div class="pdf-counters">
      <span class="cnt cnt-ok">✔ OK: ${cntOk}</span>
      <span class="cnt cnt-nok">✘ NOK: ${cntNok}</span>
      <span class="cnt cnt-na">— N/A: ${cntNa}</span>
      <span class="cnt cnt-pend">⚠ Pendente: ${cntPend}</span>
    </div>`;

  // — Corpo 2 colunas
  const pdfCols = document.getElementById('pdf-cols');
  pdfCols.innerHTML = '';
  const nokList    = [];
  const fotosGrupo = {}; // { sectionLabel: [{ label, fotos }] }

  ['cavalo','sider','rodotrem_c1','rodotrem_c2','rodocacamba'].forEach(key => {
    if (!itens[key]) return;
    const equipBase = key.startsWith('rodotrem') ? 'rodotrem' : key;
    if (!equipAtivos.has(equipBase)) return;

    const secLabel = equipLabels[key] || key;
    let rowsHtml = '';

    itens[key].forEach((label, i) => {
      const row = document.getElementById(`row-${key}-${i}`);
      if (!row) return;
      const isOk  = row.querySelector('.st-btn.ok-active');
      const isNok = row.querySelector('.st-btn.nok-active');
      const isNa  = row.querySelector('.st-btn.na-active');
      const obs   = row.querySelector('textarea').value.trim();
      const fotos = fotosCache[`${key}-${i}`] || [];

      let sc = 'pend', sl = 'PEND';
      if (isOk)  { sc = 'ok';  sl = 'OK';  }
      if (isNok) { sc = 'nok'; sl = 'NOK'; nokList.push({ label, sectionLabel: secLabel, obs }); }
      if (isNa)  { sc = 'na';  sl = 'N/A'; }

      rowsHtml += `
        <div class="pdf-item">
          <span class="pdf-badge ${sc}">${sl}</span>
          <div class="pdf-item-text">
            ${label}
            ${obs ? `<div class="pdf-item-obs">${obs}</div>` : ''}
          </div>
        </div>`;

      // Coleta fotos para o grupo
      if (fotos.length) {
        if (!fotosGrupo[secLabel]) fotosGrupo[secLabel] = [];
        fotos.forEach(f => fotosGrupo[secLabel].push({ label, src: f }));
      }
    });

    const sec = document.createElement('div');
    sec.className = 'pdf-section';
    sec.innerHTML = `<div class="pdf-section-header">${secLabel}</div>${rowsHtml}`;
    pdfCols.appendChild(sec);
  });

  // — Fotos agrupadas por seção (2 colunas)
  Object.entries(fotosGrupo).forEach(([grupo, fotos]) => {
    const fotoSec = document.createElement('div');
    fotoSec.className = 'pdf-photos-section';
    fotoSec.innerHTML = `
      <div class="pdf-photos-header">📷 Registros Fotográficos — ${grupo}</div>
      <div class="pdf-photos-grid">
        ${fotos.map(f => `
          <div class="pdf-photo-item">
            <img src="${f.src}" alt="${f.label}">
            <div class="pdf-photo-caption">${f.label}</div>
          </div>`).join('')}
      </div>`;
    pdfCols.appendChild(fotoSec);
  });

  // — Seção NOK
  if (nokList.length > 0) {
    const nokSec = document.createElement('div');
    nokSec.className = 'pdf-nok-section';
    nokSec.innerHTML = `
      <div class="pdf-nok-header">⚠ Itens Não Conformes (${nokList.length})</div>
      ${nokList.map((n,i) => `
        <div class="pdf-nok-item">
          <strong>${i+1}. ${n.label}</strong>
          <div class="nok-loc">${n.sectionLabel}</div>
          ${n.obs ? `<div class="nok-obs">${n.obs}</div>` : ''}
        </div>`).join('')}`;
    pdfCols.appendChild(nokSec);
  }

  // — Rodapé
  const placaResume = equipAtivos.has('cavalo') ? (document.getElementById('placa-cavalo').value||'') : '';
  document.getElementById('pdf-footer').innerHTML = `
    <span>Checklist de Frota${placaResume ? ' — '+placaResume : ''} | ${motorista}</span>
    <span>${data} ${hora} — ${tipo}</span>`;

  // — Salvar no histórico
  salvarHistorico(motorista, conferente, data, hora, tipo, nomePDF, cntOk, cntNok, cntPend);

  // — Nomear e imprimir
  const tituloOriginal = document.title;
  document.title = nomePDF;
  window.print();
  document.title = tituloOriginal;
}

/* ─── HISTÓRICO (localStorage) ───────────────────────────────── */
const DB_KEY = 'checklist_frota_historico';

function salvarHistorico(motorista, conferente, data, hora, tipo, nomePDF, ok, nok, pend) {
  const historico = JSON.parse(localStorage.getItem(DB_KEY) || '[]');

  // Monta placas para busca
  const placas = [];
  if (equipAtivos.has('cavalo'))      placas.push(document.getElementById('placa-cavalo').value);
  if (equipAtivos.has('sider'))       placas.push(document.getElementById('placa-sider').value);
  if (equipAtivos.has('rodotrem'))    placas.push(document.getElementById('placa-rodotrem1').value, document.getElementById('placa-rodotrem2').value);
  if (equipAtivos.has('rodocacamba')) placas.push(document.getElementById('placa-rodocacamba1').value, document.getElementById('placa-rodocacamba2').value, document.getElementById('placa-rodocacamba3').value);

  // Monta snapshot dos itens
  const snapshot = [];
  ['cavalo','sider','rodotrem_c1','rodotrem_c2','rodocacamba'].forEach(key => {
    const equipBase = key.startsWith('rodotrem') ? 'rodotrem' : key;
    if (!equipAtivos.has(equipBase)) return;
    itens[key].forEach((label, i) => {
      const row = document.getElementById(`row-${key}-${i}`);
      if (!row) return;
      const isOk  = row.querySelector('.st-btn.ok-active');
      const isNok = row.querySelector('.st-btn.nok-active');
      const isNa  = row.querySelector('.st-btn.na-active');
      const obs   = row.querySelector('textarea').value.trim();
      snapshot.push({
        secao: equipLabels[key]||key,
        item: label,
        status: isOk?'ok': isNok?'nok': isNa?'na':'pend',
        obs
      });
    });
  });

  const registro = {
    id:          Date.now(),
    nomePDF,
    motorista,
    conferente,
    data,
    hora,
    tipo,
    placas:      placas.filter(Boolean),
    equipamentos: [...equipAtivos],
    cntOk:  ok,
    cntNok: nok,
    cntPend: pend,
    itens:  snapshot,
    geradoEm: new Date().toISOString()
  };

  historico.unshift(registro); // mais recente primeiro

  // Limita a 200 registros
  if (historico.length > 200) historico.splice(200);

  localStorage.setItem(DB_KEY, JSON.stringify(historico));
}

function carregarHistorico(filtro = '') {
  const historico = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
  const body = document.getElementById('hist-body');

  const filtrado = filtro
    ? historico.filter(r =>
        r.placas.some(p => p.toUpperCase().includes(filtro.toUpperCase())) ||
        (r.motorista||'').toUpperCase().includes(filtro.toUpperCase())
      )
    : historico;

  if (!filtrado.length) {
    body.innerHTML = `<div class="hist-empty">Nenhum checklist encontrado.</div>`;
    return;
  }

  body.innerHTML = filtrado.map(r => `
    <div class="hist-item">
      <div class="hist-item-top">
        <span class="hist-placa">${r.placas.join(' / ') || r.nomePDF}</span>
        <span class="hist-date">${r.data} ${r.hora}</span>
      </div>
      <div class="hist-info">${r.motorista} &nbsp;·&nbsp; ${r.conferente} &nbsp;·&nbsp; ${r.tipo}</div>
      <div class="hist-badges">
        <span class="hist-badge ok">✔ ${r.cntOk} OK</span>
        ${r.cntNok  ? `<span class="hist-badge nok">✘ ${r.cntNok} NOK</span>` : ''}
        ${r.cntPend ? `<span class="hist-badge pend">⚠ ${r.cntPend} Pend.</span>` : ''}
      </div>
    </div>`).join('');
}

function abrirHistorico() {
  carregarHistorico();
  document.getElementById('modal-historico').classList.add('open');
}

function fecharHistorico() {
  document.getElementById('modal-historico').classList.remove('open');
}

/* ─── LIMPAR TUDO ────────────────────────────────────────────── */
function limparTudo() {
  if (!confirm('Deseja limpar todos os dados do checklist?')) return;
  document.querySelectorAll('input[type=text], input[type=date], input[type=time], textarea')
    .forEach(el => el.value = '');
  const sel = document.getElementById('tipo-select');
  if (sel) sel.selectedIndex = 0;
  document.querySelectorAll('.equip-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.equip-fields').forEach(f => f.classList.remove('visible'));
  equipAtivos.clear();
  Object.keys(fotosCache).forEach(k => delete fotosCache[k]);
  renderChecklists();
  initDefaults();
}

/* ─── INIT ───────────────────────────────────────────────────── */
function initDefaults() {
  const hoje = new Date();
  document.getElementById('data').value = hoje.toISOString().split('T')[0];
  const hh = String(hoje.getHours()).padStart(2,'0');
  const mm = String(hoje.getMinutes()).padStart(2,'0');
  document.getElementById('hora').value = `${hh}:${mm}`;
}

document.addEventListener('DOMContentLoaded', () => {
  initDefaults();

  // Pesquisa no histórico
  const searchInput = document.getElementById('hist-search');
  if (searchInput) {
    searchInput.addEventListener('input', e => carregarHistorico(e.target.value));
  }

  // Fecha modal clicando fora
  document.getElementById('modal-historico').addEventListener('click', e => {
    if (e.target === e.currentTarget) fecharHistorico();
  });
});
