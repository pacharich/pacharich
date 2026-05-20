// モデル一覧データ（仕様書ベース）
const FEMALES = [
  { id: 'ako',   name: 'アコ',   age: 31, location: '東京',         origin: '',       height: 161, size: 'B81 / W60 / H86',         exp: 6,  shots: 4, note: '' },
  { id: 'alice', name: 'アリス', age: 33, location: '東京',         origin: '',       height: 154, size: '服装 M（他非公開）',       exp: 4,  shots: 4, note: '' },
  { id: 'misa',  name: '美沙',   age: 32, location: '東京都',       origin: '愛媛県', height: 160, size: 'B84 / W60 / H85',         exp: 7,  shots: 4, note: '' },
  { id: 'kana',  name: '香奈',   age: 34, location: '東京',         origin: '',       height: 159, size: 'B75 / W60 / H89',         exp: 8,  shots: 5, note: '' },
  { id: 'rina',  name: 'りな',   age: 35, location: '東京',         origin: '',       height: 162, size: 'B83 / W61 / H87',         exp: 11, shots: 5, note: '' },
  { id: 'kano',  name: 'KANO',   age: 28, location: '兵庫県神戸市', origin: '',       height: 157, size: 'B70 / W55',               exp: 3,  shots: 4, note: '遠方のため、兵庫駅から現地までの往復交通費を実費にてご負担いただきます。' },
  { id: 'mio',   name: '美緒',   age: 33, location: '東京都',       origin: '石川県', height: 153, size: 'B82 / W55 / H86',         exp: 6,  shots: 5, note: '' },
  { id: 'maika', name: 'マイカ', age: 29, location: '東京都',       origin: '千葉県', height: 153, size: '服装 S（他非公開）',       exp: 3,  shots: 4, note: '' },
  { id: 'mana',  name: 'マナ',   age: 30, location: '東京都',       origin: '',       height: 162, size: '服装 M（他非公開）',       exp: 3,  shots: 5, note: '' },
];

const MALES = [
  { id: 'masaki',    name: 'マサキ',   age: 26, location: '千葉県',   origin: '',       height: 175, size: 'B96 / W75 / H90',  exp: 2, shots: 5, note: '' },
  { id: 'ゆうき',    name: 'ゆうき',   age: 28, location: '東京都',   origin: '',       height: 181, size: 'B85 / W79 / H93',  exp: 4, shots: 5, note: '俳優歴9年' },
  { id: 'まさよし',  name: 'まさよし', age: 28, location: '東京都',   origin: '',       height: 176, size: '服装 L／体重54kg', exp: 2, shots: 5, note: '' },
  { id: 'こうすけ',  name: 'こうすけ', age: 27, location: '東京都',   origin: '福岡県', height: 175, size: 'B81 / W69 / H90',  exp: 4, shots: 5, note: '' },
  { id: 'あきら',    name: 'あきら',   age: 30, location: '神奈川県', origin: '',       height: 181, size: 'B80 / W72 / H88',  exp: 2, shots: 5, note: '' },
  { id: 'りょうた',  name: 'りょうた', age: 31, location: '東京都',   origin: '',       height: 180, size: 'B87 / W76 / H94',  exp: 2, shots: 5, note: '' },
];

// 既存の画像スロット互換性のため、男性IDは英字も内部的にエイリアスとして利用
// （画像スロットの保存キーが変わると過去の画像が消えるため、保存IDは変更しない）
MALES[0].id = 'masaki';
MALES[1].id = 'yuki';
MALES[2].id = 'masayoshi';
MALES[3].id = 'kosuke';
MALES[4].id = 'akira';
MALES[5].id = 'ryota';

const selected = new Set(); // model ids
let currentTab = 'female';
let lbList = FEMALES;
let lbIdx = 0;
let lbShot = 0;

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

// 在住地＋出身の整形
function locText(m){
  return m.origin ? `${m.location}（出身：${m.origin}）` : m.location;
}

// ============ Grid render ============
function renderGrid(){
  const list = currentTab === 'female' ? FEMALES : MALES;
  const grid = $('#grid');
  grid.innerHTML = '';
  list.forEach((m, i) => {
    const card = document.createElement('article');
    card.className = 'card' + (selected.has(m.id) ? ' selected' : '');
    card.dataset.id = m.id;
    card.dataset.idx = i;

    const numLabel = (currentTab === 'female' ? '女性' : '男性') + String(i+1).padStart(2,'0');
    const slot = `<image-slot id="${m.id}-1" placeholder="${m.name} — 写真をドロップ" shape="rect"></image-slot>`;

    card.innerHTML = `
      <div class="card-photo">
        ${slot}
        <span class="card-no">${numLabel}</span>
        
        <span class="card-check">✓</span>
      </div>
      <div class="card-body">
        <div class="card-name">
          <span class="nm">${m.name}</span>
          <span class="age">${m.age}歳</span>
        </div>
        <div class="card-loc">${locText(m)}</div>
        <div class="card-stat">
          <span><span class="l">身長</span>${m.height}cm</span>
          <span><span class="l">モデル歴</span>${m.exp}年</span>
        </div>
        ${m.note ? `<span class="card-note">${m.note}</span>` : ''}
      </div>
    `;
    card.addEventListener('click', () => openLightbox(i));
    if (currentTab === 'male' && m.id !== 'ゆうき') {
      setTimeout(() => {
        const img = card.querySelector('image-slot');
        if (img) { img.style.transform = 'scale(1.12)'; img.style.transformOrigin = 'center center'; }
      }, 500);
    }

    grid.appendChild(card);
  });
  $('#gridCount').textContent = list.length;
  $('#gridLabel').textContent = currentTab === 'female' ? '女性 ／ ' : '男性 ／ ';
}

// ============ Tabs ============
$$('.tab').forEach(t => {
  t.addEventListener('click', () => {
    $$('.tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    currentTab = t.dataset.tab;
    renderGrid();
  });
});

// ============ Lightbox ============
const lb = $('#lb');

function openLightbox(idx){
  lbList = currentTab === 'female' ? FEMALES : MALES;
  lbIdx = idx;
  lbShot = 0;
  renderLightbox();
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(){
  lb.classList.remove('open');
  document.body.style.overflow = '';
}
function renderLightbox(){
  const m = lbList[lbIdx];
  const role = currentTab === 'female' ? '女性 ／ ' : '男性 ／ ';
  const numLabel = (currentTab === 'female' ? '女性' : '男性') + String(lbIdx+1).padStart(2,'0');

  // main slot — points to the active shot
  const main = $('#lbMain');
  main.innerHTML = `<image-slot id="${m.id}-${lbShot+1}" placeholder="${m.name} — ${String(lbShot+1).padStart(2,'0')}枚目" shape="rounded" radius="6"></image-slot>`;

  // strip
  const strip = $('#lbStrip');
  strip.innerHTML = '';
  for (let i = 0; i < m.shots; i++){
    const t = document.createElement('div');
    t.className = 'lb-thumb' + (i === lbShot ? ' active' : '');
    t.innerHTML = `<image-slot id="${m.id}-${i+1}" placeholder="${String(i+1).padStart(2,'0')}" shape="rect"></image-slot><span class="lb-thumb-no">${String(i+1).padStart(2,'0')}</span>`;
    t.addEventListener('click', () => { lbShot = i; renderLightbox(); });
    strip.appendChild(t);
  }

  // info
  $('#lbId').innerHTML = `<span class="accent">${numLabel}</span> &nbsp;／&nbsp; 全${String(m.shots).padStart(2,'0')}カット中 <strong>${String(lbShot+1).padStart(2,'0')}</strong>枚目`;
  $('#lbKicker').textContent = role;
  $('#lbName').innerHTML = `${m.name} <span class="age">${m.age}歳</span>`;
  $('#lbLoc').textContent = locText(m);
  $('#lbHeight').textContent = m.height;
  $('#lbSize').textContent = m.size;
  $('#lbExp').textContent = m.exp;
  $('#lbAge').textContent = m.age;
  $('#lbShotsV').innerHTML = `${m.shots} <span class="of">全${m.shots}カット</span>`;

  const note = $('#lbNote');
  if (m.note){ note.style.display = 'flex'; note.textContent = m.note; }
  else { note.style.display = 'none'; }

  // select btn
  const selBtn = $('#lbSelect');
  if (selected.has(m.id)){
    selBtn.innerHTML = '<span>✓</span> 選考リストから外す';
    selBtn.classList.remove('primary');
    selBtn.classList.add('danger');
  } else {
    selBtn.innerHTML = 'この候補を選考に追加';
    selBtn.classList.add('primary');
    selBtn.classList.remove('danger');
  }

  // nav
  $('#lbPrev').disabled = lbIdx === 0;
  $('#lbNext').disabled = lbIdx === lbList.length - 1;
}

$('#lbSelect').addEventListener('click', () => {
  const m = lbList[lbIdx];
  if (selected.has(m.id)) selected.delete(m.id);
  else selected.add(m.id);
  renderLightbox(); renderGrid(); renderSelectBar();
});
$('#lbPrev').addEventListener('click', () => {
  if (lbIdx > 0){ lbIdx--; lbShot = 0; renderLightbox(); }
});
$('#lbNext').addEventListener('click', () => {
  if (lbIdx < lbList.length - 1){ lbIdx++; lbShot = 0; renderLightbox(); }
});
$('#lbClose').addEventListener('click', closeLightbox);

// ============ Image replace / clear ============
function getMainSlot(){ return $('#lbMain image-slot'); }
function triggerSlotInput(){
  const slot = getMainSlot();
  if (!slot || !slot.shadowRoot) return;
  const input = slot.shadowRoot.querySelector('input[type="file"]');
  if (input) input.click();
}
function clearMainSlot(){
  const slot = getMainSlot();
  if (!slot || !slot.shadowRoot) return;
  const btn = slot.shadowRoot.querySelector('[data-act="clear"]');
  if (btn) btn.click();
}
$('#lbReplace').addEventListener('click', triggerSlotInput);
$('#lbClear').addEventListener('click', () => {
  const m = lbList[lbIdx];
  if (confirm(`${m.name} の ${String(lbShot+1).padStart(2,'0')}枚目の画像を削除しますか？`)){
    clearMainSlot();
  }
});
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft' && !$('#lbPrev').disabled) $('#lbPrev').click();
  if (e.key === 'ArrowRight' && !$('#lbNext').disabled) $('#lbNext').click();
  if (e.key === 'ArrowUp'){ e.preventDefault(); if (lbShot > 0){ lbShot--; renderLightbox(); } }
  if (e.key === 'ArrowDown'){ e.preventDefault(); const m = lbList[lbIdx]; if (lbShot < m.shots-1){ lbShot++; renderLightbox(); } }
});

// ============ Selection bar ============
function renderSelectBar(){
  const bar = $('#sb');
  const list = $('#sbList');
  $('#sbCount').textContent = selected.size;
  if (selected.size === 0){
    bar.classList.remove('show');
    list.innerHTML = '<span class="sb-empty">候補を選択してください</span>';
    $('#sbCta').disabled = true;
    return;
  }
  bar.classList.add('show');
  $('#sbCta').disabled = false;
  list.innerHTML = '';
  [...selected].forEach(id => {
    const all = [...FEMALES, ...MALES];
    const m = all.find(x => x.id === id);
    const isF = FEMALES.some(x => x.id === id);
    const chip = document.createElement('span');
    chip.className = 'sb-chip';
    chip.innerHTML = `<span class="g">${isF ? '女' : '男'}</span>${m.name}<span class="x">✕</span>`;
    chip.querySelector('.x').addEventListener('click', () => {
      selected.delete(id);
      renderGrid(); renderSelectBar();
      if (lb.classList.contains('open')) renderLightbox();
    });
    list.appendChild(chip);
  });
}

$('#sbCta').addEventListener('click', () => {
  const all = [...FEMALES, ...MALES];
  const names = [...selected].map(id => all.find(x => x.id === id).name);
  alert('以下の構成で進めます：\n\n' + names.join(' ／ '));
});

// ============ Init ============
renderGrid();
renderSelectBar();
