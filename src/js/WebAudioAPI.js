/**
 * Функция для расчёта первых четырёх нечётных гармоник к исходной частоте
 * @param mainFrequency - исходная частота
 * @returns {*[]}
 */
function oddHarmonics(mainFrequency) {
  const oddHarmonics = [];
  let oddHarmonic;
  for (let k = 0; k <= 4; k++) {
    oddHarmonic = mainFrequency * (2 * k + 1);
    oddHarmonics.push(oddHarmonic);
    console.log(oddHarmonic, 'Новая нечётная гармоника');
  }
  console.log(oddHarmonics, 'Массив нечётных гармоник');
  return oddHarmonics;
}

export default async function initAudio(weatherData) {
  const playBtn = document.getElementById('play-btn');
  const stopBtn = document.getElementById('stop-btn');
  const audioContext = new AudioContext();

  const harmonicsList = oddHarmonics(weatherData.temperature_2m);
  console.log(harmonicsList);

  class Oscillator {
    constructor(type, frequency, detune) {
      this.osc = audioContext.createOscillator();
      this.osc.type = type;
      this.osc.frequency.value = frequency;
      this.osc.detune.value = detune;
    }
  }

  const filter = audioContext.createBiquadFilter();
  filter.frequency.value = weatherData.surface_pressure;
  filter.type = 'lowpass';

  const delay = audioContext.createDelay(3.0);
  delay.delayTime.value = 1;

  const feedback = audioContext.createGain();
  feedback.gain.value = 0.2;

  const volume = audioContext.createGain();
  volume.gain.value = 1;

  const osc1 = new Oscillator('sawtooth' ,harmonicsList[0], 0);
  const osc2 = new Oscillator('sawtooth' ,harmonicsList[1], 10);
  const osc3 = new Oscillator('sawtooth' ,harmonicsList[2], 10);
  const osc4 = new Oscillator('sawtooth' ,harmonicsList[3], 10);
  const osc5 = new Oscillator('sawtooth' ,harmonicsList[4], 10);

  console.log(weatherData);

  osc1.osc.connect(filter);
  osc2.osc.connect(filter);
  osc3.osc.connect(filter);
  osc4.osc.connect(filter);
  osc5.osc.connect(filter);

  filter.connect(delay);
  delay.connect(feedback);

  feedback.connect(volume);
  feedback.connect(delay);
  volume.connect(audioContext.destination);

  playBtn.addEventListener('click', () => {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    osc1.osc.start();
    osc2.osc.start();
    osc3.osc.start();
    osc4.osc.start();
    osc5.osc.start();
  });

  stopBtn.addEventListener('click', () => {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    osc1.osc.stop();
    osc2.osc.stop();
    osc3.osc.stop();
    osc4.osc.stop();
    osc5.osc.stop();
  });
}









