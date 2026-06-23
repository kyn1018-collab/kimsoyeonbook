/**
 * '도둑맞은 김소연' 독서 골든벨 & 게임 - app.js
 * Web Audio API를 이용한 음향 효과 내장 및 인터랙티브 제어
 */

// ==========================================
// 1. SOUND EFFECTS (Web Audio API)
// ==========================================
class SoundEffects {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 타이머 째깍 소리 (낮은 클릭음)
  playTick() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // 타임오버 소리
  playTimeOver() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.8);
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.8);
  }

  // 정답 딩동댕 소리
  playCorrect() {
    this.init();
    const now = this.ctx.currentTime;
    
    // 도(C6, 1046.5Hz) -> 미(E6, 1318.5Hz) -> 솔(G6, 1568.0Hz) 순서로 빠르게 재생
    const notes = [1046.5, 1318.5, 1568.0];
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      
      gain.gain.setValueAtTime(0.15, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.35);
    });
  }

  // 오답 땡 소리
  playWrong() {
    this.init();
    const now = this.ctx.currentTime;
    
    // 불협화음 두 주파수 동시 출력
    const freqs = [220, 225];
    
    freqs.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.6);
    });
  }

  // 골든벨 종소리
  playBell() {
    this.init();
    const now = this.ctx.currentTime;
    
    // 청아하고 맑은 주파수들 중첩 재생 (종소리 시뮬레이션)
    const bellFreqs = [523.25, 783.99, 1046.50, 1318.51, 1568.0];
    
    bellFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      // 약간의 코러스/바이브레이션 효과
      osc.frequency.linearRampToValueAtTime(freq + (idx % 2 === 0 ? 5 : -5), now + 2.0);
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 2.5);
    });
  }
}

const sounds = new SoundEffects();

// ==========================================
// 2. QUIZ DATA DEFINITION
// ==========================================
const quizData = [
  // 1단계: 내용 확인 (도서 내용 및 줄거리) - 5문제
  {
    step: "1단계: 내용 확인 (난이도: 하)",
    type: "MULTIPLE",
    question: "주인공 소연이가 학급에서 가장 자신 있어 하고, 선생님과 친구들에게 늘 칭찬을 받는 소연이만의 장기는 무엇일까요?",
    choices: [
      "운동장에서 달리기하기",
      "종이접기 및 그리기",
      "일기나 독서록 같은 글쓰기",
      "멋지게 피아노 연주하기"
    ],
    answer: "3",
    explanation: "소연이는 글재주가 아주 뛰어나서 글짓기를 하면 늘 선생님과 친구들에게 칭찬을 받는 아이였습니다."
  },
  {
    step: "1단계: 내용 확인 (난이도: 하)",
    type: "OX",
    question: "새로 전학 온 '재이'는 반 친구들의 관심을 끌기 위해 화장품을 가지고 다니며 쉬는 시간마다 화장을 했다.",
    choices: ["O", "X"],
    answer: "O",
    explanation: "재이는 예쁘게 보이고 친구들의 인기를 얻고자 쉬는 시간에 화장을 하였고, 다른 아이들도 이를 부러워하며 따라 했습니다."
  },
  {
    step: "1단계: 내용 확인 (난이도: 하)",
    type: "MULTIPLE",
    question: "소연이는 재이와 은진이가 있는 무리에 어울리기 위해, 평소 싫어하면서도 억지로 따라 했던 행동은 무엇일까요?",
    choices: [
      "친구들의 숙제를 대신 작성해주기",
      "겉모습을 꾸미기 위해 입술에 틴트 바르기",
      "교실 바닥 쓸기 청소를 대신 해주기",
      "매점에서 친구들에게 빵 사다 주기"
    ],
    answer: "2",
    explanation: "소연이는 친구들에게 소외되지 않으려고 억지로 화장을 하거나 눈치를 보는 행동을 하였습니다."
  },
  {
    step: "1단계: 내용 확인 (난이도: 하)",
    type: "OX",
    question: "자신의 글을 베껴 쓴 재이에게 소연이가 다가가 따져 묻자, 재이는 즉시 울면서 자신의 잘못을 고백하고 사과했다.",
    choices: ["O", "X"],
    answer: "X",
    explanation: "재이는 끝까지 자신이 지어낸 글이라며 뻔뻔하게 잡아떼고 소연이의 속을 상하게 만들었습니다."
  },
  {
    step: "1단계: 내용 확인 (난이도: 하)",
    type: "MULTIPLE",
    question: "소연이가 재이 무리에 속하려다 멀리하게 되었지만, 소연이가 외롭고 힘들 때 먼저 다가와 위로하고 우정을 나눈 진짜 단짝 친구의 이름은 무엇일까요?",
    choices: [
      "은진",
      "주희",
      "민서",
      "지민"
    ],
    answer: "2",
    explanation: "주희는 겉모습을 따라 하는 소연이에게 잠시 실망했지만, 소연이가 가장 힘들 때 진심으로 돕는 따뜻한 친구였습니다."
  },

  // 2단계: 스토리 전개 및 갈등 (디테일 확인) - 6문제
  {
    step: "2단계: 미덕 및 공감 (난이도: 중)",
    type: "MULTIPLE",
    question: "재이가 소연이의 진짜 글을 훔쳐 쓸 수 있었던 결정적인 사건은 무엇일까요?",
    choices: [
      "소연이가 일기장을 교실 책상 위에 두고 가버려서",
      "소연이가 재이에게 자신의 글짓기 공책을 빌려주어서",
      "재이가 소연이의 가방을 몰래 열고 공책을 훔쳐서",
      "선생님이 소연이의 공책을 재이에게 심부름으로 주어서"
    ],
    answer: "2",
    explanation: "소연이가 재이에게 보여주거나 빌려준 공책의 글을 재이가 허락 없이 똑같이 베껴 썼습니다."
  },
  {
    step: "2단계: 미덕 및 공감 (난이도: 중)",
    type: "OX",
    question: "재이가 베껴 쓴 글에는 소연이가 겪은 '진짜 가족 경험(할머니 댁 이야기 등)'이 담겨 있어서, 소연이가 더 큰 상처를 받았다.",
    choices: ["O", "X"],
    answer: "O",
    explanation: "단순히 지어낸 이야기가 아니라 소연이 본인의 진짜 추억과 감정이 담긴 글을 도둑맞았기 때문에 상처가 더 깊었습니다."
  },
  {
    step: "2단계: 미덕 및 공감 (난이도: 중)",
    type: "MULTIPLE",
    question: "재이가 늦잠 때문에 지각을 하자, 은진이는 선생님께 재이가 어떤 이유로 늦었다며 거짓말을 해주었나요?",
    choices: [
      "아침에 늦잠을 깊게 자서",
      "등교길에 교통사고가 나서",
      "아침부터 갑자기 몸이 아파서",
      "집 열쇠를 잃어버려서"
    ],
    answer: "3",
    explanation: "아파서 늦었다는 거짓 배려로 상황을 모면하려 하였고, 이는 교실 내 진실에 대한 갈등을 부추기는 불씨가 되었습니다."
  },
  {
    step: "2단계: 미덕 및 공감 (난이도: 중)",
    type: "FILL_BLANK",
    question: "소연이는 결국 용기를 내어 친구들 앞에서 재이의 글 베끼기 행동과 그동안 거짓말에 침묵했던 자신의 실수를 ( ____________________ ) 고백하며 눈물을 흘렸습니다. 빈칸에 들어갈 행동은?",
    choices: [
      "모르는 척하며 핑계 대기",
      "친구 탓으로 모두 돌리기",
      "솔직하게 털어놓고 사과하기"
    ],
    answer: "솔직하게 털어놓고 사과하기",
    explanation: "자신의 부끄러운 실수를 감추지 않고 솔직히 털어놓는 순간, 잃어버렸던 나 자신의 진짜 정직을 찾을 수 있었습니다."
  },
  {
    step: "2단계: 미덕 및 공감 (난이도: 중)",
    type: "OX",
    question: "소연이가 친구들 앞에서 눈물을 흘리며 거짓을 털어놓자, 반 친구들은 소연이를 비웃으며 멀리했다.",
    choices: ["O", "X"],
    answer: "X",
    explanation: "오히려 친구들은 소연이의 고백을 통해 진실을 깨달았고, 소연이의 용기 있는 태도를 비웃지 않고 공감해주었습니다."
  },
  {
    step: "2단계: 미덕 및 공감 (난이도: 중)",
    type: "MULTIPLE",
    question: "교실에서 벌어지는 여러 사건을 겪으며 소연이가 깨달은 '진짜 소중한 나의 가치'는 무엇일까요?",
    choices: [
      "남들보다 비싼 화장품을 가지고 있는 것",
      "거짓말을 해서라도 친구들 무리에 끼어 있는 것",
      "남의 평가나 눈치 대신 나의 참모습과 정직함을 지키는 것",
      "글짓기 대회에서 수단과 방법을 가리지 않고 1등을 하는 것"
    ],
    answer: "3",
    explanation: "겉모습과 거짓 무리보다 내 진짜 가치와 떳떳한 정직이 더욱 단단한 힘을 준다는 것을 배웠습니다."
  },

  // 3단계: 가치 판단 (난이도: 상 - 주관식/토론) - 4문제
  {
    step: "3단계: 가치 판단 (난이도: 상 - 주관식)",
    type: "DISCUSSION",
    question: "만약 여러분이 소연이였다면, 내가 쓴 소중한 일기나 독서록을 친구가 허락 없이 베껴 칭찬을 받는 것을 보았을 때 어떻게 행동했을지 구체적으로 말해 봅시다.",
    choices: [],
    answer: "[생각 나누기 문제]",
    explanation: "화가 나 바로 소리쳤을지, 우정이 깨질까 봐 끙끙 앓았을지 등 주인공 소연이의 복잡한 감정에 몰입해 생각해보는 질문입니다."
  },
  {
    step: "3단계: 가치 판단 (난이도: 상 - 주관식)",
    type: "DISCUSSION",
    question: "지각한 친구를 위해 \"아침에 아팠다\"고 거짓말해 주는 전학생의 행동은 진짜 우정을 위한 '배려'일까요, 아니면 친구를 망치는 '잘못된 거짓말'일까요? 여러분의 의견을 써 봅시다.",
    choices: [],
    answer: "[생각 나누기 문제]",
    explanation: "난처한 상황을 구해준 고마운 행동이라는 의견과, 정직을 어긴 거짓 배려는 신뢰를 해친다는 의견 중 자신의 이유를 설명합니다."
  },
  {
    step: "3단계: 가치 판단 (난이도: 상 - 주관식)",
    type: "DISCUSSION",
    question: "재이 무리에 끼기 위해 눈치 보며 틴트를 바르던 시절의 소연이의 마음과, 모든 진실을 밝힌 후 주희와 단짝이 되어 떡볶이를 먹으러 가는 소연이의 감정은 어떻게 다를지 비교해 보세요.",
    choices: [],
    answer: "[생각 나누기 문제]",
    explanation: "눈치 보며 불안했던 겉치레 우정보다, 솔직하게 마음을 열고 얻은 떳떳하고 편안한 진심의 우정을 대조하여 느껴봅니다."
  },
  {
    step: "3단계: 가치 판단 (난이도: 상 - 주관식)",
    type: "DISCUSSION",
    question: "이 책의 제목이 '도둑맞은 김소연'인 진짜 이유는 무엇일까요? 재이에게 빼앗긴 것이 소연이의 '글' 이외에 또 무엇이 있었을지 생각해 봅시다.",
    choices: [],
    answer: "[생각 나누기 문제]",
    explanation: "단순히 종이에 적힌 글뿐만 아니라, 남의 기준에 맞추느라 빼앗겼던 소연이 고유의 '자아'와 '정직한 진짜 내 모습'을 의미함을 깨닫는 고차원적 질문입니다."
  }
];

// ==========================================
// 3. APPLICATION STATE
// ==========================================
let currentQuizIndex = 0;
let timerDuration = 30; // 기본 30초
let timerTimeLeft = 30;
let timerInterval = null;
let isTimerRunning = false;

// ==========================================
// 4. DOM ELEMENTS
// ==========================================
const elStep = document.getElementById('quiz-step');
const elNum = document.getElementById('quiz-number');
const elQuestion = document.getElementById('quiz-question');
const elChoices = document.getElementById('quiz-choices');
const elAnswerBox = document.getElementById('quiz-answer-box');
const elAnswer = document.getElementById('quiz-answer');
const elExplanation = document.getElementById('quiz-explanation');

const btnPrev = document.getElementById('btn-prev');
const btnReveal = document.getElementById('btn-reveal');
const btnNext = document.getElementById('btn-next');

const elTimerText = document.getElementById('timer-text');
const elTimerProgress = document.getElementById('timer-progress');
const btnTimer30 = document.getElementById('btn-timer-30');
const btnTimer60 = document.getElementById('btn-timer-60');
const btnTimerStart = document.getElementById('btn-timer-start');
const btnTimerPause = document.getElementById('btn-timer-pause');
const btnTimerReset = document.getElementById('btn-timer-reset');

// ==========================================
// 5. INITIALIZATION & ROUTING
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Navigation tabs
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.tab-content');
  
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // 오디오 활성화
      sounds.init();
      
      const target = btn.dataset.target;
      navButtons.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });

  // Load Quiz & Scores
  loadQuiz(0);
  initScores();
  initChanceCards();
  initTimer();
  
  // Quiz Nav Listeners
  btnPrev.addEventListener('click', () => navigateQuiz(-1));
  btnNext.addEventListener('click', () => navigateQuiz(1));
  btnReveal.addEventListener('click', toggleAnswerReveal);
}

// ==========================================
// 6. QUIZ LOGIC
// ==========================================
function loadQuiz(index) {
  if (index < 0 || index >= quizData.length) return;
  currentQuizIndex = index;
  
  const data = quizData[index];
  
  // UI text populate
  elStep.textContent = data.step;
  elNum.textContent = `문제 ${index + 1}/${quizData.length}`;
  elQuestion.textContent = data.question;
  
  // Hide Answer Box
  elAnswerBox.classList.add('hidden');
  btnReveal.innerHTML = `<i class="fa-solid fa-eye"></i> 정답 확인`;
  btnReveal.classList.remove('btn-revealed');

  // Reset Timer to match current preset
  resetTimer();

  // Navigation button states
  btnPrev.disabled = index === 0;
  btnNext.disabled = index === quizData.length - 1;
  
  // Choices rendering based on type
  elChoices.innerHTML = '';
  
  if (data.type === 'OX') {
    const btnO = document.createElement('button');
    btnO.className = 'choice-btn ox-o';
    btnO.innerHTML = '<i class="fa-regular fa-circle"></i>';
    btnO.addEventListener('click', () => selectAnswer('O'));
    
    const btnX = document.createElement('button');
    btnX.className = 'choice-btn ox-x';
    btnX.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    btnX.addEventListener('click', () => selectAnswer('X'));
    
    elChoices.appendChild(btnO);
    elChoices.appendChild(btnX);
  } 
  else if (data.type === 'MULTIPLE') {
    const multipleContainer = document.createElement('div');
    multipleContainer.className = 'quiz-choices-multiple';
    
    data.choices.forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-mult-btn';
      btn.innerHTML = `<span class="num-badge">${idx + 1}</span> ${choice}`;
      btn.addEventListener('click', () => selectAnswer((idx + 1).toString()));
      multipleContainer.appendChild(btn);
    });
    elChoices.appendChild(multipleContainer);
  } 
  else if (data.type === 'FILL_BLANK') {
    const listContainer = document.createElement('div');
    listContainer.className = 'quiz-choices-multiple';
    
    data.choices.forEach((choice) => {
      const btn = document.createElement('button');
      btn.className = 'choice-mult-btn';
      btn.innerHTML = `<span class="num-badge"><i class="fa-solid fa-check"></i></span> ${choice}`;
      btn.addEventListener('click', () => selectAnswer(choice));
      listContainer.appendChild(btn);
    });
    elChoices.appendChild(listContainer);
  } 
  else if (data.type === 'SUBJECTIVE') {
    const hint = document.createElement('p');
    hint.className = 'explanation-text';
    hint.style.fontSize = '1.2rem';
    hint.innerHTML = '<i class="fa-regular fa-lightbulb text-amber"></i> 친구들과 서로 신뢰를 쌓기 위해 필요한 핵심 미덕은 무엇일까요?';
    elChoices.appendChild(hint);
  }
  else if (data.type === 'DISCUSSION') {
    const hint = document.createElement('p');
    hint.className = 'explanation-text';
    hint.style.fontSize = '1.2rem';
    hint.innerHTML = '<i class="fa-solid fa-comments text-amber"></i> 모둠 친구들과 함께 찬성/반대 이유를 적어보고 발표해 봅시다.';
    elChoices.appendChild(hint);
  }
}

function navigateQuiz(direction) {
  sounds.init();
  const nextIndex = currentQuizIndex + direction;
  if (nextIndex >= 0 && nextIndex < quizData.length) {
    loadQuiz(nextIndex);
  }
}

function selectAnswer(val) {
  sounds.init();
  const currentQuiz = quizData[currentQuizIndex];
  
  // Highlight choice
  const buttons = elChoices.querySelectorAll('button');
  buttons.forEach(btn => btn.style.transform = 'scale(1)');
  
  // Show answer check
  if (currentQuiz.type === 'MULTIPLE' || currentQuiz.type === 'OX' || currentQuiz.type === 'FILL_BLANK') {
    let isCorrect = false;
    if (currentQuiz.type === 'MULTIPLE') {
      isCorrect = val === currentQuiz.answer;
    } else {
      isCorrect = val.trim() === currentQuiz.answer.trim();
    }
    
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
    
    // Automatically reveal the answer box
    revealAnswer();
  }
}

function toggleAnswerReveal() {
  sounds.init();
  if (elAnswerBox.classList.contains('hidden')) {
    revealAnswer();
    sounds.playCorrect();
  } else {
    elAnswerBox.classList.add('hidden');
    btnReveal.innerHTML = `<i class="fa-solid fa-eye"></i> 정답 확인`;
    btnReveal.classList.remove('btn-revealed');
  }
}

function revealAnswer() {
  const data = quizData[currentQuizIndex];
  elAnswer.textContent = data.answer;
  elExplanation.textContent = data.explanation;
  elAnswerBox.classList.remove('hidden');
  
  btnReveal.innerHTML = `<i class="fa-solid fa-eye-slash"></i> 정답 숨기기`;
  btnReveal.classList.add('btn-revealed');
}

// ==========================================
// 7. TIMER LOGIC
// ==========================================
function initTimer() {
  // SVG Stroke offset initialization
  // Total circumference is 2 * PI * r = 2 * 3.1415 * 45 ≈ 283
  elTimerProgress.style.strokeDasharray = '283';
  elTimerProgress.style.strokeDashoffset = '0';
  
  btnTimer30.addEventListener('click', () => setTimerPreset(30));
  btnTimer60.addEventListener('click', () => setTimerPreset(60));
  btnTimerStart.addEventListener('click', startTimer);
  btnTimerPause.addEventListener('click', pauseTimer);
  btnTimerReset.addEventListener('click', resetTimer);
}

function setTimerPreset(seconds) {
  sounds.init();
  btnTimer30.classList.remove('active');
  btnTimer60.classList.remove('active');
  
  if (seconds === 30) {
    btnTimer30.classList.add('active');
  } else {
    btnTimer60.classList.add('active');
  }
  
  timerDuration = seconds;
  resetTimer();
}

function startTimer() {
  sounds.init();
  if (isTimerRunning) return;
  
  isTimerRunning = true;
  btnTimerStart.disabled = true;
  btnTimerPause.disabled = false;
  
  timerInterval = setInterval(() => {
    timerTimeLeft--;
    
    // Play tick sound on every second
    if (timerTimeLeft > 0 && timerTimeLeft <= 5) {
      // 5초 이하로 남았을 때 매초 째깍거림 강조
      sounds.playTick();
    } else if (timerTimeLeft > 0) {
      sounds.playTick();
    }
    
    updateTimerUI();
    
    if (timerTimeLeft <= 0) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      sounds.playTimeOver();
      btnTimerStart.disabled = false;
      btnTimerPause.disabled = true;
    }
  }, 1000);
}

function pauseTimer() {
  sounds.init();
  clearInterval(timerInterval);
  isTimerRunning = false;
  btnTimerStart.disabled = false;
  btnTimerPause.disabled = true;
}

function resetTimer() {
  sounds.init();
  clearInterval(timerInterval);
  isTimerRunning = false;
  timerTimeLeft = timerDuration;
  
  btnTimerStart.disabled = false;
  btnTimerPause.disabled = true;
  
  updateTimerUI();
}

function updateTimerUI() {
  elTimerText.textContent = timerTimeLeft;
  
  // Calculate dash offset
  const progressRatio = timerTimeLeft / timerDuration;
  const offset = 283 - (progressRatio * 283);
  elTimerProgress.style.strokeDashoffset = offset;
}

// ==========================================
// 8. CHANCE CARDS LOGIC
// ==========================================
function initChanceCards() {
  const cards = document.querySelectorAll('.chance-card-wrapper');
  
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      sounds.init();
      
      // If reset button clicked, prevent normal flip
      if (e.target.classList.contains('btn-reset-chance')) {
        e.stopPropagation();
        card.classList.remove('flipped');
        sounds.playTick();
        return;
      }
      
      if (!card.classList.contains('flipped')) {
        card.classList.add('flipped');
        sounds.playBell(); // 찬스 사용 벨소리
      }
    });
  });
}

// ==========================================
// 9. SCOREBOARD LOGIC
// ==========================================
function initScores() {
  const teamCards = document.querySelectorAll('.team-score-card');
  const btnResetScores = document.getElementById('btn-reset-scores');
  
  teamCards.forEach(card => {
    const teamNum = card.dataset.team;
    const inputName = card.querySelector('.team-name');
    const displayScore = card.querySelector('.team-score');
    const btnMinus = card.querySelector('.btn-minus');
    const btnPlus = card.querySelector('.btn-plus');
    
    // Load local storage values if available
    const savedName = localStorage.getItem(`team_name_${teamNum}`);
    const savedScore = localStorage.getItem(`team_score_${teamNum}`);
    
    if (savedName) inputName.value = savedName;
    if (savedScore) displayScore.textContent = savedScore;
    
    // Auto save name on input change
    inputName.addEventListener('change', () => {
      localStorage.setItem(`team_name_${teamNum}`, inputName.value);
    });
    
    // Core Score Modification Listeners
    btnMinus.addEventListener('click', () => {
      sounds.init();
      let currentVal = parseInt(displayScore.textContent);
      currentVal = Math.max(0, currentVal - 10); // 0점 이하로 내려가지 않도록 제한 (초등용)
      displayScore.textContent = currentVal;
      localStorage.setItem(`team_score_${teamNum}`, currentVal);
      animateScoreChange(displayScore);
      sounds.playWrong();
    });
    
    btnPlus.addEventListener('click', () => {
      sounds.init();
      let currentVal = parseInt(displayScore.textContent);
      currentVal += 10;
      displayScore.textContent = currentVal;
      localStorage.setItem(`team_score_${teamNum}`, currentVal);
      animateScoreChange(displayScore);
      sounds.playCorrect();
    });
  });
  
  // Score reset event listener
  btnResetScores.addEventListener('click', () => {
    sounds.init();
    if (confirm("정말 모든 모둠의 점수를 0점으로 초기화하시겠습니까?")) {
      teamCards.forEach(card => {
        const teamNum = card.dataset.team;
        const displayScore = card.querySelector('.team-score');
        displayScore.textContent = "0";
        localStorage.setItem(`team_score_${teamNum}`, "0");
      });
      sounds.playWrong();
    }
  });
}

function animateScoreChange(element) {
  element.classList.add('score-changed');
  setTimeout(() => {
    element.classList.remove('score-changed');
  }, 200);
}
