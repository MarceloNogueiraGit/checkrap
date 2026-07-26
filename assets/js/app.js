/* ══════════════════════════════════════════════════════
   DADOS
   ══════════════════════════════════════════════════════ */
const ITENS = [
  [1, 'Treinamento engate desengate'],
  [2, 'Treinamento manobra'],
  [3, 'Treinamento teclado/macros'],
  [4, 'Treinamento abrir sider e fechar sider'],
  [5, 'Treinamento amarração']
];

/* ══════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════ */
function gv(id) { return (document.getElementById(id) || {}).value || ''; }
function gc(id) { return !!document.getElementById(id)?.checked; }

/* ══════════════════════════════════════════════════════
   RENDERIZAÇÃO DOS ITENS
   ══════════════════════════════════════════════════════ */
(function renderizar() {
  const tb = document.getElementById('b_itens');
  ITENS.forEach(([n, tx]) => {
    const tr = document.createElement('tr');
    tr.dataset.n = n;
    tr.innerHTML = `
      <td>${n}</td>
      <td>${tx}</td>
      <td><div class="chk-grupo">
        <label class="chk-op"><input type="checkbox" id="i${n}_sim"></input> Sim</label>
        <label class="chk-op"><input type="checkbox" id="i${n}_nao" class="nok-chk"></input> Não</label>
      </div></td>`;
    tb.appendChild(tr);
    document.getElementById(`i${n}_sim`).addEventListener('change', (e) => aoMarcar(n, e.target));
    document.getElementById(`i${n}_nao`).addEventListener('change', (e) => aoMarcar(n, e.target));
  });
})();

const motivoNao = {};

function aoMarcar(n, alvo) {
  const sim = document.getElementById(`i${n}_sim`);
  const nao = document.getElementById(`i${n}_nao`);
  // Sim e Não são mutuamente exclusivos
  if (alvo === sim && sim.checked) nao.checked = false;
  if (alvo === nao && nao.checked) sim.checked = false;
  const tr = document.querySelector(`tr[data-n="${n}"]`);
  if (tr) tr.classList.toggle('nok', nao.checked);

  if (alvo === nao && nao.checked) {
    const [, tx] = ITENS.find(([num]) => num === n);
    pedirMotivo(tx, function(motivo) {
      if (motivo) {
        motivoNao[n] = motivo;
      } else {
        nao.checked = false;
        if (tr) tr.classList.remove('nok');
        delete motivoNao[n];
      }
      atualizarObs();
    });
    return;
  }
  if (!nao.checked) delete motivoNao[n];
  atualizarObs();
}

/* ══════════════════════════════════════════════════════
   POPUP MOTIVO "NÃO"
   ══════════════════════════════════════════════════════ */
let _cbMotivo = null;

function pedirMotivo(descricao, cb) {
  _cbMotivo = cb;
  document.getElementById('popup-motivo-desc').textContent = descricao;
  document.getElementById('popup-motivo').classList.add('aberto');
}
function resolverMotivo(op) {
  document.getElementById('popup-motivo').classList.remove('aberto');
  if (_cbMotivo) { const cb = _cbMotivo; _cbMotivo = null; cb(op); }
}
function cancelarMotivo() {
  document.getElementById('popup-motivo').classList.remove('aberto');
  if (_cbMotivo) { const cb = _cbMotivo; _cbMotivo = null; cb(null); }
}

/* ══════════════════════════════════════════════════════
   ORIGEM DO MOTORISTA — seleção única
   ══════════════════════════════════════════════════════ */
const ORIGEM_IDS = ['origem_casa', 'origem_agregado', 'origem_px'];

function marcarOrigem(id) {
  const alvo = document.getElementById(id);
  if (alvo.checked) {
    ORIGEM_IDS.forEach(o => {
      if (o !== id) document.getElementById(o).checked = false;
    });
  }
  ORIGEM_IDS.forEach(o => {
    document.getElementById(o).closest('.origem-op')
      .classList.toggle('selecionado', document.getElementById(o).checked);
  });
}

function origemSelecionada() {
  if (gc('origem_casa'))     return 'CASA';
  if (gc('origem_agregado')) return 'AGREGADO';
  if (gc('origem_px'))       return 'PX';
  return '';
}

/* ══════════════════════════════════════════════════════
   OBSERVAÇÕES (itens "Não" inseridos automaticamente)
   ══════════════════════════════════════════════════════ */
const SEP = '\u200B';

function atualizarObs() {
  const el = document.getElementById('observacoes');
  const atual = el.value;
  const manual = atual.includes(SEP) ? atual.split(SEP)[0].trimEnd() : atual.trimEnd();

  const linhas = [];
  ITENS.forEach(([n, tx]) => {
    if (gc(`i${n}_nao`)) {
      const motivo = motivoNao[n] || 'MOTIVO NAO INFORMADO';
      linhas.push(`${n}. ${tx.toUpperCase()} - NAO REALIZADO (${motivo})`);
    }
  });

  const novoAuto = linhas.length ? SEP + linhas.join('\n') : '';
  const novoVal  = (manual ? manual + '\n\n' : '') + novoAuto;
  const limpo    = novoVal.startsWith('\n') ? novoVal.trimStart() : novoVal;

  const start = el.selectionStart;
  const end   = el.selectionEnd;
  el.value = limpo;

  if (document.activeElement === el) {
    const sepPos = limpo.indexOf(SEP);
    const limite = sepPos >= 0 ? sepPos : limpo.length;
    if (start <= limite) el.setSelectionRange(start, end);
  }
}

function obsManual() {
  const val = gv('observacoes');
  const manual = val.includes(SEP) ? val.split(SEP)[0] : val;
  return manual.replace(new RegExp(SEP, 'g'), '').trim();
}

/* ══════════════════════════════════════════════════════
   UPPERCASE SEM PERDER POSIÇÃO DO CURSOR
   ══════════════════════════════════════════════════════ */
function upperKeepCursor(el) {
  const start = el.selectionStart;
  const end   = el.selectionEnd;
  const antes = el.value;
  const depois = antes.toUpperCase();
  if (antes === depois) return;
  el.value = depois;
  el.setSelectionRange(start, end);
}

/* ══════════════════════════════════════════════════════
   FORMATAÇÃO DE CAMPOS
   ══════════════════════════════════════════════════════ */
function fmtPlaca(el) {
  const raw = el.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
  el.value  = raw.length > 3 ? raw.slice(0, 3) + '-' + raw.slice(3) : raw;
}

window.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('data');
  if (el && !el.value) el.value = new Date().toISOString().split('T')[0];
});

/* ══════════════════════════════════════════════════════
   CANVAS DE ASSINATURA
   ══════════════════════════════════════════════════════ */
const DPR = Math.min(window.devicePixelRatio || 1, 3);
const SW  = Math.round(500 * DPR);
const SH  = Math.round(150 * DPR);

function initCanvas(id) {
  const c   = document.getElementById(id);
  c.width   = SW; c.height = SH;
  const ctx = c.getContext('2d');
  ctx.fillStyle   = '#ffffff'; ctx.fillRect(0, 0, SW, SH);
  ctx.lineWidth   = 2.5 * DPR;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.strokeStyle = '#0a0a0a';
  let dr = false;
  const pt = e => {
    const r = c.getBoundingClientRect(), s = e.touches ? e.touches[0] : e;
    return { x: (s.clientX - r.left) * (SW / r.width), y: (s.clientY - r.top) * (SH / r.height) };
  };
  const ini  = e => { dr = true; const p = pt(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const mover= e => { if (!dr) return; const p = pt(e); ctx.lineTo(p.x, p.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const fim  = () => dr = false;
  c.addEventListener('mousedown',  ini);
  c.addEventListener('mousemove',  mover);
  c.addEventListener('mouseup',    fim);
  c.addEventListener('mouseleave', fim);
  c.addEventListener('touchstart', e => { e.preventDefault(); ini(e); },  { passive: false });
  c.addEventListener('touchmove',  e => { e.preventDefault(); mover(e); }, { passive: false });
  c.addEventListener('touchend',   fim);
}
initCanvas('canvas_instr');
initCanvas('canvas_mot');

function limparCanvas(id) {
  const c = document.getElementById(id), ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, c.width, c.height);
}

function temTraco(id) {
  const d = document.getElementById(id).getContext('2d').getImageData(0, 0, SW, SH).data;
  for (let i = 0; i < d.length; i += 4) if (d[i] < 200 && d[i+1] < 200 && d[i+2] < 200) return true;
  return false;
}

/* ══════════════════════════════════════════════════════
   MODAL DE ASSINATURAS
   ══════════════════════════════════════════════════════ */
let etapa = 1;

function abrirModal()  { etapa = 1; sincEtapa(); document.getElementById('modal-bg').classList.add('aberto'); }
function fecharModal() { document.getElementById('modal-bg').classList.remove('aberto'); }
function irEtapa(n)    { etapa = n; sincEtapa(); }

function sincEtapa() {
  [1,2,3].forEach(i => {
    document.getElementById(`etapa${i}`).style.display = i === etapa ? '' : 'none';
  });
  [1,2,3].forEach(i => {
    const dot = document.getElementById(`dot${i}`);
    const lbl = document.getElementById(`lbl${i}`);
    dot.classList.remove('active','feito'); lbl.classList.remove('ativo','feito');
    if (i < etapa)       { dot.classList.add('feito');  lbl.classList.add('feito'); }
    else if (i === etapa){ dot.classList.add('active'); lbl.classList.add('ativo'); }
  });
  [1,2].forEach(i => {
    document.getElementById(`bar${i}`).classList.toggle('feito', i < etapa);
  });
  if (etapa === 3) {
    document.getElementById('prev_instr').src = document.getElementById('canvas_instr').toDataURL('image/png');
    document.getElementById('prev_mot').src   = document.getElementById('canvas_mot').toDataURL('image/png');
  }
}

document.getElementById('modal-bg').addEventListener('click', function(e) {
  if (e.target === this) fecharModal();
});

/* ══════════════════════════════════════════════════════
   GERAÇÃO DO PDF
   ══════════════════════════════════════════════════════ */
function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'p', unit:'mm', format:'a4' });
  const W = 210, ML = 12, cW = 186;
  let y = 0;
  const AZUL=[26,26,46], CZS=[210,218,236];

  // cabeçalho — mesmo padrão visual do checklist de manutenção
  doc.setFillColor(255,255,255); doc.rect(0,0,W,15,'F');
  doc.setDrawColor(200); doc.setLineWidth(.3); doc.line(0,15,W,15);
  doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.setTextColor(20,20,20);
  doc.text('CHECK LIST DE TREINAMENTO', ML+2, 9.5);
  try {
    const lg = document.getElementById('logo-pdf');
    if (lg && lg.complete) doc.addImage(lg,'PNG',W-ML-30,0.5,30,14);
  } catch(_) {}
  y = 17;

  // caixa DATA / INSTRUTOR / MOTORISTA
  doc.setLineWidth(.25); doc.setDrawColor(160);
  doc.rect(ML,y,cW,6);
  const c1=[26,80,cW-106]; let x=ML;
  doc.setFontSize(6.2); doc.setFont('helvetica','bold'); doc.setTextColor(50,50,50);
  ['DATA','NOME INSTRUTOR','NOME MOTORISTA'].forEach((h,i)=>{
    doc.text(h,x+1,y+2.2); x+=c1[i]; if(i<2) doc.line(x,y,x,y+6);
  });
  x=ML; doc.setFont('helvetica','normal'); doc.setTextColor(15,15,15);
  [gv('data'), gv('instrutor'), gv('motorista')].forEach((v,i)=>{
    doc.text(String(v||'—'),x+1,y+4.8); x+=c1[i];
  });
  y+=6.5;

  // caixa de placas
  doc.rect(ML,y,cW,6);
  const c2=[cW/4,cW/4,cW/4,cW/4]; x=ML;
  doc.setFont('helvetica','bold'); doc.setFontSize(6.2);
  ['PLACA CAVALO','PLACA SR','PLACA SEMI 1','PLACA SEMI 2'].forEach((h,i)=>{
    doc.text(h,x+1,y+2.2); x+=c2[i]; if(i<3) doc.line(x,y,x,y+6);
  });
  x=ML; doc.setFont('helvetica','normal');
  [gv('placa_cavalo'), gv('placa_sr1'), gv('placa_semi1'), gv('placa_semi2')].forEach((v,i)=>{
    doc.text(String(v||'—'),x+1,y+4.8); x+=c2[i];
  });
  y+=8;

  // origem do motorista
  doc.setFillColor(...AZUL); doc.rect(ML,y,cW,4.8,'F');
  doc.setFontSize(6.8); doc.setFont('helvetica','bold'); doc.setTextColor(255,255,255);
  doc.text('ORIGEM DO MOTORISTA',ML+2.5,y+3.3); y+=5.5;
  doc.setLineWidth(.13); doc.setDrawColor(200); doc.rect(ML,y,cW,5);
  doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(15,15,15);
  const org = origemSelecionada();
  doc.text(`(${org==='CASA'?'X':' '}) 1. CASA    (${org==='AGREGADO'?'X':' '}) 2. AGREGADO    (${org==='PX'?'X':' '}) 3. PX`, ML+2.5, y+3.3);
  y+=8;

  // itens de treinamento
  doc.setFillColor(...AZUL); doc.rect(ML,y,cW,4.8,'F');
  doc.setFontSize(6.8); doc.setFont('helvetica','bold'); doc.setTextColor(255,255,255);
  doc.text('ITENS DE TREINAMENTO',ML+2.5,y+3.3); y+=5.5;

  ITENS.forEach(([n, tx], i) => {
    const rh = 6;
    if (i%2===1) { doc.setFillColor(248,249,253); doc.rect(ML,y,cW,rh,'F'); }
    doc.setLineWidth(.13); doc.setDrawColor(200);
    doc.rect(ML,y,cW,rh);
    doc.line(ML+9,y,ML+9,y+rh);
    doc.line(ML+cW-40,y,ML+cW-40,y+rh);
    doc.setFontSize(6); doc.setFont('helvetica','bold'); doc.setTextColor(140,140,140);
    doc.text(String(n),ML+4.5,y+rh/2+1,{align:'center'});
    doc.setFont('helvetica','normal'); doc.setFontSize(7.2); doc.setTextColor(15,15,15);
    doc.text(tx,ML+10.5,y+rh/2+1);
    const sim = gc(`i${n}_sim`), nao = gc(`i${n}_nao`);
    doc.setFontSize(6.5);
    doc.text(`(${sim?'X':' '}) SIM   (${nao?'X':' '}) NAO`, ML+cW-39, y+rh/2+1);
    y+=rh;
  });
  y+=6;

  // observações
  doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(15,15,15);
  doc.text('Observacoes:',ML,y); y+=4;
  const oTop=y, oH=32;
  doc.setFillColor(255,255,255); doc.setDrawColor(170); doc.setLineWidth(.2);
  doc.rect(ML,oTop,cW,oH);
  for (let i=1;i*5<oH-2;i++) { doc.setDrawColor(220); doc.line(ML+2,oTop+i*5,ML+cW-2,oTop+i*5); }
  const rawObs=gv('observacoes').replace(new RegExp(SEP,'g'),'').toUpperCase().trim();
  if (rawObs) {
    doc.setFont('helvetica','normal'); doc.setFontSize(7.2); doc.setTextColor(15,15,15);
    const linhas = doc.splitTextToSize(rawObs,cW-6);
    let ty=oTop+4.5;
    for (const ln of linhas) {
      if (ty>oTop+oH-3) break;
      doc.text(ln,ML+3,ty); ty+=5;
    }
  }
  y = oTop + oH + 8;

  // assinaturas
  doc.setFillColor(...CZS); doc.rect(ML,y,cW,4,'F');
  doc.setFontSize(6.8); doc.setFont('helvetica','bold'); doc.setTextColor(...AZUL);
  doc.text('ASSINATURAS',ML+2.5,y+2.8);
  y+=5;
  const bW=(cW-8)/2, bH=32;
  doc.setFillColor(255,255,255); doc.setDrawColor(160); doc.setLineWidth(.2);
  doc.rect(ML,y,bW,bH); doc.rect(ML+bW+8,y,bW,bH);
  const iH=bH-10;
  if (temTraco('canvas_instr'))
    doc.addImage(document.getElementById('canvas_instr').toDataURL('image/png'),'PNG',ML+2,y+1,bW-4,iH);
  if (temTraco('canvas_mot'))
    doc.addImage(document.getElementById('canvas_mot').toDataURL('image/png'),'PNG',ML+bW+10,y+1,bW-4,iH);
  doc.setDrawColor(100); doc.setLineWidth(.3);
  doc.line(ML+2,y+bH-7,ML+bW-2,y+bH-7);
  doc.line(ML+bW+10,y+bH-7,ML+cW-2,y+bH-7);
  doc.setFontSize(6.5); doc.setFont('helvetica','normal'); doc.setTextColor(55,55,55);
  doc.text('Instrutor',ML+2,y+bH-4.5);
  doc.text('Nome: '+(gv('instrutor')||'—'),ML+2,y+bH-1.5);
  doc.text('Motorista',ML+bW+10,y+bH-4.5);
  doc.text('Nome: '+(gv('motorista')||'—'),ML+bW+10,y+bH-1.5);
  y+=bH+7;

  // rodapé com data e hora
  const agora = new Date();
  const horaStr = String(agora.getHours()).padStart(2,'0')+':'+String(agora.getMinutes()).padStart(2,'0');
  doc.setDrawColor(200); doc.setLineWidth(.2); doc.line(ML,y,ML+cW,y);
  doc.setFont('helvetica','normal'); doc.setFontSize(6.2); doc.setTextColor(140,140,140);
  const dataFmt = gv('data') ? gv('data').split('-').reverse().join('/') : '';
  doc.text('JCE Transportes  ·  Check List de Treinamento  ·  Gerado em '+dataFmt+' as '+horaStr, ML, y+4);

  fecharModal();

  const placa = (gv('placa_cavalo')||'SEM_PLACA').replace(/-/g,'');
  const data  = gv('data').replace(/-/g,'')||'SDATA';
  const nome  = `ChecklistTreinamento_${placa}_${data}.pdf`;

  const blob=doc.output('blob');
  const url =URL.createObjectURL(blob);
  const win =window.open(url,'_blank');
  if (win) win.addEventListener('load',()=>{ win.focus(); win.print(); });
  doc.save(nome);

  gerarCSV(placa,data);
}

/* ══════════════════════════════════════════════════════
   GERAÇÃO DO CSV
   ══════════════════════════════════════════════════════ */
function gerarCSV(placa, data) {
  const obs = gv('observacoes')
    .replace(new RegExp(SEP,'g'),'')
    .replace(/\n/g,' | ')
    .trim();

  const dataFmt = gv('data') ? gv('data').split('-').reverse().join('/') : data;

  const itensStatus = ITENS.map(([n,tx]) => {
    const sim = gc(`i${n}_sim`), nao = gc(`i${n}_nao`);
    return `${tx}: ${sim?'SIM':(nao?'NAO':'—')}`;
  }).join(' | ');

  const campos=[
    dataFmt,
    gv('instrutor')||'—',
    gv('motorista')||'—',
    gv('placa_cavalo')||'—',
    gv('placa_sr1')||'—',
    gv('placa_semi1')||'—',
    gv('placa_semi2')||'—',
    origemSelecionada()||'—',
    itensStatus,
    obs||'—'
  ];

  const linha=campos.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',');
  const cab='"Data","Instrutor","Motorista","Placa Cavalo","Placa SR","Placa Semi 1","Placa Semi 2","Origem","Itens","Observações"';
  const csv='\uFEFF'+cab+'\n'+linha;

  const csvBlob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const csvUrl =URL.createObjectURL(csvBlob);
  const link   =document.createElement('a');
  link.href=csvUrl; link.download=`ChecklistTreinamento_${placa}_${data}.csv`;
  document.body.appendChild(link); link.click();
  document.body.removeChild(link); URL.revokeObjectURL(csvUrl);
}
