/* ============================================================
   CHECKLIST FROTA — app.js  v3
   ============================================================ */

/* ─── ESTADO ─────────────────────────────────────────────────── */
const equipAtivos = new Set();
const fotosCache  = {};

/* ─── DADOS DOS CHECKLISTS NORMAIS ───────────────────────────── */
const ITENS_EXTRAS_IMPL = ["Bexigão e Embuchamentos","Sem Vazamentos de Ar"];

const itensCavalo = [
  "Documentação do Cavalo Mecânico","Painel de Instrumentos (avisos)",
  "Pintura / Defletor de Ar","Parabrisa / Limpadores / Esguicho",
  "Farol Diant.: Piscas / Milhas / Luz Baixa / Luz Alta (DRL se houver)",
  "Lanterna Tras.: Luz de Posição / Freio / Pisca / Ré",
  "Escada / Parachoques / Paralamas","5ª Roda / Gavião",
  "Conectores e Mangueiras de Ar e Elétrica",
  "Nível de Óleo (Motor / Câmbio / Diferencial)","Nível de Arrefecimento",
  "Óleo e Arrefecimento s/ Vazamentos","Opacidade","Tacógrafo","Extintor"
];

function buildImplList(base) { return [...base,...ITENS_EXTRAS_IMPL,"Observações"]; }

const itensSiderBase = [
  "Documentação da Carreta","Sinalização Reflexiva Laterais","Luz de Sinalização Laterais",
  "Lanterna Tras.: Luz de Posição / Freio / Pisca / Ré","Lonas Laterais / Teto / Cabo de Aço",
  "Cintas / Catracas / Cantoneiras / Réguas","Pés Hidráulicos / Manivela","Pino Rei",
  "Extintor / Estepe","Porta e Assoalho","Paralama / Parachoque / Escada / Degraus"
];
const itensRodoC1Base = [
  "Documentação da Carreta","Sinalização Reflexiva Laterais","Luz de Sinalização Laterais",
  "Lanterna Tras.: Luz de Posição / Freio / Pisca / Ré","Porta e Assoalho",
  "Lonas Laterais / Teto / Cabo de Aço","Cintas / Catracas / Cantoneiras / Réguas",
  "Extintor / Estepe","5ª Roda / Gavião / Pino Rei","Pés Hidráulicos / Manivela",
  "Paralama / Parachoque / Escada / Degraus"
];
const itensRodoC2Base = [
  "Documentação da Carreta","Pino Rei","Pés Hidráulicos / Manivela",
  "Lanterna Tras.: Luz de Posição / Freio / Pisca / Ré","Lonas Laterais / Teto / Cabo de Aço",
  "Cintas / Catracas / Cantoneiras / Réguas","Extintor / Estepe",
  "Paralama / Parachoque / Escada / Degraus"
];
const itensRodoCacambaBase = [
  "Documentação das Carretas e Dolly","Sinalização Reflexiva Laterais","Luz de Sinalização Laterais",
  "Lanterna Tras.: Luz de Posição / Freio / Pisca / Ré","Caçamba / Estrutura",
  "Mecanismo de Basculamento","Lona, abertura e fechamento","Cilindro Hidráulico / Mangueiras",
  "Extintor / Estepe","Pés Hidráulicos / Manivela","Paralama / Parachoque / Escada / Degraus"
];

const itens = {
  cavalo:      itensCavalo,
  sider:       buildImplList(itensSiderBase),
  rodotrem_c1: buildImplList(itensRodoC1Base),
  rodotrem_c2: buildImplList(itensRodoC2Base),
  rodocacamba: buildImplList(itensRodoCacambaBase)
};

/* ─── DADOS CHECKUP RÁPIDO ───────────────────────────────────── */
// tipo: qty|extintor|estepe|pneu|quinta
const checkupSiderItens = [
  {label:"Cintas",        tipo:"qty"},
  {label:"Catracas",      tipo:"qty"},
  {label:"Cantoneiras",   tipo:"qty"},
  {label:"Réguas",        tipo:"qty"},
  {label:"Extintor",      tipo:"extintor"},
  {label:"Estepe 1",      tipo:"estepe"},
  {label:"Estepe 1",      tipo:"estepe"},
  {label:"Cabo de aço",   tipo:"qty"},
  {label:"Pneus",         tipo:"pneu"},
  {label:"Lonas Lat. Teto", tipo:"qty"},
  {label:"Quinta Roda / Gavião / Pino Rei", tipo:"quinta"}
];
const checkupRodoItens = [
  {label:"Cintas",        tipo:"qty"},
  {label:"Catracas",      tipo:"qty"},
  {label:"Cantoneiras",   tipo:"qty"},
  {label:"Réguas",        tipo:"qty"},
  {label:"Extintor",      tipo:"extintor"},
  {label:"Estepe 1",      tipo:"estepe"},
  {label:"Estepe 2",      tipo:"estepe"},
  {label:"Cabo de aço",   tipo:"qty"},
  {label:"Pneus",         tipo:"pneu"},
  {label:"Lonas Lat. Teto", tipo:"qty"},
  {label:"Quinta Roda / Gavião / Pino Rei", tipo:"quinta"}
];

const equipLabels = {
  cavalo:"Cavalo Mecânico", sider:"Sider",
  rodotrem_c1:"Rodotrem — 1ª Carreta", rodotrem_c2:"Rodotrem — 2ª Carreta",
  rodocacamba:"Rodocaçamba",
  checkup_sider:"Checkup Rápido — Sider", checkup_rodo:"Checkup Rápido — Rodotrem"
};
const equipConfig = {
  cavalo:{badge:""}, sider:{badge:"blue"}, rodotrem:{badge:"green"},
  rodocacamba:{badge:"purple"}, checkup_sider:{badge:"teal"}, checkup_rodo:{badge:"orange"}
};
const SOMENTE_COM_CAVALO = ['sider','rodotrem','rodocacamba','checkup_sider','checkup_rodo'];

/* ─── MAIÚSCULAS ─────────────────────────────────────────────── */
function toUpperInput(el) {
  const pos = el.selectionStart;
  el.value = el.value.toUpperCase();
  try { el.setSelectionRange(pos,pos); } catch(e) {}
}

/* ─── MÁSCARAS ───────────────────────────────────────────────── */
function maskPlaca(el) {
  let v = el.value.toUpperCase().replace(/[^A-Z0-9]/g,'');
  if (v.length>3) v = v.slice(0,3)+'-'+v.slice(3,7);
  el.value = v;
}
function maskKm(el) {
  let v = el.value.replace(/\D/g,'');
  v = v.replace(/\B(?=(\d{3})+(?!\d))/g,'.');
  el.value = v;
}
function maskValidade(el) {
  let v = el.value.replace(/\D/g,'');
  if (v.length>2) v = v.slice(0,2)+'/'+v.slice(2,6);
  el.value = v;
}

/* ─── TIPO CHECKLIST ─────────────────────────────────────────── */
function onTipoChange(sel) {
  const val = sel.value;
  const semCavalo = !equipAtivos.has('cavalo');
  if (val==='Sider' && !equipAtivos.has('sider')) {
    if (semCavalo) setMotoristaModeImplemento('Sider');
    toggleEquip('sider');
  } else if (val==='Rodotrem' && !equipAtivos.has('rodotrem')) {
    if (semCavalo) setMotoristaModeImplemento('Rodotrem');
    toggleEquip('rodotrem');
  } else {
    if (semCavalo) resetMotoristaLabel();
  }
}

/* ─── LABEL MOTORISTA ────────────────────────────────────────── */
function setMotoristaModeImplemento(nome) {
  const inp = document.getElementById('motorista');
  const lbl = document.querySelector('label[for="motorista"]');
  if (!inp||!lbl) return;
  lbl.textContent = 'Implemento';
  inp.value = nome; inp.readOnly = true; inp.style.opacity = '0.7';
}
function resetMotoristaLabel() {
  const inp = document.getElementById('motorista');
  const lbl = document.querySelector('label[for="motorista"]');
  if (!inp||!lbl) return;
  if (lbl.textContent==='Implemento') {
    lbl.textContent = 'Nome do Motorista';
    inp.readOnly = false; inp.style.opacity = '';
    if (inp.value==='Sider'||inp.value==='Rodotrem') inp.value='';
  }
}

/* ─── EQUIPAMENTOS ───────────────────────────────────────────── */
function toggleEquip(equip) {
  const btn    = document.querySelector(`.equip-btn[data-equip="${equip}"]`);
  const fields = document.getElementById('fields-'+equip);
  if (!btn) return;

  if (equipAtivos.has(equip)) {
    equipAtivos.delete(equip);
    btn.classList.remove('active');
    if (fields) fields.classList.remove('visible');
    if (SOMENTE_COM_CAVALO.includes(equip)&&!equipAtivos.has('cavalo')) resetMotoristaLabel();
  } else {
    if (SOMENTE_COM_CAVALO.includes(equip)) {
      const implAtivo = SOMENTE_COM_CAVALO.find(e=>e!==equip&&equipAtivos.has(e));
      if (implAtivo) {
        alert(`"${getEquipName(equip)}" não pode ser combinado com "${getEquipName(implAtivo)}".\nImplementos só podem ser combinados com o Cavalo Mecânico.`);
        return;
      }
    }
    if (equip==='cavalo') resetMotoristaLabel();
    equipAtivos.add(equip);
    btn.classList.add('active');
    if (fields) fields.classList.add('visible');
  }
  atualizarVisibilidadeMotorista();
  atualizarBotoesDisabled();
  renderChecklists();
}

function getEquipName(e) {
  return {cavalo:'Cavalo Mecânico',sider:'Sider',rodotrem:'Rodotrem',
    rodocacamba:'Rodocaçamba',checkup_sider:'Checkup Rápido Sider',
    checkup_rodo:'Checkup Rápido Rodotrem'}[e]||e;
}

function atualizarVisibilidadeMotorista() {
  const soCheckup = (equipAtivos.has('checkup_sider')||equipAtivos.has('checkup_rodo'))
    &&!equipAtivos.has('cavalo')&&!equipAtivos.has('sider')
    &&!equipAtivos.has('rodotrem')&&!equipAtivos.has('rodocacamba');
  const f = document.getElementById('motorista-field');
  if (f) f.style.display = soCheckup ? 'none' : '';
}

function atualizarBotoesDisabled() {
  const ativo = SOMENTE_COM_CAVALO.find(e=>equipAtivos.has(e));
  SOMENTE_COM_CAVALO.forEach(e=>{
    const b = document.querySelector(`.equip-btn[data-equip="${e}"]`);
    if (!b) return;
    (ativo&&ativo!==e&&!equipAtivos.has(e)) ? b.classList.add('disabled') : b.classList.remove('disabled');
  });
}

/* ─── RENDER ─────────────────────────────────────────────────── */
function renderChecklists() {
  const c = document.getElementById('checklists-container');
  c.innerHTML = '';
  if (equipAtivos.size===0) {
    c.innerHTML=`<div class="empty-state"><div class="icon">🚛</div><p>Selecione ao menos um equipamento acima<br>para exibir o checklist</p></div>`;
    return;
  }
  ['cavalo','sider','rodotrem','rodocacamba'].forEach(equip=>{
    if (!equipAtivos.has(equip)) return;
    if (equip==='rodotrem') {
      renderSection(c,'green',equipLabels.rodotrem_c1,itens.rodotrem_c1,'rodotrem_c1');
      renderSection(c,'green',equipLabels.rodotrem_c2,itens.rodotrem_c2,'rodotrem_c2');
    } else {
      renderSection(c,equipConfig[equip].badge,equipLabels[equip],itens[equip],equip);
    }
  });
  if (equipAtivos.has('checkup_sider')) renderCheckup(c,'teal',equipLabels.checkup_sider,checkupSiderItens,'checkup_sider');
  if (equipAtivos.has('checkup_rodo'))  renderCheckup(c,'orange',equipLabels.checkup_rodo,checkupRodoItens,'checkup_rodo');
}

function renderSection(c,badge,label,items,key) {
  const s=document.createElement('div');
  s.className='checklist-section visible'; s.dataset.key=key;
  s.innerHTML=`<div class="section-title" style="margin-top:8px">${label}</div>
    <div class="card"><span class="equip-label ${badge}">${label}</span>
    ${items.map((item,i)=>renderItem(key,i,item)).join('')}</div>`;
  c.appendChild(s);
}

function renderItem(key,i,label) {
  return `<div class="item-row" id="row-${key}-${i}">
    <div class="item-main">
      <span class="item-num">${i+1}</span>
      <span class="item-label">${label}</span>
      <div class="item-btns">
        <button class="st-btn" onclick="setStatus('${key}',${i},'ok',this)">OK</button>
        <button class="st-btn" onclick="setStatus('${key}',${i},'nok',this)">NOK</button>
        <button class="st-btn" onclick="setStatus('${key}',${i},'na',this)">—</button>
        <button class="obs-btn" onclick="toggleObs('${key}',${i},this)" title="Obs">💬</button>
        <button class="cam-btn" onclick="togglePhoto('${key}',${i},this)" title="Foto">📷</button>
      </div>
    </div>
    <div class="obs-area" id="obs-area-${key}-${i}">
      <textarea placeholder="OBSERVAÇÃO..." oninput="updateObsBtn('${key}',${i});toUpperInput(this)"></textarea>
    </div>
    <div class="photo-area" id="photo-area-${key}-${i}">
      <button class="photo-add-btn" onclick="triggerCamera('${key}',${i})">＋</button>
      <input type="file" id="file-${key}-${i}" accept="image/*" capture="environment"
             style="display:none" onchange="handlePhoto(event,'${key}',${i})">
    </div>
  </div>`;
}

/* ─── RENDER CHECKUP ─────────────────────────────────────────── */
function renderCheckup(c,badge,label,items,key) {
  const s=document.createElement('div');
  s.className='checklist-section visible'; s.dataset.key=key;
  s.innerHTML=`<div class="section-title" style="margin-top:8px">${label}</div>
    <div class="card"><span class="equip-label ${badge}">${label}</span>
    ${items.map((item,i)=>renderCheckupItem(key,i,item)).join('')}</div>`;
  c.appendChild(s);
}

function renderCheckupItem(key,i,item) {
  const {label,tipo}=item;
  const id=`cu-${key}-${i}`;
  const stBtns=`<div class="cu-status-btns">
    <button class="st-btn" onclick="setCuStatus('${key}',${i},'ok',this)">OK</button>
    <button class="st-btn" onclick="setCuStatus('${key}',${i},'nok',this)">NOK</button>
    <button class="st-btn st-btn-atencao" onclick="setCuStatus('${key}',${i},'atencao',this)">⚠</button>
  </div>`;
  const commonBtns=`<button class="obs-btn" onclick="toggleObs('${key}',${i},this)" title="Obs">💬</button>
    <button class="cam-btn" onclick="togglePhoto('${key}',${i},this)" title="Foto">📷</button>`;
  const obsBlock=`<div class="obs-area" id="obs-area-${key}-${i}">
    <textarea placeholder="OBSERVAÇÃO..." oninput="toUpperInput(this)"></textarea></div>
    <div class="photo-area" id="photo-area-${key}-${i}">
    <button class="photo-add-btn" onclick="triggerCamera('${key}',${i})">＋</button>
    <input type="file" id="file-${key}-${i}" accept="image/*" capture="environment"
           style="display:none" onchange="handlePhoto(event,'${key}',${i})"></div>`;

  let fieldHtml='';
  if (tipo==='qty') {
    fieldHtml=`<label class="cu-label">QTD:</label>
      <input class="cu-input cu-input-sm" type="text" id="${id}-qty"
             placeholder="0" inputmode="numeric" oninput="toUpperInput(this)">`;
  } else if (tipo==='extintor') {
    fieldHtml=`<label class="cu-label">VALIDADE:</label>
      <input class="cu-input" type="text" id="${id}-val"
             placeholder="MM/AAAA" maxlength="7" oninput="maskValidade(this)">`;
  }

  return `<div class="item-row cu-item-row" id="row-${key}-${i}">
    <div class="item-main cu-item-main">
      <span class="item-num">${i+1}</span>
      <span class="item-label">${label}</span>
    </div>
    <div class="cu-field-row">${fieldHtml}${stBtns}${commonBtns}</div>
    ${obsBlock}
  </div>`;
}

/* ─── STATUS ─────────────────────────────────────────────────── */
function setStatus(key,i,status,btn) {
  const row=document.getElementById(`row-${key}-${i}`);
  row.querySelectorAll('.st-btn').forEach(b=>b.classList.remove('ok-active','nok-active','na-active','atencao-active'));
  btn.classList.add(status+'-active');
  atualizarBordaFotos(key,i,status);
}
function setCuStatus(key,i,status,btn) {
  const row=document.getElementById(`row-${key}-${i}`);
  row.querySelectorAll('.cu-status-btns .st-btn').forEach(b=>b.classList.remove('ok-active','nok-active','na-active','atencao-active'));
  btn.classList.add(status+'-active');
  atualizarBordaFotos(key,i,status);
}
function getStatusItem(key,i) {
  const row=document.getElementById(`row-${key}-${i}`);
  if (!row) return 'pend';
  if (row.querySelector('.st-btn.ok-active'))      return 'ok';
  if (row.querySelector('.st-btn.nok-active'))     return 'nok';
  if (row.querySelector('.st-btn.na-active'))      return 'na';
  if (row.querySelector('.st-btn.atencao-active')) return 'atencao';
  return 'pend';
}

/* ─── OBSERVAÇÕES ────────────────────────────────────────────── */
function toggleObs(key,i,btn) {
  const area=document.getElementById(`obs-area-${key}-${i}`);
  area.classList.toggle('open');
  if (area.classList.contains('open')) area.querySelector('textarea').focus();
}
function updateObsBtn(key,i) {
  const area=document.getElementById(`obs-area-${key}-${i}`);
  const btn=document.querySelector(`#row-${key}-${i} .obs-btn`);
  if (btn) btn.classList.toggle('has-obs',area.querySelector('textarea').value.trim().length>0);
}

/* ─── FOTOS ──────────────────────────────────────────────────── */
function togglePhoto(key,i) {
  const area=document.getElementById(`photo-area-${key}-${i}`);
  if (area) area.classList.toggle('open');
}
function triggerCamera(key,i) {
  const inp=document.getElementById(`file-${key}-${i}`);
  if (inp) inp.click();
}
function compressImage(file,maxW,maxH,quality) {
  return new Promise(resolve=>{
    const reader=new FileReader();
    reader.onload=e=>{
      const img=new Image();
      img.onload=()=>{
        let w=img.width,h=img.height;
        if (w>maxW){h=Math.round(h*maxW/w);w=maxW;}
        if (h>maxH){w=Math.round(w*maxH/h);h=maxH;}
        const canvas=document.createElement('canvas');
        canvas.width=w;canvas.height=h;
        canvas.getContext('2d').drawImage(img,0,0,w,h);
        resolve(canvas.toDataURL('image/jpeg',quality));
      };
      img.src=e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
async function handlePhoto(event,key,i) {
  const file=event.target.files[0];
  if (!file) return;
  const compressed=await compressImage(file,640,480,0.45);
  const fk=`${key}-${i}`;
  if (!fotosCache[fk]) fotosCache[fk]=[];
  fotosCache[fk].push({src:compressed,status:getStatusItem(key,i)});
  renderPhotoPreviews(key,i);
  const cb=document.querySelector(`#row-${key}-${i} .cam-btn`);
  if (cb) cb.classList.add('has-photo');
  document.getElementById(`row-${key}-${i}`).classList.add('has-photo');
  event.target.value='';
}
function atualizarBordaFotos(key,i,status) {
  const fk=`${key}-${i}`;
  if (!fotosCache[fk]) return;
  fotosCache[fk].forEach(f=>f.status=status);
  renderPhotoPreviews(key,i);
}
function renderPhotoPreviews(key,i) {
  const area=document.getElementById(`photo-area-${key}-${i}`);
  if (!area) return;
  const fk=`${key}-${i}`;
  const fotos=fotosCache[fk]||[];
  area.querySelectorAll('.photo-preview').forEach(el=>el.remove());
  const addBtn=area.querySelector('.photo-add-btn');
  fotos.forEach((foto,idx)=>{
    const wrap=document.createElement('div');
    wrap.className=`photo-preview status-${foto.status||'pend'}`;
    wrap.innerHTML=`<img src="${foto.src}" alt="foto ${idx+1}">
      <button class="photo-remove" onclick="removePhoto('${key}',${i},${idx})">✕</button>`;
    area.insertBefore(wrap,addBtn);
  });
}
function removePhoto(key,i,idx) {
  const fk=`${key}-${i}`;
  fotosCache[fk].splice(idx,1);
  renderPhotoPreviews(key,i);
  if (!fotosCache[fk].length) {
    const cb=document.querySelector(`#row-${key}-${i} .cam-btn`);
    if (cb) cb.classList.remove('has-photo');
    document.getElementById(`row-${key}-${i}`).classList.remove('has-photo');
  }
}

/* ─── COLETA CHECKUP PARA PDF ────────────────────────────────── */
function coletarCheckupPDF(key,items) {
  let rowsHtml=''; const nokList=[]; const fotos=[]; const secLabel=equipLabels[key]||key;
  items.forEach((item,i)=>{
    const row=document.getElementById(`row-${key}-${i}`);
    if (!row) return;
    const {label,tipo}=item;
    const sc=getStatusItem(key,i);
    const sl={ok:'OK',nok:'NOK',na:'N/A',atencao:'⚠',pend:'PEND'}[sc]||'PEND';
    const obs=row.querySelector('textarea')?row.querySelector('textarea').value.trim():'';
    const ft=fotosCache[`${key}-${i}`]||[];
    if (sc==='nok') nokList.push({label,sectionLabel:secLabel,obs});
    let extraInfo='';
    if (tipo==='qty'){const el=row.querySelector('[id$="-qty"]');if(el&&el.value)extraInfo=`Qtd: ${el.value}`;}
    if (tipo==='extintor'){const el=row.querySelector('[id$="-val"]');if(el&&el.value)extraInfo=`Validade: ${el.value}`;}
    let inlinePhoto='';
    if (ft.length>0){
      inlinePhoto=`<img class="pdf-inline-photo border-${sc}" src="${ft[0].src}" alt="foto">`;
      ft.forEach(f=>fotos.push({src:f.src,label,secLabel,status:sc}));
    }
    rowsHtml+=`<div class="pdf-item"><span class="pdf-badge ${sc}">${sl}</span>
      <div class="pdf-item-body"><div class="pdf-item-text">${label}${extraInfo?' — '+extraInfo:''}</div>
      ${obs?`<div class="pdf-item-obs">${obs}</div>`:''}${inlinePhoto}</div></div>`;
  });
  return {rowsHtml,nokList,fotos,secLabel};
}

/* ─── GERAR PDF ──────────────────────────────────────────────── */
function gerarPDF() {
  const motorista  = document.getElementById('motorista').value  ||'—';
  const conferente = document.getElementById('conferente').value ||'—';
  const data       = document.getElementById('data').value       ||'—';
  const hora       = document.getElementById('hora').value       ||'—';
  const tipoSel    = document.getElementById('tipo-select');
  const tipo       = tipoSel&&tipoSel.value?tipoSel.value:'—';

  const placaLines=[];
  if (equipAtivos.has('cavalo')){const p=document.getElementById('placa-cavalo').value,k=document.getElementById('km-cavalo').value;placaLines.push(`<strong>Cavalo:</strong> ${p||'—'} | <strong>KM:</strong> ${k||'—'}`);}
  if (equipAtivos.has('sider')) placaLines.push(`<strong>Sider:</strong> ${document.getElementById('placa-sider').value||'—'}`);
  if (equipAtivos.has('rodotrem')){const p1=document.getElementById('placa-rodotrem1').value,p2=document.getElementById('placa-rodotrem2').value;placaLines.push(`<strong>Rodotrem 1ª:</strong> ${p1||'—'} | <strong>2ª:</strong> ${p2||'—'}`);}
  if (equipAtivos.has('rodocacamba')){const p1=document.getElementById('placa-rodocacamba1').value,p2=document.getElementById('placa-rodocacamba2').value,p3=document.getElementById('placa-rodocacamba3').value;placaLines.push(`<strong>Rodocaçamba:</strong> ${p1||'—'} / Dolly: ${p2||'—'} / ${p3||'—'}`);}
  if (equipAtivos.has('checkup_sider')) placaLines.push(`<strong>Checkup Sider:</strong> ${document.getElementById('placa-checkup-sider').value||'—'}`);
  if (equipAtivos.has('checkup_rodo'))  placaLines.push(`<strong>Checkup Rodotrem:</strong> ${document.getElementById('placa-checkup-rodo').value||'—'}`);

  let nomePDF='Checklist';
  if (equipAtivos.has('cavalo')){const p=document.getElementById('placa-cavalo').value;if(p)nomePDF=`Checklist-${p}`;}
  else {
    const p=(equipAtivos.has('sider')&&document.getElementById('placa-sider').value)||
            (equipAtivos.has('rodotrem')&&document.getElementById('placa-rodotrem1').value)||
            (equipAtivos.has('rodocacamba')&&document.getElementById('placa-rodocacamba1').value)||
            (equipAtivos.has('checkup_sider')&&document.getElementById('placa-checkup-sider').value)||
            (equipAtivos.has('checkup_rodo')&&document.getElementById('placa-checkup-rodo').value)||null;
    if (p) nomePDF=`Checklist-${p}`;
  }

  let cntOk=0,cntNok=0,cntNa=0,cntPend=0,cntAt=0;
  document.querySelectorAll('.item-row').forEach(row=>{
    if      (row.querySelector('.st-btn.ok-active'))      cntOk++;
    else if (row.querySelector('.st-btn.nok-active'))     cntNok++;
    else if (row.querySelector('.st-btn.na-active'))      cntNa++;
    else if (row.querySelector('.st-btn.atencao-active')) cntAt++;
    else                                                   cntPend++;
  });

  const mostraMotorista = document.getElementById('motorista-field')&&
    document.getElementById('motorista-field').style.display!=='none';

  document.getElementById('pdf-header').innerHTML=`
    <div class="pdf-title">CHECK<span>LIST</span> DE FROTA</div>
    <div class="pdf-meta">
      <span><strong>Data/Hora:</strong> ${data} ${hora}</span>
      <span><strong>Operação:</strong> ${tipo}</span>
      ${mostraMotorista?`<span><strong>Motorista:</strong> ${motorista}</span>`:''}
      <span><strong>Conferente:</strong> ${conferente}</span>
      ${placaLines.map(l=>`<span>${l}</span>`).join('')}
    </div>
    <div class="pdf-counters">
      <span class="cnt cnt-ok">✔ OK: ${cntOk}</span>
      <span class="cnt cnt-nok">✘ NOK: ${cntNok}</span>
      <span class="cnt cnt-na">— N/A: ${cntNa}</span>
      ${cntAt?`<span class="cnt cnt-atencao">⚠ Atenção: ${cntAt}</span>`:''}
      <span class="cnt cnt-pend">● Pend.: ${cntPend}</span>
    </div>`;

  const pdfCols=document.getElementById('pdf-cols');
  pdfCols.innerHTML='';
  const nokList=[]; const todasFotos=[];

  ['cavalo','sider','rodotrem_c1','rodotrem_c2','rodocacamba'].forEach(key=>{
    if (!itens[key]) return;
    const eb=key.startsWith('rodotrem')?'rodotrem':key;
    if (!equipAtivos.has(eb)) return;
    const secLabel=equipLabels[key]||key;
    let rowsHtml='';
    itens[key].forEach((label,i)=>{
      const row=document.getElementById(`row-${key}-${i}`);
      if (!row) return;
      const sc=getStatusItem(key,i);
      const sl={ok:'OK',nok:'NOK',na:'N/A',atencao:'⚠',pend:'PEND'}[sc]||'PEND';
      const obs=row.querySelector('textarea').value.trim();
      const fotos=fotosCache[`${key}-${i}`]||[];
      if (sc==='nok') nokList.push({label,sectionLabel:secLabel,obs});
      let inlinePhoto='';
      if (fotos.length>0){
        inlinePhoto=`<img class="pdf-inline-photo border-${sc}" src="${fotos[0].src}" alt="foto">`;
        fotos.forEach(f=>todasFotos.push({src:f.src,label,secLabel,status:sc}));
      }
      rowsHtml+=`<div class="pdf-item"><span class="pdf-badge ${sc}">${sl}</span>
        <div class="pdf-item-body"><div class="pdf-item-text">${label}</div>
        ${obs?`<div class="pdf-item-obs">${obs}</div>`:''}${inlinePhoto}</div></div>`;
    });
    const sec=document.createElement('div');
    sec.className='pdf-section';
    sec.innerHTML=`<div class="pdf-section-header">${secLabel}</div>${rowsHtml}`;
    pdfCols.appendChild(sec);
  });

  ['checkup_sider','checkup_rodo'].forEach(key=>{
    if (!equipAtivos.has(key)) return;
    const items=key==='checkup_sider'?checkupSiderItens:checkupRodoItens;
    const {rowsHtml,nokList:nl,fotos:fl,secLabel}=coletarCheckupPDF(key,items);
    nl.forEach(n=>nokList.push(n));
    fl.forEach(f=>todasFotos.push(f));
    const sec=document.createElement('div');
    sec.className='pdf-section';
    sec.innerHTML=`<div class="pdf-section-header">${secLabel}</div>${rowsHtml}`;
    pdfCols.appendChild(sec);
  });

  if (nokList.length>0) {
    const s=document.createElement('div');
    s.className='pdf-nok-section';
    s.innerHTML=`<div class="pdf-nok-header">⚠ Itens Não Conformes (${nokList.length})</div>
      ${nokList.map((n,idx)=>`<div class="pdf-nok-item"><strong>${idx+1}. ${n.label}</strong>
        <div class="nok-loc">${n.sectionLabel}</div>
        ${n.obs?`<div class="nok-obs">${n.obs}</div>`:''}</div>`).join('')}`;
    pdfCols.appendChild(s);
  }

  if (todasFotos.length>0) {
    const s=document.createElement('div');
    s.className='pdf-photos-section';
    s.innerHTML=`<div class="pdf-photos-header">📷 Registros Fotográficos</div>
      <div class="pdf-photos-grid">${todasFotos.map(f=>`
        <div class="pdf-photo-item">
          <img src="${f.src}" class="border-${f.status}" alt="${f.label}">
          <div class="pdf-photo-caption">${f.secLabel} — ${f.label}</div>
        </div>`).join('')}</div>`;
    pdfCols.appendChild(s);
  }

  // Rodapé sem marca/URL
  document.getElementById('pdf-footer').innerHTML=`
    <span>${nomePDF} | ${conferente}</span>
    <span>${data} ${hora} — ${tipo}</span>`;

  salvarHistorico(motorista,conferente,data,hora,tipo,nomePDF,cntOk,cntNok,cntPend);
  const orig=document.title;
  document.title=nomePDF;
  window.print();
  document.title=orig;
}

/* ─── HISTÓRICO ──────────────────────────────────────────────── */
const DB_KEY='checklist_frota_v3';

function salvarHistorico(motorista,conferente,data,hora,tipo,nomePDF,ok,nok,pend) {
  let hist=[];
  try{hist=JSON.parse(localStorage.getItem(DB_KEY)||'[]');}catch(e){hist=[];}
  const placas=[];
  if (equipAtivos.has('cavalo'))        placas.push(document.getElementById('placa-cavalo').value);
  if (equipAtivos.has('sider'))         placas.push(document.getElementById('placa-sider').value);
  if (equipAtivos.has('rodotrem'))      placas.push(document.getElementById('placa-rodotrem1').value,document.getElementById('placa-rodotrem2').value);
  if (equipAtivos.has('rodocacamba'))   placas.push(document.getElementById('placa-rodocacamba1').value,document.getElementById('placa-rodocacamba2').value,document.getElementById('placa-rodocacamba3').value);
  if (equipAtivos.has('checkup_sider')) placas.push(document.getElementById('placa-checkup-sider').value);
  if (equipAtivos.has('checkup_rodo'))  placas.push(document.getElementById('placa-checkup-rodo').value);

  const snapshot=[];
  ['cavalo','sider','rodotrem_c1','rodotrem_c2','rodocacamba'].forEach(key=>{
    const eb=key.startsWith('rodotrem')?'rodotrem':key;
    if (!equipAtivos.has(eb)) return;
    itens[key].forEach((label,i)=>{
      const row=document.getElementById(`row-${key}-${i}`);
      if (!row) return;
      const obs=row.querySelector('textarea')?row.querySelector('textarea').value.trim():'';
      snapshot.push({secao:equipLabels[key]||key,item:label,status:getStatusItem(key,i),obs});
    });
  });

  hist.unshift({id:Date.now(),nomePDF,motorista,conferente,data,hora,tipo,
    placas:placas.filter(Boolean),equipamentos:[...equipAtivos],
    cntOk:ok,cntNok:nok,cntPend:pend,itens:snapshot,geradoEm:new Date().toISOString()});
  if (hist.length>200) hist.splice(200);
  try{localStorage.setItem(DB_KEY,JSON.stringify(hist));}catch(e){}
}

function carregarHistorico(filtro='') {
  let hist=[];
  try{hist=JSON.parse(localStorage.getItem(DB_KEY)||'[]');}catch(e){}
  const body=document.getElementById('hist-body');
  const filtrado=filtro
    ?hist.filter(r=>r.placas.some(p=>p.toUpperCase().includes(filtro.toUpperCase()))||
        (r.motorista||'').toUpperCase().includes(filtro.toUpperCase())||
        (r.conferente||'').toUpperCase().includes(filtro.toUpperCase()))
    :hist;
  if (!filtrado.length){body.innerHTML=`<div class="hist-empty">Nenhum checklist encontrado.</div>`;return;}
  body.innerHTML=filtrado.map(r=>{
    const noks=(r.itens||[]).filter(it=>it.status==='nok');
    const nd=noks.length?`<div style="margin-top:5px;font-size:0.7rem;color:#ef4444">
      ${noks.slice(0,3).map(n=>`▸ ${n.item}${n.obs?' — '+n.obs:''}`).join('<br>')}
      ${noks.length>3?`<br>... e mais ${noks.length-3} item(ns)`:''}</div>`:'';
    return `<div class="hist-item">
      <div class="hist-item-top">
        <span class="hist-placa">${r.placas.join(' / ')||r.nomePDF}</span>
        <span class="hist-date">${r.data} ${r.hora}</span>
      </div>
      <div class="hist-info">${r.motorista} · ${r.conferente} · ${r.tipo}</div>
      <div class="hist-badges">
        <span class="hist-badge ok">✔ ${r.cntOk} OK</span>
        ${r.cntNok?`<span class="hist-badge nok">✘ ${r.cntNok} NOK</span>`:''}
        ${r.cntPend?`<span class="hist-badge pend">⚠ ${r.cntPend} Pend.</span>`:''}
      </div>${nd}</div>`;
  }).join('');
}

function abrirHistorico(){carregarHistorico();document.getElementById('modal-historico').classList.add('open');}
function fecharHistorico(){document.getElementById('modal-historico').classList.remove('open');}

/* ─── LIMPAR TUDO ────────────────────────────────────────────── */
function limparTudo() {
  if (!confirm('Deseja limpar todos os dados do checklist?')) return;
  document.querySelectorAll('input[type=text],input[type=date],input[type=time],textarea').forEach(el=>el.value='');
  const sel=document.getElementById('tipo-select');
  if (sel) sel.selectedIndex=0;
  document.querySelectorAll('.equip-btn').forEach(b=>b.classList.remove('active','disabled'));
  document.querySelectorAll('.equip-fields').forEach(f=>f.classList.remove('visible'));
  equipAtivos.clear();
  Object.keys(fotosCache).forEach(k=>delete fotosCache[k]);
  resetMotoristaLabel();
  atualizarVisibilidadeMotorista();
  atualizarBotoesDisabled();
  renderChecklists();
  initDefaults();
}

/* ─── INIT ───────────────────────────────────────────────────── */
function initDefaults() {
  const hoje=new Date();
  document.getElementById('data').value=hoje.toISOString().split('T')[0];
  const hh=String(hoje.getHours()).padStart(2,'0');
  const mm=String(hoje.getMinutes()).padStart(2,'0');
  document.getElementById('hora').value=`${hh}:${mm}`;
}

document.addEventListener('DOMContentLoaded',()=>{
  initDefaults();
  // Maiúsculas em todos os inputs de texto (exceto placa, km, validade, pesquisa)
  document.addEventListener('input',e=>{
    const el=e.target;
    if ((el.tagName==='TEXTAREA'||(el.tagName==='INPUT'&&el.type==='text'))
      &&!el.id.startsWith('placa-')&&!el.id.startsWith('km-')
      &&el.id!=='hist-search'&&!el.id.endsWith('-val')&&!el.id.endsWith('-qty')) {
      toUpperInput(el);
    }
  });
  const si=document.getElementById('hist-search');
  if (si) si.addEventListener('input',e=>carregarHistorico(e.target.value));
  document.getElementById('modal-historico').addEventListener('click',e=>{
    if (e.target===e.currentTarget) fecharHistorico();
  });
});
