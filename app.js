// ── DADOS ──────────────────────────────────────────────────────────────
const ITENS = {
  lub: [
    [1,  "Óleo de Motor (examinar nível)"],
    [2,  "Óleo Direção Hidráulica (examinar nível)"],
    [3,  "Fluido de Arrefecimento (examinar nível)"]
  ],
  motor: [
    [4,  "Ausência de Vazamentos de Óleo"],
    [5,  "Ruído do Motor"],
    [6,  "Correias"]
  ],
  eletrica: [
    [7,  "Farois / Lanternas / Lampadas / Sinalizações"]
  ],
  freio_cav: [
    [8,  "Verificar Lonas"],
    [9,  "Verificar Cubos e Rolamentos"]
  ],
  cabine: [
    [10, "Tacógrafo e Computador de Bordo em Perfeito Estado de Funcionamento"],
    [11, "Adesivo de Tara e Lotação"],
    [12, "Para-brisa sem Trincas / Limpadores / esguicho de água"],
    [13, "Extintor"],
    [14, "Funilaria e Pintura"]
  ],
  chassi_cav: [
    [15, "Longarinas e Travessas (verificar corrosão / trinca / torção / amassado)"],
    [16, "Para-choque (amassado / Pintura)"],
    [17, "Placa (Lacre / Iluminação / Pintura)"],
    [18, "Suporte dos Grampos (verificar: grampos/porcas/feixe de molas/batentes e suportes)"],
    [19, "Para-Lama / Para-barro (verificar)"],
    [20, "Quinta-Roda e Gavião (examinar folga) Pino Rei"],
    [21, "Pneus (avaliar acima de 2,5 mm +/- 0,5 mm) inclusive estepe - aperto de parafusos das rodas"],
    [22, "Alinhamento e Balanceamento"]
  ],
  gases: [
    [23, "Verificação opacidade"]
  ],
  freio_sr: [
    [24, "Verificar Lonas"],
    [25, "Verificar Cubos e Rolamentos"]
  ],
  outros: [
    [26, "Válvulas"],
    [27, "Acoplamentos"],
    [28, "Gaxetas / Selos"],
    [29, "Mangotes e Medidores"],
    [30, "Unidades de Controle de Temperaturas"],
    [31, "Equipamentos de Segurança"],
    [32, "Placas de simbologia"],
    [33, "Válvulas de Alívio"],
    [34, "Óleo do Compressor (verificar)"],
    [35, "Filtro do Compressor (verificar estado)"],
    [36, "Compressor (Fazer Teste)"],
    [37, "Motor da Glucose e seus Componentes (Fazer Teste)"],
    [38, "Bomba Descarga (Fazer Teste)"],
    [39, "Verificar Parte Elétrica (cabos e caixa elétrica)"]
  ],
  chassi_sr: [
    [39, "Longarinas e Travessas (verificar corrosão / trinca / torção / amassado)"],
    [40, "Para-choque (amassado / Pintura)"],
    [41, "Placa (Lacre / Iluminação / Pintura)"],
    [42, "Suporte dos Grampos (verificar: grampos/porcas/feixe de molas/batentes e suportes)"],
    [43, "Para-Lama / Para-barro (verificar)"],
    [44, "Quinta-Roda (examinar folga)"],
    [45, "Pneus (avaliar acima de 2,5 mm +/- 0,5 mm) inclusive estepe"],
    [46, "Reaperto de Parafusos de Rodas"],
    [47, "Reaperto Rala"],
    [48, "Reaperto Pistão"],
    [49, "Reaperto Pés e Conexões"],
    [50, "Reajuste Borracha e aneis de vedação da boca de visita"],
    [51, "Alinhamento e Balanceamento"]
  ],
  suspensao: [
    [52, "Molas, Pinos e Estirantes"]
  ],
  carga: [
    [53, "Condição dos Bocais, Garras, Travas e Tampas"],
    [54, "Tanques Isentos de Vazamentos, Trincas e com as Bocas Limpas"],
    [55, "Lonas de Forração, Cordas, Madeirite e travas (uso somente para baú)"]
  ]
};

const MAP = {
  b_lub:       'lub',
  b_motor:     'motor',
  b_eletrica:  'eletrica',
  b_freio_cav: 'freio_cav',
  b_cabine:    'cabine',
  b_chassi_cav:'chassi_cav',
  b_gases:     'gases',
  b_freio_sr:  'freio_sr',
  b_outros:    'outros',
  b_chassi_sr: 'chassi_sr',
  b_suspensao: 'suspensao',
  b_carga:     'carga'
};

const PALAVRAS_DESTAQUE = ['CAVALO', 'CARRETA 1', 'CARRETA 2', 'CARRETA'];

// ── RENDERIZAÇÃO DE ITENS ───────────────────────────────────────────────
(function renderItens() {
  for (const [bid, grp] of Object.entries(MAP)) {
    const tb = document.getElementById(bid);
    ITENS[grp].forEach(([n, d]) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${n}</td>
        <td>${d}</td>
        <td>
          <div class="chk-group">
            <label><input type="checkbox" id="i${n}_sim" value="SIM"> Sim</label>
            <label><input type="checkbox" id="i${n}_nao" value="NAO"> Não</label>
            <label><input type="checkbox" id="i${n}_na"  value="NA"> NA</label>
          </div>
        </td>`;
      tb.appendChild(tr);
    });
  }
})();

function getChecks(n) {
  const vals = [];
  if (document.getElementById(`i${n}_sim`)?.checked) vals.push('SIM');
  if (document.getElementById(`i${n}_nao`)?.checked) vals.push('NAO');
  if (document.getElementById(`i${n}_na`)?.checked)  vals.push('NA');
  return vals;
}

// ── FORMATAÇÃO DE CAMPOS ────────────────────────────────────────────────
function formatarKM(el) {
  const v = el.value.replace(/\D/g, '');
  el.value = v === '' ? '' : parseInt(v, 10).toLocaleString('pt-BR');
}

function formatarPlaca(el) {
  const pos = el.selectionStart;
  let raw = el.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (raw.length > 7) raw = raw.slice(0, 7);
  let out = '';
  for (let i = 0; i < raw.length; i++) {
    if (i === 3) out += '-';
    out += raw[i];
  }
  el.value = out;
  try {
    const np = out.length >= 4 && pos === 3 ? 4 : Math.min(pos, out.length);
    el.setSelectionRange(np, np);
  } catch (e) {}
}

function aplicarFormatacaoObs(txt) {
  return txt.toUpperCase();
}

// ── CANVAS ALTA RESOLUÇÃO ───────────────────────────────────────────────
const DPR   = Math.min(window.devicePixelRatio || 1, 3);
const SIG_W = Math.round(540 * DPR);
const SIG_H = Math.round(160 * DPR);

function initCanvas(id) {
  const c   = document.getElementById(id);
  c.width   = SIG_W;
  c.height  = SIG_H;
  const ctx = c.getContext('2d');
  ctx.fillStyle   = '#ffffff';
  ctx.fillRect(0, 0, SIG_W, SIG_H);
  ctx.lineWidth   = 2.5 * DPR;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.strokeStyle = '#0a0a0a';

  let dr = false;

  const pt = e => {
    const r   = c.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - r.left) * (SIG_W / r.width),
      y: (src.clientY - r.top)  * (SIG_H / r.height)
    };
  };

  const start = e => {
    dr = true;
    const p = pt(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };
  const move = e => {
    if (!dr) return;
    const p = pt(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };
  const stop = () => dr = false;

  c.addEventListener('mousedown',  start);
  c.addEventListener('mousemove',  move);
  c.addEventListener('mouseup',    stop);
  c.addEventListener('mouseleave', stop);
  c.addEventListener('touchstart', e => { e.preventDefault(); start(e); }, { passive: false });
  c.addEventListener('touchmove',  e => { e.preventDefault(); move(e);  }, { passive: false });
  c.addEventListener('touchend',   stop);
}
initCanvas('canvas_conf');
initCanvas('canvas_mot');

function limpar(id) {
  const c = document.getElementById(id), ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, c.width, c.height);
}

function temAssinatura(id) {
  const d = document.getElementById(id).getContext('2d').getImageData(0, 0, SIG_W, SIG_H).data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i] < 200 && d[i+1] < 200 && d[i+2] < 200) return true;
  }
  return false;
}

// ── FLUXO DE ETAPAS DO MODAL ────────────────────────────────────────────
let etapaAtual = 1;

function abrirModal() {
  etapaAtual = 1;
  atualizarEtapa();
  document.getElementById('modal-overlay').classList.add('show');
}

function fecharModal() {
  document.getElementById('modal-overlay').classList.remove('show');
}

function irEtapa(n) {
  etapaAtual = n;
  atualizarEtapa();
}

function atualizarEtapa() {
  [1, 2, 3].forEach(i => {
    document.getElementById(`step${i}`).style.display = (i === etapaAtual) ? '' : 'none';
  });

  const dots = [document.getElementById('dot1'), document.getElementById('dot2'), document.getElementById('dot3')];
  const lines = [document.getElementById('line1'), document.getElementById('line2')];
  const lbls  = [document.getElementById('lbl1'),  document.getElementById('lbl2'),  document.getElementById('lbl3')];

  dots.forEach((d, i) => {
    d.classList.remove('active', 'done');
    lbls[i].classList.remove('active', 'done');
    if (i + 1 < etapaAtual)      { d.classList.add('done');   lbls[i].classList.add('done'); }
    else if (i + 1 === etapaAtual){ d.classList.add('active'); lbls[i].classList.add('active'); }
  });
  lines.forEach((l, i) => {
    l.classList.remove('done');
    if (i + 1 < etapaAtual) l.classList.add('done');
  });

  if (etapaAtual === 3) {
    document.getElementById('prev_conf').src = document.getElementById('canvas_conf').toDataURL('image/png');
    document.getElementById('prev_mot').src  = document.getElementById('canvas_mot').toDataURL('image/png');
  }
}

document.getElementById('modal-overlay').addEventListener('click', function(e) {
  if (e.target === this) fecharModal();
});

// ── HELPERS ─────────────────────────────────────────────────────────────
const gv = id => (document.getElementById(id) || {}).value || '';
const gc = id => document.getElementById(id)?.checked || false;

// ── GERADOR DE PDF ───────────────────────────────────────────────────────
function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const W = 210, ML = 12, cW = 186;

  const ROD_Y     = 278;
  const ROD_H     = 10;
  const SIG_H_PDF = 32;
  const SIG_Y     = ROD_Y - SIG_H_PDF - 3;

  let y = 0, pag = 1;
  const AZUL = [26, 26, 46], CZ = [228, 232, 242], CZS = [210, 218, 236];

  // ── cabeçalho só pg1 ──────────────────────────────────────────────────
  function cabecalho() {
    y = 0;
    doc.setFillColor(...AZUL); doc.rect(0, 0, W, 15, 'F');
    doc.setFontSize(11.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('CHECK LIST DE MANUTENCAO PREVENTIVA', W / 2, 9.5, { align: 'center' });
    doc.setFillColor(255, 255, 255); doc.roundedRect(W - ML - 22, 1.5, 22, 12, 2, 2, 'F');
    doc.setFontSize(13); doc.setFont('helvetica', 'bolditalic'); doc.setTextColor(...AZUL);
    doc.text('JCE', W - ML - 11, 10, { align: 'center' });
    y = 17;
    doc.setLineWidth(.25); doc.setDrawColor(160);

    doc.rect(ML, y, cW, 6);
    const c1 = [28, 18, 26, cW - 72]; let x = ML;
    doc.setFontSize(6.2); doc.setFont('helvetica', 'bold'); doc.setTextColor(50, 50, 50);
    ['DATA', 'REVISAO', 'PAGINA', 'DEPARTAMENTO'].forEach((h, i) => {
      doc.text(h, x + 1, y + 2.2); x += c1[i]; if (i < 3) doc.line(x, y, x, y + 6);
    });
    x = ML; doc.setFont('helvetica', 'normal'); doc.setTextColor(15, 15, 15);
    [gv('data'), gv('revisao') || '00', '1 de 2', gv('departamento') || 'Frota / Manutencao'].forEach((v, i) => {
      doc.text(v, x + 1, y + 4.8); x += c1[i];
    });
    y += 6.5;

    doc.rect(ML, y, cW, 6);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(6.2); doc.setTextColor(50, 50, 50);
    doc.text('TIPO', ML + 1, y + 2.2);
    doc.setFont('helvetica', 'normal');
    const cv = gc('tipo_cavalo'), sd = gc('tipo_sider'), rt = gc('tipo_rodotrem');
    doc.text(`(${cv ? 'X' : ' '}) CAVALO  (${sd ? 'X' : ' '}) SIDER  (${rt ? 'X' : ' '}) RODOTREM`, ML + 11, y + 2.2);
    const dx = ML + cW / 2 - 8;
    doc.setFont('helvetica', 'bold'); doc.text('DATA', dx, y + 2.2);
    doc.setFont('helvetica', 'normal'); doc.text(gv('data'), dx + 9, y + 2.2);
    doc.setFont('helvetica', 'bold'); doc.text('KM', ML + cW - 22, y + 2.2);
    doc.setFont('helvetica', 'normal'); doc.text(gv('km'), ML + cW - 16, y + 2.2);
    y += 6.5;

    doc.rect(ML, y, cW, 6);
    [cW * .44, cW * .63, cW * .81].forEach(p => doc.line(ML + p, y, ML + p, y + 6));
    doc.setFont('helvetica', 'bold'); doc.setFontSize(6.2);
    doc.text('NOME MOTORISTA',  ML + 1,           y + 2.2);
    doc.text('PLACA CAVALO',    ML + cW * .44 + 1, y + 2.2);
    doc.text('PLACA SR1',       ML + cW * .63 + 1, y + 2.2);
    doc.text('PLACA SR2',       ML + cW * .81 + 1, y + 2.2);
    doc.setFont('helvetica', 'normal');
    doc.text(gv('motorista'),      ML + 1,           y + 4.8);
    doc.text(gv('placa_cavalo'),   ML + cW * .44 + 1, y + 4.8);
    doc.text(gv('placa_sr1'),      ML + cW * .63 + 1, y + 4.8);
    doc.text(gv('placa_sr2'),      ML + cW * .81 + 1, y + 4.8);
    y += 8;
  }

  function novaPag() { doc.addPage(); pag++; y = 8; }
  function chk(esp = 14) {
    if (pag === 1 && y > 297 - esp) { novaPag(); return; }
    if (pag === 2 && y > SIG_Y - esp) { novaPag(); }
  }

  function secTit(t) {
    chk();
    doc.setFillColor(...AZUL); doc.rect(ML, y, cW, 4.8, 'F');
    doc.setFontSize(6.8); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text(t.toUpperCase(), ML + 2.5, y + 3.3);
    y += 5.5;
  }

  function subTit(t) {
    chk();
    doc.setFillColor(...CZS); doc.rect(ML, y, cW, 3.8, 'F');
    doc.setFontSize(6.2); doc.setFont('helvetica', 'bold'); doc.setTextColor(...AZUL);
    doc.text(t.toUpperCase(), ML + 2.5, y + 2.7);
    y += 4.4;
  }

  function iRow(n, d, par) {
    chk(10);
    const rh = 4.0;
    if (par) { doc.setFillColor(248, 249, 253); doc.rect(ML, y, cW, rh, 'F'); }
    doc.setLineWidth(.13); doc.setDrawColor(200);
    doc.rect(ML, y, cW, rh);
    doc.line(ML + 9, y, ML + 9, y + rh);
    doc.line(ML + cW - 50, y, ML + cW - 50, y + rh);
    doc.setFontSize(5.8); doc.setFont('helvetica', 'bold'); doc.setTextColor(140, 140, 140);
    doc.text(String(n), ML + 4.5, y + 2.7, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setTextColor(15, 15, 15);
    doc.text(doc.splitTextToSize(d, cW - 62), ML + 10.5, y + 2.7);
    const checks = getChecks(n);
    const mk = `(${checks.includes('SIM') ? 'X' : ' '}) Sim  (${checks.includes('NAO') ? 'X' : ' '}) Nao  (${checks.includes('NA') ? 'X' : ' '}) NA`;
    doc.setFontSize(5.5); doc.setTextColor(15, 15, 15);
    doc.text(mk, ML + cW - 49, y + 2.7);
    y += rh;
  }

  function grpRender(k) { ITENS[k].forEach(([n, d], i) => iRow(n, d, i % 2 === 1)); }

  function rodapeFinal() {
    doc.setPage(2);
    doc.setFillColor(...CZ); doc.rect(ML, ROD_Y, cW, ROD_H / 2, 'F');
    doc.setLineWidth(.2); doc.setDrawColor(145); doc.rect(ML, ROD_Y, cW, ROD_H / 2);
    const cs = [28, 18, 48, 48, cW - 142]; let rx = ML;
    doc.setFontSize(5.8); doc.setFont('helvetica', 'bold'); doc.setTextColor(40, 40, 80);
    ['DATA', 'REVISAO', 'ELABORADO POR', 'APROVADO POR', 'PAGINA'].forEach((h, i) => {
      doc.text(h, rx + 1, ROD_Y + 3); rx += cs[i]; if (i < 4) doc.line(rx, ROD_Y, rx, ROD_Y + ROD_H / 2);
    });
    rx = ML;
    doc.rect(ML, ROD_Y + ROD_H / 2, cW, ROD_H / 2);
    const ap = gv('aprovado') || 'Andre Cruz';
    [gv('data'), '00', ap, ap, '2 de 2'].forEach((v, i) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(5.8); doc.setTextColor(15);
      doc.text(v, rx + 1, ROD_Y + ROD_H / 2 + 3.5); rx += cs[i];
    });
  }

  function assinaturas() {
    doc.setPage(2);
    const bW = (cW - 8) / 2;
    doc.setFillColor(...CZS); doc.rect(ML, SIG_Y, cW, 4, 'F');
    doc.setFontSize(6.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...AZUL);
    doc.text('ASSINATURAS', ML + 2.5, SIG_Y + 2.8);
    const boxY = SIG_Y + 5, boxH = SIG_H_PDF - 5 - 4;
    doc.setFillColor(255, 255, 255); doc.setDrawColor(160); doc.setLineWidth(.2);
    doc.rect(ML, boxY, bW, boxH);
    doc.rect(ML + bW + 8, boxY, bW, boxH);
    const imgH = boxH - 10;
    if (temAssinatura('canvas_conf'))
      doc.addImage(document.getElementById('canvas_conf').toDataURL('image/png'), 'PNG', ML + 2, boxY + 1, bW - 4, imgH);
    if (temAssinatura('canvas_mot'))
      doc.addImage(document.getElementById('canvas_mot').toDataURL('image/png'), 'PNG', ML + bW + 10, boxY + 1, bW - 4, imgH);
    doc.setDrawColor(100); doc.setLineWidth(.3);
    doc.line(ML + 2, boxY + boxH - 7, ML + bW - 2, boxY + boxH - 7);
    doc.line(ML + bW + 10, boxY + boxH - 7, ML + cW - 2, boxY + boxH - 7);
    doc.setFontSize(6.2); doc.setFont('helvetica', 'normal'); doc.setTextColor(55, 55, 55);
    doc.text('Conferente / Vistoriador', ML + 2,        boxY + boxH - 4.5);
    doc.text('Nome: ' + gv('vistoriador'),ML + 2,        boxY + boxH - 1.5);
    doc.text('Motorista',                 ML + bW + 10,  boxY + boxH - 4.5);
    doc.text('Nome: ' + gv('motorista'),  ML + bW + 10,  boxY + boxH - 1.5);
  }

  function observacoes() {
    if (pag === 1) novaPag();
    doc.setFontSize(6.8); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 15, 15);
    doc.text('Observacoes:', ML, y);
    y += 4;
    const obsTop = y, GAP = 4, obsH = Math.max(10, SIG_Y - GAP - obsTop);
    doc.setFillColor(255, 255, 255); doc.setDrawColor(170); doc.setLineWidth(.2);
    doc.rect(ML, obsTop, cW, obsH);
    for (let i = 1; i * 4 < obsH - 2; i++) {
      doc.setDrawColor(220); doc.line(ML + 2, obsTop + i * 4, ML + cW - 2, obsTop + i * 4);
    }
    const rawObs = gv('observacoes').toUpperCase();
    if (rawObs) {
      const linhasObs = doc.splitTextToSize(rawObs, cW - 6);
      const palavras  = [...PALAVRAS_DESTAQUE].sort((a, b) => b.length - a.length);
      let ty = obsTop + 4;
      for (const linha of linhasObs) {
        if (ty > obsTop + obsH - 3) break;
        renderLinhaObs(linha, ML + 3, ty, palavras);
        ty += 4;
      }
    }
  }

  function renderLinhaObs(linha, x, y, palavras) {
    const regex  = new RegExp(`(${palavras.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
    const tokens = linha.split(regex).filter(t => t !== undefined && t !== '');
    let cx = x;
    for (const tok of tokens) {
      const destaque = palavras.includes(tok);
      if (destaque) {
        doc.setFont('helvetica', 'bold');   doc.setFontSize(7.5);
      } else {
        doc.setFont('helvetica', 'normal'); doc.setFontSize(6.8);
      }
      doc.setTextColor(15, 15, 15);
      doc.text(tok, cx, y);
      cx += doc.getTextWidth(tok);
    }
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6.8);
  }

  // ── BUILD ────────────────────────────────────────────────────────────
  cabecalho();

  secTit('Cavalo Mecanico');
  subTit('Lubrificacao');     grpRender('lub');
  subTit('Motor');            grpRender('motor');
  subTit('Eletrica');         grpRender('eletrica');
  subTit('Freio');            grpRender('freio_cav');
  subTit('Cabine');           grpRender('cabine');
  subTit('Chassi');           grpRender('chassi_cav');
  subTit('Emissao de Gases'); grpRender('gases');

  secTit('Semi-Reboque');
  subTit('Freio');                    grpRender('freio_sr');
  subTit('Outros');                   grpRender('outros');
  subTit('Chassi');                   grpRender('chassi_sr');
  subTit('Suspensao');                grpRender('suspensao');
  subTit('Compartimento de Carga');   grpRender('carga');

  if (pag === 1) novaPag();
  y += 6;
  observacoes();
  assinaturas();
  rodapeFinal();

  fecharModal();

  const placas     = [gv('placa_cavalo'), gv('placa_sr1'), gv('placa_sr2')];
  const placaNome  = (placas.find(p => p.trim() !== '') || 'SEM_PLACA').replace(/-/g, '');
  const dataStr    = gv('data').replace(/-/g, '') || 'SDATA';
  const nomeArquivo = `Checklist_${placaNome}_${dataStr}.pdf`;

  const blob = doc.output('blob');
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  if (win) win.addEventListener('load', () => { win.focus(); win.print(); });
  doc.save(nomeArquivo);
}
