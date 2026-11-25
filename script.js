const audio = document.getElementById('audio');
const musicButton = document.getElementById('musicButton');
const musicLabel = document.getElementById('musicLabel');

musicButton.addEventListener('click', async () => {
  if (audio.paused) {
    try {
      await audio.play();
      musicButton.classList.add('playing');
      musicLabel.textContent = 'pause our song';
    } catch (_) {}
  } else {
    audio.pause();
    musicButton.classList.remove('playing');
    musicLabel.textContent = 'play our song';
  }
});

const dialog = document.getElementById('letterDialog');
document.getElementById('loveButton').addEventListener('click', () => dialog.showModal());
document.getElementById('closeLetter').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

const lockScreen = document.getElementById('lockScreen');
const keypad = document.getElementById('keypad');
const dots = [...document.querySelectorAll('.passcode-dots span')];
const passcodeDots = document.getElementById('passcodeDots');
const lockError = document.getElementById('lockError');
let enteredCode = '';

function updateDots() {
  dots.forEach((dot, index) => dot.classList.toggle('filled', index < enteredCode.length));
}

const passcodeCard = document.getElementById('passcodeCard');
const proposalCard = document.getElementById('proposalCard');
const noCard = document.getElementById('noCard');
const secondScreen = document.getElementById('secondScreen');

function unlockPage() {
  passcodeCard.style.display = 'none';
  lockScreen.style.background = '#fffaf7';
  secondScreen.classList.add('active');
  secondScreen.setAttribute('aria-hidden', 'false');
  proposalCard.classList.add('active');
}

keypad.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-digit]');
  if (!button || enteredCode.length >= 4) return;

  enteredCode += button.dataset.digit;
  lockError.textContent = '';
  updateDots();

  if (enteredCode.length === 4) {
    if (enteredCode === '0429') {
      setTimeout(unlockPage, 250);
    } else {
      lockError.textContent = 'Not quite — try our special code';
      passcodeDots.classList.remove('shake');
      void passcodeDots.offsetWidth;
      passcodeDots.classList.add('shake');
      setTimeout(() => {
        enteredCode = '';
        updateDots();
      }, 500);
    }
  }
});

document.getElementById('deleteDigit').addEventListener('click', () => {
  enteredCode = enteredCode.slice(0, -1);
  lockError.textContent = '';
  updateDots();
});

document.addEventListener('keydown', (event) => {
  if (!lockScreen.isConnected) return;
  if (/^[0-9]$/.test(event.key)) {
    const digitButton = keypad.querySelector(`[data-digit="${event.key}"]`);
    digitButton?.click();
  } else if (event.key === 'Backspace') {
    document.getElementById('deleteDigit').click();
  }
});

document.getElementById('yesButton').addEventListener('click', () => {
  lockScreen.classList.add('unlocked');
  document.body.classList.remove('locked');
  setTimeout(() => lockScreen.remove(), 600);
});

document.getElementById('noButton').addEventListener('click', () => {
  proposalCard.classList.remove('active');
  noCard.classList.add('active');
});

document.getElementById('tryAgainButton').addEventListener('click', () => {
  noCard.classList.remove('active');
  proposalCard.classList.add('active');
});

document.body.classList.add('locked');

['years', 'months', 'days'].forEach((id) => {
  const element = document.getElementById(id);
  if (element) element.textContent = '';
});
