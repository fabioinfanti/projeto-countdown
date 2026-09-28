const intro = document.querySelector('#intro');
const running = document.querySelector('#running');
const finale = document.querySelector('#final');
const logs = document.querySelector('#logs');
const replay = document.querySelector('#replay');
const announcement = document.querySelector('#announcement');
const boot = document.querySelector('#boot');
const bootStart = document.querySelector('#boot-start');
const bootMeter = document.querySelector('.boot-meter');
let bootLoading = false;
let bootFrame;
function startBoot() {
  if (bootLoading || boot.hidden) return;
  bootLoading = true;
  bootStart.hidden = true;
  boot.focus({preventScroll:true});
  announcement.textContent = 'Carregando o sistema do grande dia.';
  const started = performance.now();
  function update(now) {
    const percent = Math.min(100, Math.floor((now - started) / 36));
    document.querySelector('#boot-progress').style.width = percent + '%';
    document.querySelector('#boot-percent').textContent = percent + '%';
    bootMeter.setAttribute('aria-valuenow', String(percent));
    document.querySelector('#boot-status').textContent = percent < 35 ? 'Carregando a nossa história…' : percent < 75 ? 'Conectando dois destinos…' : percent < 100 ? 'Preparando o próximo capítulo…' : 'Tudo pronto.';
    if (now - started < 4100) { bootFrame = requestAnimationFrame(update); return; }
    boot.hidden = true;
    bootLoading = false;
    intro.hidden = false;
    document.body.classList.remove('booting');
    document.querySelector('#start').focus({preventScroll:true});
    announcement.textContent = 'Sistema pronto. Pressione Enter para executar casamento.';
  }
  bootFrame = requestAnimationFrame(update);
}
bootStart.addEventListener('click', startBoot);
let step = -1;
const sequence = [
  ['Preparando cerimônia…', false, 8],
  ['Noivos encontrados: Débora & Luan', false, 24],
  ['Alianças encontradas', false, 40],
  ['Local reservado', false, 56],
  ['Padrinhos convocados', false, 72],
  ['Sanidade dos padrinhos não verificada', true, 86],
  ['Calculando tempo restante…', false, 100]
];
function reset() {
  cancelAnimationFrame(bootFrame);
  bootLoading = false;
  boot.hidden = false;
  bootStart.hidden = false;
  document.body.classList.add('booting');
  document.querySelector('#boot-progress').style.width = '0%';
  document.querySelector('#boot-percent').textContent = '0%';
  document.querySelector('#boot-status').textContent = 'Aguardando seu comando.';
  bootMeter.setAttribute('aria-valuenow', '0');
  step = -1;
  intro.hidden = true; running.hidden = true; finale.hidden = true; replay.hidden = true;
  document.querySelector('#footer-right').hidden = false;
  document.body.classList.remove('playing');
  logs.replaceChildren();
  document.querySelector('#progress').style.width = '0%';
  document.querySelector('#percent').textContent = '0%';
  bootStart.focus();
}
function advance() {
  if (!boot.hidden) { startBoot(); return; }
  if (!finale.hidden) return;
  if (step === -1) {
    intro.hidden = true; running.hidden = false;
    document.body.classList.add('playing');
    running.focus({preventScroll:true});
  }
  step++;
  if (step < sequence.length) {
    const [text, warning, percent] = sequence[step];
    const line = document.createElement('div'); line.className = warning ? 'log warning' : 'log';
    const mark = document.createElement('b'); mark.textContent = warning ? '!' : '✓';
    line.append(mark, document.createTextNode(text)); logs.append(line);
    document.querySelector('#progress').style.width = percent + '%';
    document.querySelector('#percent').textContent = percent + '%';
    document.querySelector('#status').textContent = warning ? 'Aviso não bloqueante. Prosseguindo.' : text;
    announcement.textContent = text;
  } else {
    running.hidden = true; finale.hidden = false;
    announcement.textContent = 'Débora e Luan. 10 dias para o casamento.';
    replay.hidden = false;
  }
}
 document.querySelector('#start').addEventListener('click', advance);
 replay.addEventListener('click', reset);
 running.addEventListener('click', advance);
 document.addEventListener('keydown', event => {
  if (event.repeat) return;
  if (event.key === 'Enter' && event.target.tagName !== 'BUTTON' && event.target.tagName !== 'A') {
    event.preventDefault(); advance();
  }
  if (event.key.toLowerCase() === 'r' && !finale.hidden) reset();
 });
 const fullscreen = document.querySelector('#fullscreen');
 if (!document.fullscreenEnabled) fullscreen.hidden = true;
 fullscreen.addEventListener('click', async () => {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
  catch { announcement.textContent = 'Tela cheia indisponível neste navegador.'; }
 });
 document.addEventListener('fullscreenchange', () => { fullscreen.textContent = document.fullscreenElement ? 'Sair da tela cheia ⛶' : 'Tela cheia ⛶'; });
