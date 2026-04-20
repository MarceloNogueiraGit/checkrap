// ==============================
// CHECKLIST DE EQUIPAMENTOS
// ==============================

const MESES = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
const ANO_BASE = new Date().getFullYear();
const ANOS = Array.from({length: 6}, (_,i) => ANO_BASE + i);

let implementoSelecionado = null;
let checklistCount = 0;

// ---- ITENS BASE ----
function itensBase() {
  return [
    { id: 'extintor', nome: 'Extintor', temData: true },
    { id: 'pneus', nome: 'Pneus', temData: false },
    { id: 'estepe1', nome: 'Estepe 1', temData: false },
    { id: 'estepe2', nome: 'Estepe 2', temData: false },
    { id: 'cantoneiras', nome: 'Cantoneiras', temData: false },
    { id: 'catracas', nome: 'Catracas Fixas/Avulsas', temData: false },
    { id: 'reguas', nome: 'Réguas', temData: false },
    { id: 'cintas', nome: 'Cintas', temData: false },
    { id: 'lona_teto', nome: 'Lona Teto e Lateral', temData: false },
    { id: 'faixas', nome: 'Faixas Reflexivas', temData: false },
    { id: 'portas', nome: 'Portas', temData: false },
  ];
}

// ---- FORMATAÇÃO DE PLACA ----
function formatarPlaca(val) {
  let v = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
  // Padrão Mercosul: ABC1D23 -> ABC1D23 (7 chars)
  // Padrão antigo: ABC1234 -> ABC-1234
  if (v.length <= 3) return v;
  if (v.length <= 7) {
    // Mercosul: 3 letras + 1 número + 1 letra + 2 números
    const mercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    const antigo = /^[A-Z]{3}[0-9]{4}$/;
    const partial = v;
    // Inserir hífen após 3 chars
    return partial.slice(0,3) + (partial.length > 3 ? '-' + partial.slice(3) : '');
  }
  return v.slice(0,7);
}

function onPlacaInput(e) {
  const pos = e.target.selectionStart;
  const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0,7);
  const formatted = formatarPlaca(raw);
  e.target.value = formatted;
}

// ---- SELEÇÃO DE IMPLEMENTO ----
function selecionarImplemento(tipo) {
  implementoSelecionado = tipo;
  document.querySelectorAll('.implemento-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.implemento-btn[data-tipo="${tipo}"]`).classList.add('active');
  document.getElementById('implemento-area').style.display = 'block';
  document.getElementById('checklist-area').style.display = 'block';
  // Limpar checklists ao trocar implemento
  document.getElementById('checklists-container').innerHTML = '';
  checklistCount = 0;
}

// ---- CRIAR CHECKLIST ----
function criarChecklist() {
  if (!implementoSelecionado) return;
  checklistCount++;

  const container = document.getElementById('checklists-container');
  const isRodotrem = implementoSelecionado === 'rodotrem';
  const numCarretas = isRodotrem ? 2 : 1;

  const block = document.createElement('div');
  block.className = 'checklist-block';
  block.dataset.id = checklistCount;

  let headerHTML = `
    <div class="checklist-header">
      <div class="checklist-header-left">
        <span class="checklist-number">#${checklistCount}</span>
        <span class="checklist-tipo">${isRodotrem ? 'Rodotrem 9 Eixos' : 'Vanderleia'}</span>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
  `;

  if (isRodotrem) {
    headerHTML += `
      <div class="placa-field">
        <label>Placa C1:</label>
        <input type="text" class="placa-input" placeholder="AAA-0000" maxlength="8" oninput="onPlacaInput(event)" data-placa="carreta1">
      </div>
      <div class="placa-field">
        <label>Placa C2:</label>
        <input type="text" class="placa-input" placeholder="AAA-0000" maxlength="8" oninput="onPlacaInput(event)" data-placa="carreta2">
      </div>
    `;
  } else {
    headerHTML += `
      <div class="placa-field">
        <label>Placa:</label>
        <input type="text" class="placa-input" placeholder="AAA-0000" maxlength="8" oninput="onPlacaInput(event)" data-placa="vanderleia">
      </div>
    `;
  }

  headerHTML += `
        <button class="btn-remove-checklist" onclick="removerChecklist(this)" title="Remover este checklist">✕ Remover</button>
      </div>
    </div>
  `;

  let itemsHTML = '<div class="checklist-items">';

  if (isRodotrem) {
    for (let c = 1; c <= 2; c++) {
      itemsHTML += `<div class="section-label">▸ Carreta ${c}</div>`;
      itemsBase().forEach(item => {
        itemsHTML += renderItem(`${item.id}_c${c}`, item.nome, item.temData);
      });
    }
  } else {
    itensBase().forEach(item => {
      itemsHTML += renderItem(item.id, item.nome, item.temData);
    });
  }

  itemsHTML += '</div>';

  block.innerHTML = headerHTML + itemsHTML;
  container.appendChild(block);

  // Scroll para o novo checklist
  setTimeout(() => block.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

function removerChecklist(btn) {
  const block = btn.closest('.checklist-block');
  if (confirm('Remover este checklist?')) {
    block.style.opacity = '0';
    block.style.transform = 'translateY(-10px)';
    block.style.transition = 'all 0.2s';
    setTimeout(() => block.remove(), 200);
  }
}

// ---- RENDER ITEM ----
function renderItem(uid, nome, temData) {
  const mesesOptions = MESES.map(m =>
    `<option value="${m}">${m}</option>`
  ).join('');
  const anosOptions = ANOS.map(a =>
    `<option value="${a}">${a}</option>`
  ).join('');

  return `
    <div class="item-row" id="row-${uid}">
      <div class="item-main">
        <span class="item-name">${nome}</span>
        <div class="status-buttons">
          <button class="btn-status btn-ok" onclick="setStatus('${uid}','ok',this)">OK</button>
          <button class="btn-status btn-nok" onclick="setStatus('${uid}','nok',this)">NOK</button>
          <button class="btn-status btn-atencao" onclick="setStatus('${uid}','atencao',this)">—</button>
        </div>
        <button class="btn-obs" id="btnobs-${uid}" onclick="toggleObs('${uid}')">+ OBS</button>
      </div>
      ${temData ? `
      <div class="item-extras">
        <div class="extintor-data">
          <label>Validade:</label>
          <select id="mes-${uid}">${mesesOptions}</select>
          <select id="ano-${uid}">${anosOptions}</select>
        </div>
      </div>` : ''}
      <div class="obs-field" id="obsfield-${uid}" style="display:none;">
        <textarea placeholder="OBSERVAÇÃO..." oninput="this.value=this.value.toUpperCase();checkObs('${uid}')"></textarea>
      </div>
    </div>
  `;
}

function setStatus(uid, status, btn) {
  const row = document.getElementById(`row-${uid}`);
  row.classList.remove('status-ok','status-nok','status-atencao');
  row.querySelectorAll('.btn-status').forEach(b => b.classList.remove('active'));
  row.classList.add(`status-${status}`);
  btn.classList.add('active');
}

function toggleObs(uid) {
  const field = document.getElementById(`obsfield-${uid}`);
  const btn = document.getElementById(`btnobs-${uid}`);
  const visible = field.style.display !== 'none';
  field.style.display = visible ? 'none' : 'block';
  btn.textContent = visible ? '+ OBS' : '− OBS';
  if (!visible) field.querySelector('textarea').focus();
}

function checkObs(uid) {
  const btn = document.getElementById(`btnobs-${uid}`);
  const ta = document.querySelector(`#obsfield-${uid} textarea`);
  if (ta && ta.value.trim()) {
    btn.classList.add('has-obs');
  } else {
    btn.classList.remove('has-obs');
  }
}

// ---- UPPERCASE em campos gerais ----
document.addEventListener('input', function(e) {
  if (e.target.tagName === 'INPUT' && !e.target.classList.contains('placa-input')) {
    e.target.value = e.target.value.toUpperCase();
  }
});

// ---- DATETIME AUTO ----
function setDateTimeNow() {
  const now = new Date();
  const pad = n => String(n).padStart(2,'0');
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const dateEl = document.getElementById('data-vistoria');
  const timeEl = document.getElementById('hora-vistoria');
  if (dateEl && !dateEl.value) dateEl.value = dateStr;
  if (timeEl && !timeEl.value) timeEl.value = timeStr;
}

// ---- GERAR PDF ----
function gerarPDF() {
  const conferente = document.getElementById('conferente').value || '—';
  const dataVal = document.getElementById('data-vistoria').value;
  const horaVal = document.getElementById('hora-vistoria').value;

  const dataFmt = dataVal ? (() => {
    const [y,m,d] = dataVal.split('-');
    return `${d}/${m}/${y}`;
  })() : '—';
  const horaFmt = horaVal || '—';

  const implementoLabel = implementoSelecionado === 'rodotrem' ? 'RODOTREM 9 EIXOS' : 'VANDERLEIA';

  // Coletar todos os checklists
  const blocks = document.querySelectorAll('.checklist-block');
  if (blocks.length === 0) {
    alert('Adicione pelo menos um checklist antes de gerar o PDF.');
    return;
  }

  let checklistsData = [];

  blocks.forEach((block, idx) => {
    const placas = {};
    block.querySelectorAll('.placa-input').forEach(inp => {
      placas[inp.dataset.placa] = inp.value || '—';
    });

    const secoes = [];
    let secaoAtual = null;

    // Percorrer items e section-labels
    const children = block.querySelector('.checklist-items').children;
    for (const child of children) {
      if (child.classList.contains('section-label')) {
        secaoAtual = { label: child.textContent.replace('▸','').trim(), itens: [] };
        secoes.push(secaoAtual);
      } else if (child.classList.contains('item-row')) {
        const nome = child.querySelector('.item-name').textContent;
        const statusClass = [...child.classList].find(c => c.startsWith('status-'));
        const status = statusClass ? statusClass.replace('status-','').toUpperCase() : '—';
        const ta = child.querySelector('textarea');
        const obs = ta ? ta.value.trim() : '';

        // Data extintor
        const mesEl = child.querySelector('[id^="mes-"]');
        const anoEl = child.querySelector('[id^="ano-"]');
        const dataExt = mesEl && anoEl ? `${mesEl.value}/${anoEl.value}` : null;

        const item = { nome, status, obs, dataExt };
        if (secaoAtual) {
          secaoAtual.itens.push(item);
        } else {
          if (!secoes.length) secoes.push({ label: null, itens: [] });
          secoes[0].itens.push(item);
        }
      }
    }

    checklistsData.push({ idx: idx+1, placas, secoes });
  });

  // ---- MONTAR HTML DO PDF ----
  const statusColor = s => {
    if (s === 'OK') return '#16a34a';
    if (s === 'NOK') return '#dc2626';
    if (s === 'ATENCAO') return '#d97706';
    return '#6b7280';
  };
  const statusLabel = s => {
    if (s === 'OK') return 'OK';
    if (s === 'NOK') return 'NOK';
    if (s === 'ATENCAO') return 'ATENÇÃO';
    return '—';
  };

  const renderItemPDF = (item) => {
    const cor = statusColor(item.status);
    const label = statusLabel(item.status);
    return `
      <div class="pdf-item" style="border-left:3px solid ${cor};">
        <div class="pdf-item-row">
          <span class="pdf-item-nome">${item.nome}</span>
          <span class="pdf-item-status" style="color:${cor};">${label}</span>
        </div>
        ${item.dataExt ? `<div class="pdf-item-extra"><b>Validade:</b> ${item.dataExt}</div>` : ''}
        ${item.obs ? `<div class="pdf-item-obs">OBS: ${item.obs}</div>` : ''}
      </div>
    `;
  };

  const renderChecklistPDF = (cl) => {
    const placaStr = Object.entries(cl.placas)
      .map(([k,v]) => {
        const label = k === 'carreta1' ? 'C1' : k === 'carreta2' ? 'C2' : 'PL';
        return `<span class="pdf-placa">${label}: <b>${v}</b></span>`;
      }).join(' ');

    let html = `
      <div class="pdf-checklist">
        <div class="pdf-checklist-header">
          <span class="pdf-num">#${cl.idx}</span>
          <span class="pdf-tipo">${implementoLabel}</span>
          <span class="pdf-placas">${placaStr}</span>
        </div>
    `;

    cl.secoes.forEach(s => {
      if (s.label) {
        html += `<div class="pdf-secao">${s.label}</div>`;
      }
      html += '<div class="pdf-cols">';
      const metade = Math.ceil(s.itens.length / 2);
      html += '<div class="pdf-col">';
      s.itens.slice(0, metade).forEach(i => { html += renderItemPDF(i); });
      html += '</div><div class="pdf-col">';
      s.itens.slice(metade).forEach(i => { html += renderItemPDF(i); });
      html += '</div></div>';
    });

    html += '</div>';
    return html;
  };

  const todosChecklists = checklistsData.map(cl => renderChecklistPDF(cl)).join('');

  const htmlPDF = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Checklist de Equipamentos</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12px;
    color: #111;
    background: #fff;
    padding: 10mm 10mm 10mm 10mm;
  }
  @page { size: A4; margin: 10mm; }

  .pdf-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 2px solid #111;
    padding-bottom: 6px;
    margin-bottom: 10px;
  }
  .pdf-title {
    font-size: 15px;
    font-weight: bold;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .pdf-meta {
    font-size: 11px;
    text-align: right;
    line-height: 1.6;
  }
  .pdf-meta b { font-weight: bold; }

  .pdf-checklist {
    margin-bottom: 12px;
    page-break-inside: avoid;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
  }
  .pdf-checklist-header {
    background: #222;
    color: #fff;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .pdf-num {
    background: #f0a500;
    color: #000;
    font-weight: bold;
    font-size: 11px;
    border-radius: 3px;
    padding: 1px 6px;
  }
  .pdf-tipo { font-weight: bold; font-size: 12px; text-transform: uppercase; }
  .pdf-placas { font-size: 11px; margin-left: auto; }
  .pdf-placa { margin-left: 8px; }

  .pdf-secao {
    background: #f5f5f5;
    font-weight: bold;
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 3px 10px;
    border-top: 1px solid #ddd;
    color: #555;
  }

  .pdf-cols {
    display: flex;
    gap: 0;
  }
  .pdf-col {
    flex: 1;
    padding: 4px 6px;
    border-right: 1px solid #eee;
  }
  .pdf-col:last-child { border-right: none; }

  .pdf-item {
    border-left: 3px solid #999;
    padding: 3px 6px;
    margin-bottom: 4px;
    background: #fafafa;
    border-radius: 0 3px 3px 0;
  }
  .pdf-item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
  }
  .pdf-item-nome { font-size: 11px; font-weight: 500; }
  .pdf-item-status { font-size: 11px; font-weight: bold; }
  .pdf-item-extra { font-size: 10px; color: #333; margin-top: 1px; }
  .pdf-item-obs { font-size: 10px; color: #555; font-style: italic; margin-top: 1px; }
</style>
</head>
<body>
  <div class="pdf-header">
    <div class="pdf-title">Checklist de Equipamentos</div>
    <div class="pdf-meta">
      Conferente: <b>${conferente}</b><br>
      Data: <b>${dataFmt}</b> &nbsp; Hora: <b>${horaFmt}</b>
    </div>
  </div>
  ${todosChecklists}
</body>
</html>`;

  const win = window.open('', '_blank');
  win.document.write(htmlPDF);
  win.document.close();
  setTimeout(() => win.print(), 600);
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', function() {
  setDateTimeNow();
});