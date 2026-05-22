// ============ 出演可能日 ============
const AVAILABILITY = {
  sky:    [{ date: '6/30（月）', ok: false }, { date: '7/1（火）', ok: true }],
  masami: [{ date: '6/30（月）', ok: true  }, { date: '7/1（火）', ok: true }],
  yuka:   [{ date: '6/30（月）', ok: true  }, { date: '7/1（火）', ok: true }],
  minato: [{ date: '6/30（月）', ok: false }, { date: '7/1（火）', ok: true }],
  seiki:  [{ date: '6/30（月）', ok: true  }, { date: '7/1（火）', ok: true }],
  yuki:   [{ date: '6/30（月）', ok: false }, { date: '7/1（火）', ok: true }],
};

// ============ Model Data ============
const FEMALES = [
  {
    id: 'sky', name: 'スカイ', age: 28,
    height: 160, size: 'B 78cm / W 58cm / H 86cm',
    shoe: '23.5cm', exp: 7, location: '東京都',
    achievementTitle: 'ブライダルモデル活動実績',
    achievements: [
      'JRクレメントホテル高松','ONELIFE 横浜',
      'スタジオゼロ 宇治、長堀橋、岡山、奈良、堺','スタジオアーク',
      'フォレストテラス熊本','レイジーシンデレラ','欅','THE SORAKUEN',
      'スタジオアンルージュ','ワタベウェディング','カサデアンジェラ馬車道',
      'FANTADRESS','ハルウェディング','ベルクラシック姫路',
      '東京ステーションホテル','STELLA BRIDAL 等'
    ]
  },
  {
    id: 'masami', name: 'まさみ', age: 32,
    height: 182, size: 'B 81.5cm / W 62cm / H 88cm',
    shoe: '23.0cm', exp: 5, location: '東京都',
    achievementTitle: 'WEB・広告',
    achievements: [
      '東急カード「TOKYU CARDスマート払い」（広告モデル）',
      'pdc「ピメル パーフェクトロング＆カールマスカラN」（広告モデル）',
      'Adobe Illustrator（WEB広告ムービー）',
      '菊正宗「KIKUCO」（WEB広告）',
      'ミルボン「MIINCURL」（パンフレット）',
      'SALONIA（製品イメージモデル）',
      'ReFa（広告ムービー）',
      'エアリーアンドイージー（広告モデル）',
      'ヒルトン成田（HP・WEB広告）',
      'パレスいわや（メインビジュアル）'
    ]
  },
  {
    id: 'yuka', name: 'ユウカ', age: 25,
    height: 158, size: 'B 77cm / W 58cm / H 86cm',
    shoe: '23.5cm', exp: null, location: '佐賀県',
    achievementTitle: 'ブライダル活動実績',
    achievements: [
      'IKK 株式会社様','アートホテル小倉ニュータガワ様',
      'WITH THE STYLE FUKUOKA 1*','THE BASICS FUKUOKA 1*',
      'We Green Resort 1*','THE GRAND HOUSE 様',
      'パサージュ琴海ウェディング 様','ホテルマリターレ創世（佐賀／久留米）様'
    ]
  },
];

const MALES = [
  {
    id: 'minato', name: 'みなと', age: 33,
    height: 177, size: 'C 92cm / W 70cm / H 88cm',
    shoe: '28.0cm', clothesSize: 'L', hairColor: 'Black', eyeColor: 'Brown',
    location: '東京都'
  },
  {
    id: 'seiki', name: 'せいき', age: 29,
    height: 182, size: 'C 95cm / W 73cm / H 98cm',
    shoe: '27.5cm', clothesSize: 'L', hairColor: 'Black',
    location: '東京都'
  },
  {
    id: 'yuki', name: 'ゆうき', age: 28,
    height: 181, size: 'B 85cm / W 79cm / H 93cm',
    location: '東京都'
  },
];

let currentTab = 'female';
let lbList = FEMALES;
let lbIdx = 0;
let lbShot = 0;

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

function getPhotos(m) {
  const genderKey = currentTab === 'female' ? 'female' : 'male';
  return (PHOTO_DATA[genderKey] && PHOTO_DATA[genderKey][m.id]) || [];
}

function photoSrc(photo) {
  return 'data:image/jpeg;base64,' + photo.b64;
}

// ============ Grid render ============
function buildCard(m, i, gender) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.id = m.id;

  const numLabel = (gender === 'female' ? '女性' : '男性') + String(i + 1).padStart(2, '0');
  const savedTab = currentTab;
  currentTab = gender;
  const photos = getPhotos(m);
  currentTab = savedTab;
  const firstPhoto = photos[0];

  card.innerHTML = `
    <div class="card-photo">
      ${firstPhoto
        ? `<img class="card-img" src="${photoSrc(firstPhoto)}" alt="${m.name}" loading="lazy">`
        : '<div class="card-img-empty"></div>'
      }
      <span class="card-no">${numLabel}</span>
      <span class="card-photocount">${photos.length}枚</span>
    </div>
    <div class="card-body">
      <div class="card-name">
        <span class="nm">${m.name}</span>
        <span class="age">${m.age}歳</span>
      </div>
      <div class="card-loc">${m.location}</div>
      <div class="card-stat">
        <span><span class="l">身長</span>${m.height}cm</span>
        ${m.exp != null ? `<span><span class="l">芸歴</span>${m.exp}年</span>` : (gender === 'female' ? `<span><span class="l">芸歴</span>なし</span>` : '')}
      </div>
    </div>
  `;
  card.addEventListener('click', () => {
    currentTab = gender;
    lbList = gender === 'female' ? FEMALES : MALES;
    openLightbox(i);
  });
  return card;
}

function renderAllGrids() {
  const gf = $('#gridFemale');
  const gm = $('#gridMale');
  gf.innerHTML = '';
  gm.innerHTML = '';
  FEMALES.forEach((m, i) => gf.appendChild(buildCard(m, i, 'female')));
  MALES.forEach((m, i)   => gm.appendChild(buildCard(m, i, 'male')));
}

// ============ Lightbox ============
const lb = $('#lb');

function openLightbox(idx) {
  lbList = currentTab === 'female' ? FEMALES : MALES;
  lbIdx = idx;
  lbShot = 0;
  renderLightbox();
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

function renderLightbox() {
  const m = lbList[lbIdx];
  const numLabel = (currentTab === 'female' ? '女性' : '男性') + String(lbIdx + 1).padStart(2, '0');
  const photos = getPhotos(m);
  const photo = photos[lbShot];

  // ---- main image ----
  const main = $('#lbMain');
  main.innerHTML = '';
  if (photo) {
    const img = document.createElement('img');
    img.src = photoSrc(photo);
    img.alt = m.name;
    img.className = lbShot === 0 ? 'lb-img-cover' : 'lb-img-natural';
    main.appendChild(img);
  }

  // ---- thumbnail strip ----
  const strip = $('#lbStrip');
  strip.innerHTML = '';
  photos.forEach((p, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'lb-thumb' + (i === lbShot ? ' active' : '');
    const tImg = document.createElement('img');
    tImg.src = photoSrc(p);
    tImg.alt = String(i + 1).padStart(2, '0');
    thumb.appendChild(tImg);
    const no = document.createElement('span');
    no.className = 'lb-thumb-no';
    no.textContent = String(i + 1).padStart(2, '0');
    thumb.appendChild(no);
    thumb.addEventListener('click', () => { lbShot = i; renderLightbox(); });
    strip.appendChild(thumb);
  });

  // ---- header info ----
  $('#lbId').innerHTML = `<span class="accent">${numLabel}</span>&nbsp;／&nbsp;<strong>${String(lbShot + 1).padStart(2, '0')}</strong> / ${photos.length}枚`;

  // ---- profile ----
  $('#lbName').innerHTML = `${m.name} <span class="age">${m.age}歳</span>`;
  $('#lbLoc').textContent = m.location;
  $('#lbHeight').textContent = m.height;
  $('#lbAge').textContent = m.age;
  $('#lbSize').textContent = m.size;
  $('#lbLocSpec').textContent = m.location;

  // shoe
  const specShoe = $('#specShoe');
  if (m.shoe) { specShoe.style.display = ''; $('#lbShoe').textContent = m.shoe; }
  else { specShoe.style.display = 'none'; }

  // exp
  const specExp = $('#specExp');
  if (currentTab === 'female') {
    specExp.style.display = '';
    $('#lbExp').textContent = m.exp != null ? m.exp + '年' : 'なし';
  } else {
    specExp.style.display = 'none';
  }

  // hair / eye / clothes (male)
  const specHair = $('#specHair');
  const specEye = $('#specEye');
  const specClothes = $('#specClothes');
  if (m.hairColor) { specHair.style.display = ''; $('#lbHair').textContent = m.hairColor; } else { specHair.style.display = 'none'; }
  if (m.eyeColor)  { specEye.style.display = '';  $('#lbEye').textContent = m.eyeColor; }  else { specEye.style.display = 'none'; }
  if (m.clothesSize) { specClothes.style.display = ''; $('#lbClothes').textContent = m.clothesSize + 'サイズ'; } else { specClothes.style.display = 'none'; }

  // 出演可能日
  const avail = AVAILABILITY[m.id] || [];
  const schedSection = $('#lbSchedule');
  if (avail.length) {
    schedSection.style.display = '';
    $('#lbScheduleCards').innerHTML = avail.map(d => `
      <div class="avail-card ${d.ok ? 'avail-ok' : 'avail-ng'}">
        <span class="avail-date">${d.date}</span>
        <span class="avail-badge">${d.ok ? '○' : '✖'}</span>
        <span class="avail-label">${d.ok ? '出演可' : '出演不可'}</span>
      </div>
    `).join('');
  } else {
    schedSection.style.display = 'none';
  }

  // achievements (female only)
  const achSection = $('#lbAchievements');
  if (currentTab === 'female' && m.achievements && m.achievements.length) {
    achSection.style.display = '';
    $('#lbAchTitle').textContent = m.achievementTitle || '実績';
    $('#lbAchList').innerHTML = m.achievements.map(a => `<li>${a}</li>`).join('');
  } else {
    achSection.style.display = 'none';
  }

  // nav buttons
  $('#lbPrev').disabled = lbIdx === 0;
  $('#lbNext').disabled = lbIdx === lbList.length - 1;
}

$('#lbPrev').addEventListener('click', () => {
  if (lbIdx > 0) { lbIdx--; lbShot = 0; renderLightbox(); }
});
$('#lbNext').addEventListener('click', () => {
  if (lbIdx < lbList.length - 1) { lbIdx++; lbShot = 0; renderLightbox(); }
});
$('#lbClose').addEventListener('click', closeLightbox);
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft'  && !$('#lbPrev').disabled) { lbIdx--; lbShot = 0; renderLightbox(); }
  if (e.key === 'ArrowRight' && !$('#lbNext').disabled) { lbIdx++; lbShot = 0; renderLightbox(); }
  if (e.key === 'ArrowUp')   { e.preventDefault(); if (lbShot > 0) { lbShot--; renderLightbox(); } }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const photos = getPhotos(lbList[lbIdx]);
    if (lbShot < photos.length - 1) { lbShot++; renderLightbox(); }
  }
});

// ============ Init ============
renderAllGrids();
