const missions = {

  0: {
    day: 'Domingo',
    place: 'Entrada da escola',
    icon: '🏫',
    desc: 'Área de entrada e circulação.'
  },

  1: {
    day: 'Segunda-feira',
    place: 'Entrada da escola',
    icon: '🏫',
    desc: 'Recolha papéis, embalagens e outros resíduos do local.'
  },

  2: {
    day: 'Terça-feira',
    place: 'Área externa',
    icon: '🌳',
    desc: 'Cuide dos espaços ao redor da escola.'
  },

  3: {
    day: 'Quarta-feira',
    place: 'Quadra',
    icon: '⚽',
    desc: 'Deixe a área esportiva limpa e pronta para todos.'
  },

  4: {
    day: 'Quinta-feira',
    place: 'Refeitório',
    icon: '🍽️',
    desc: 'Recolha resíduos e ajude a manter o espaço agradável.'
  },

  5: {
    day: 'Sexta-feira',
    place: 'Horta escolar',
    icon: '🌱',
    desc: 'Proteja o espaço verde e mantenha a horta limpa.'
  },

  6: {
    day: 'Sábado',
    place: 'Área externa',
    icon: '🌳',
    desc: 'Missão especial de cuidado com a escola.'
  }

};


const phrases = [

  'Cada lixo recolhido é um passo para uma escola mais limpa e um planeta mais saudável.',

  'Cuidar do ambiente começa com pequenas atitudes.',

  'O lixo no lugar certo faz toda a diferença.',

  'Uma escola limpa é responsabilidade de todos.',

  'Seu exemplo pode inspirar outras pessoas.',

  'Hoje você cuidou da escola. Amanhã, do planeta.',

  'Pequenas ações feitas juntos geram grandes mudanças.'

];


const locations = [

  ['🏫', 'Entrada da escola', 'Segunda-feira'],

  ['🌳', 'Área externa', 'Terça-feira'],

  ['⚽', 'Quadra', 'Quarta-feira'],

  ['🍽️', 'Refeitório', 'Quinta-feira'],

  ['🌱', 'Horta escolar', 'Sexta-feira']

];


const shopItems = [

  [
    '🎖️',
    'Medalha virtual',
    'Uma medalha especial para seu perfil.',
    100
  ],

  [
    '🎨',
    'Perfil personalizado',
    'Desbloqueie uma personalização.',
    200
  ],

  [
    '👑',
    'Título Guardião',
    'Mostre seu título especial.',
    500
  ],

  [
    '🌎',
    'Planeta Verde',
    'Uma conquista especial do projeto.',
    750
  ],

  [
    '🏅',
    'Super Reciclador',
    'Recompensa para grandes participantes.',
    1000
  ],

  [
    '🌱',
    'Mestre da Natureza',
    'O item mais raro da loja.',
    1500
  ]

];


let state =
  JSON.parse(localStorage.getItem('ecoSchool')) ||
  {
    points: 0,
    collections: 0,
    streak: 0,
    lastDate: null,
    bought: []
  };


const today = new Date();

const day = today.getDay();

const mission = missions[day];

const todayKey = today.toISOString().slice(0, 10);

const already = state.lastDate === todayKey;


function render() {

  document.getElementById('dayTitle').textContent =
    mission.day;

  document.getElementById('placeName').textContent =
    mission.place;

  document.getElementById('placeIcon').textContent =
    mission.icon;

  document.getElementById('placeDescription').textContent =
    mission.desc;


  document.getElementById('points').textContent =
    state.points;

  document.getElementById('pointsTop').textContent =
    state.points + ' ⭐';

  document.getElementById('collections').textContent =
    state.collections;

  document.getElementById('streak').textContent =
    state.streak;


  const level =
    Math.floor(state.points / 250) + 1;


  document.getElementById('level').textContent =
    'Nível ' + level;

  document.getElementById('levelBadge').textContent =
    'Nível ' + level;


  document.getElementById('rankingPoints').textContent =
    state.points + ' ⭐';


  const progress = already ? 100 : 0;


  document.getElementById('progressBar').style.width =
    progress + '%';

  document.getElementById('progressText').textContent =
    progress + '%';


  document.getElementById('collectBtn').disabled =
    already;


  document.getElementById('collectBtn').style.opacity =
    already ? .6 : 1;


  document.getElementById('doneMessage').textContent =
    already
      ? '✅ Missão de hoje já concluída! Volte amanhã para uma nova missão.'
      : '';


  renderLocations();

  renderShop();

  renderAchievements();

}


function renderLocations() {

  document.getElementById('locations').innerHTML =
    locations.map(x => `

      <div class="location">

        <span class="ico">
          ${x[0]}
        </span>

        <b>
          ${x[1]}
        </b>

        <small>
          Missão: ${x[2]}
        </small>

      </div>

    `).join('');

}


function renderShop() {

  document.getElementById('shop').innerHTML =
    shopItems.map((x, i) => {

      const owned =
        state.bought.includes(i);

      return `

        <div class="item">

          <div class="item-icon">
            ${x[0]}
          </div>

          <h3>
            ${x[1]}
          </h3>

          <p>
            ${x[2]}
          </p>

          <b>
            ${x[3]} ⭐
          </b>

          <br>

          <button
            class="buy"
            onclick="buy(${i})"
            ${owned || state.points < x[3] ? 'disabled' : ''}
          >

            ${owned ? '✅ Desbloqueado' : 'Resgatar'}

          </button>

        </div>

      `;

    }).join('');

}


function renderAchievements() {

  const set = (id, ok) => {

    document
      .getElementById(id)
      .classList.toggle('locked', !ok);

  };


  set(
    'achievementFirst',
    state.collections >= 1
  );


  set(
    'achievementThree',
    state.collections >= 3
  );


  set(
    'achievementWeek',
    state.collections >= 5
  );

}


function finishCollection() {

  if (state.lastDate === todayKey) {
    return;
  }


  state.points += 50;

  state.collections++;


  const yesterday =
    new Date();

  yesterday.setDate(
    yesterday.getDate() - 1
  );


  const yKey =
    yesterday.toISOString().slice(0, 10);


  state.streak =
    state.lastDate === yKey
      ? state.streak + 1
      : 1;


  state.lastDate =
    todayKey;


  save();


  document.getElementById(
    'progressBar'
  ).style.width = '100%';


  document.getElementById(
    'progressText'
  ).textContent = '100%';


  document.getElementById(
    'consciousPhrase'
  ).textContent =
    phrases[
      (state.collections - 1) % phrases.length
    ];


  document.getElementById(
    'successModal'
  ).classList.add('show');


  render();

}


function closeModal() {

  document
    .getElementById('successModal')
    .classList.remove('show');

}


function buy(i) {

  const item =
    shopItems[i];


  if (
    state.points < item[3] ||
    state.bought.includes(i)
  ) {

    return;

  }


  state.points -= item[3];

  state.bought.push(i);


  save();

  render();


  alert(
    '🎉 Recompensa desbloqueada: ' +
    item[1] +
    '!'
  );

}


function save() {

  localStorage.setItem(
    'ecoSchool',
    JSON.stringify(state)
  );

}


function scrollToMission() {

  document
    .getElementById('mission')
    .scrollIntoView({
      behavior: 'smooth'
    });

}


render();
