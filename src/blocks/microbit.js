// ============================================================
// 마이크로비트 v2 — 메이크코드(MakeCode) 블록 카탈로그 (한국어 UI 캡션 기준, 2026-09 편집기 확인)
// code.js : MakeCode JavaScript(붙여넣기 → 블록 탭 전환 시 자동 변환)
// code.py : MakeCode Python
// ============================================================

export const MAKECODE_COLORS = {
  basic:     { fill: '#1E90FF', dark: '#1673cc', label: '기본' },
  input:     { fill: '#D400D4', dark: '#a800a8', label: '입력' },
  music:     { fill: '#E63022', dark: '#b8261b', label: '음악' },
  led:       { fill: '#5C2D91', dark: '#472270', label: 'LED' },
  radio:     { fill: '#E3008C', dark: '#b30070', label: '라디오' },
  loops:     { fill: '#107C10', dark: '#0c5f0c', label: '반복' },
  logic:     { fill: '#006970', dark: '#004f55', label: '논리' },
  variables: { fill: '#DC143C', dark: '#b01030', label: '변수' },
  math:      { fill: '#9400D3', dark: '#7300a6', label: '계산' },
  pins:      { fill: '#A80000', dark: '#800000', label: '핀' },
  text:      { fill: '#B8860B', dark: '#8f6908', label: '문자열' },
};

const ICONS = [['하트', 'Heart'], ['작은 하트', 'SmallHeart'], ['맞음', 'Yes'], ['틀림', 'No'], ['행복함', 'Happy'], ['슬픔', 'Sad'], ['놀람', 'Surprised'], ['화남', 'Angry'], ['잠듦', 'Asleep'], ['유령', 'Ghost'], ['해골', 'Skull'], ['다이아몬드', 'Diamond'], ['사각형', 'Square'], ['삼각형', 'Triangle'], ['집', 'House'], ['우산', 'Umbrella'], ['오리', 'Duck'], ['토끼', 'Rabbit'], ['거북이', 'Tortoise'], ['나비', 'Butterfly'], ['과녁', 'Target'], ['막대기 사람', 'StickFigure'], ['체스판', 'Chessboard'], ['티셔츠', 'TShirt'], ['가위', 'Scissors']];
const ARROWS = [['북쪽', 'North'], ['북동쪽', 'NorthEast'], ['동쪽', 'East'], ['남동쪽', 'SouthEast'], ['남쪽', 'South'], ['남서쪽', 'SouthWest'], ['서쪽', 'West'], ['북서쪽', 'NorthWest']];
const BUTTONS = [['A', 'A'], ['B', 'B'], ['A+B', 'AB']];
const GESTURES = [['흔들림', 'Shake', 'SHAKE'], ['로고 위쪽', 'LogoUp', 'LOGO_UP'], ['로고 아래쪽', 'LogoDown', 'LOGO_DOWN'], ['스크린 하늘 방향', 'ScreenUp', 'SCREEN_UP'], ['스크린 땅 방향', 'ScreenDown', 'SCREEN_DOWN'], ['왼쪽 기울임', 'TiltLeft', 'TILT_LEFT'], ['오른쪽 기울임', 'TiltRight', 'TILT_RIGHT'], ['자유 낙하', 'FreeFall', 'FREE_FALL'], ['가속도 3g', 'ThreeG', 'THREE_G'], ['가속도 6g', 'SixG', 'SIX_G']];
const DIMS = [['x축', 'X'], ['y축', 'Y'], ['z축', 'Z'], ['크기', 'Strength']];
const NOTES = [['도', 'C', '262'], ['레', 'D', '294'], ['미', 'E', '330'], ['파', 'F', '349'], ['솔', 'G', '392'], ['라', 'A', '440'], ['시', 'B', '494'], ['높은 도', 'C5', '523']];
const BEATS = [['1', 'Whole', 'WHOLE'], ['1/2', 'Half', 'HALF'], ['1/4', 'Quarter', 'QUARTER'], ['1/8', 'Eighth', 'EIGHTH'], ['2', 'Double', 'DOUBLE']];
const PINS = [['P0', 'P0'], ['P1', 'P1'], ['P2', 'P2']];
const CMP = [['=', '==', '=='], ['≠', '!=', '!='], ['<', '<', '<'], ['≤', '<=', '<='], ['>', '>', '>'], ['≥', '>=', '>=']];
const UP = (s) => s.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();

export const MICROBIT_BLOCKS = [
  // ---------------- 기본 ----------------
  { id: 'on_start', cat: 'basic', shape: 'hat', tpl: '시작하면', params: {},
    code: { js: '// 시작하면\n${BODY_FLAT}', py: '# 시작하면\n${BODY_FLAT}' } },
  { id: 'forever', cat: 'basic', shape: 'hat', tpl: '무한반복', params: {},
    code: { js: 'basic.forever(function () {\n${BODY}\n})', py: 'def on_forever():\n${BODY}\nbasic.forever(on_forever)' } },
  { id: 'show_number', cat: 'basic', shape: 'stack', tpl: '숫자 출력 %V', params: { V: { kind: 'value', def: 0 } },
    code: { js: 'basic.showNumber(${V})', py: 'basic.show_number(${V})' } },
  { id: 'show_string', cat: 'basic', shape: 'stack', tpl: '문자열 출력 %S', params: { S: { kind: 'text', def: 'Hello!' } },
    code: { js: 'basic.showString(${S:q})', py: 'basic.show_string(${S:q})' } },
  { id: 'show_icon', cat: 'basic', shape: 'stack', tpl: '아이콘 출력 %I', params: { I: { kind: 'dropdown', options: ICONS, def: 'Heart' } },
    code: { js: 'basic.showIcon(IconNames.${I})', py: (p) => `basic.show_icon(IconNames.${UP(p.I)})` } },
  { id: 'show_arrow', cat: 'basic', shape: 'stack', tpl: '화살표 출력 %A', params: { A: { kind: 'dropdown', options: ARROWS, def: 'North' } },
    code: { js: 'basic.showArrow(ArrowNames.${A})', py: (p) => `basic.show_arrow(ArrowNames.${UP(p.A)})` } },
  { id: 'show_leds', cat: 'basic', shape: 'stack', tpl: 'LED 출력 %GRID', params: { GRID: { kind: 'text', def: '. . # . .|. # # # .|# # # # #|. . # . .|. . # . .' } },
    code: { js: (p) => `basic.showLeds(\`\n    ${p.GRID.split('|').join('\n    ')}\n    \`)`, py: (p) => `basic.show_leds("""\n    ${p.GRID.split('|').join('\n    ')}\n    """)` },
    help: 'GRID: 5줄을 | 로 구분, 켜진 LED는 #, 꺼진 LED는 .' },
  { id: 'clear_screen', cat: 'basic', shape: 'stack', tpl: 'LED 스크린 지우기', params: {}, code: { js: 'basic.clearScreen()', py: 'basic.clear_screen()' } },
  { id: 'pause', cat: 'basic', shape: 'stack', tpl: '일시중지 %MS (ms)', params: { MS: { kind: 'value', def: 100 } },
    code: { js: 'basic.pause(${MS})', py: 'basic.pause(${MS})' } },

  // ---------------- 입력 ----------------
  { id: 'on_button_pressed', cat: 'input', shape: 'hat', tpl: '%B 버튼 누를 때', params: { B: { kind: 'dropdown', options: BUTTONS, def: 'A' } },
    code: { js: 'input.onButtonPressed(Button.${B}, function () {\n${BODY}\n})', py: (p) => `def on_button_pressed_${p.B.toLowerCase()}():\n\${BODY}\ninput.on_button_pressed(Button.${p.B}, on_button_pressed_${p.B.toLowerCase()})` } },
  { id: 'on_gesture', cat: 'input', shape: 'hat', tpl: '%G 감지될 때', params: { G: { kind: 'dropdown', options: GESTURES, def: 'Shake' } },
    code: { js: 'input.onGesture(Gesture.${G}, function () {\n${BODY}\n})', py: (p) => `def on_gesture_${p.G_code.toLowerCase()}():\n\${BODY}\ninput.on_gesture(Gesture.${p.G_code}, on_gesture_${p.G_code.toLowerCase()})` } },
  { id: 'on_logo_event', cat: 'input', shape: 'hat', tpl: '로고 %E 때', params: { E: { kind: 'dropdown', options: [['누를', 'Pressed', 'PRESSED'], ['터치할', 'Touched', 'TOUCHED'], ['놓을', 'Released', 'RELEASED'], ['길게 누를', 'LongPressed', 'LONG_PRESSED']], def: 'Pressed' } },
    code: { js: 'input.onLogoEvent(TouchButtonEvent.${E}, function () {\n${BODY}\n})', py: 'def on_logo_${E_code:lower}():\n${BODY}\ninput.on_logo_event(TouchButtonEvent.${E_code}, on_logo_${E_code:lower})' }, v2: true },
  { id: 'on_sound', cat: 'input', shape: 'hat', tpl: '%S 소리 들릴 때', params: { S: { kind: 'dropdown', options: [['큰', 'Loud', 'LOUD'], ['작은', 'Quiet', 'QUIET']], def: 'Loud' } },
    code: { js: 'input.onSound(DetectedSound.${S}, function () {\n${BODY}\n})', py: 'def on_sound_${S_code:lower}():\n${BODY}\ninput.on_sound(DetectedSound.${S_code}, on_sound_${S_code:lower})' }, v2: true },
  { id: 'on_pin_pressed', cat: 'input', shape: 'hat', tpl: '%P 핀 누를 때', params: { P: { kind: 'dropdown', options: PINS, def: 'P0' } },
    code: { js: 'input.onPinPressed(TouchPin.${P}, function () {\n${BODY}\n})', py: 'def on_pin_pressed_${P:lower}():\n${BODY}\ninput.on_pin_pressed(TouchPin.${P}, on_pin_pressed_${P:lower})' } },
  { id: 'button_is_pressed', cat: 'input', shape: 'boolean', tpl: '%B 버튼 눌림', params: { B: { kind: 'dropdown', options: BUTTONS, def: 'A' } },
    code: { js: 'input.buttonIsPressed(Button.${B})', py: 'input.button_is_pressed(Button.${B})' } },
  { id: 'logo_is_pressed', cat: 'input', shape: 'boolean', tpl: '로고 눌림', params: {}, code: { js: 'input.logoIsPressed()', py: 'input.logo_is_pressed()' }, v2: true },
  { id: 'is_gesture', cat: 'input', shape: 'boolean', tpl: '%G 동작', params: { G: { kind: 'dropdown', options: GESTURES, def: 'Shake' } },
    code: { js: 'input.isGesture(Gesture.${G})', py: 'input.is_gesture(Gesture.${G_code})' } },
  { id: 'acceleration', cat: 'input', shape: 'value', tpl: '가속도센서 %D 값(mg)', params: { D: { kind: 'dropdown', options: DIMS, def: 'X' } },
    code: { js: 'input.acceleration(Dimension.${D})', py: 'input.acceleration(Dimension.${D})' } },
  { id: 'light_level', cat: 'input', shape: 'value', tpl: '빛 밝기', params: {}, code: { js: 'input.lightLevel()', py: 'input.light_level()' }, help: '0~255' },
  { id: 'compass_heading', cat: 'input', shape: 'value', tpl: '나침반 방향 (°)', params: {}, code: { js: 'input.compassHeading()', py: 'input.compass_heading()' } },
  { id: 'temperature', cat: 'input', shape: 'value', tpl: '온도 (°C)', params: {}, code: { js: 'input.temperature()', py: 'input.temperature()' } },
  { id: 'sound_level', cat: 'input', shape: 'value', tpl: '소리 크기', params: {}, code: { js: 'input.soundLevel()', py: 'input.sound_level()' }, v2: true, help: '0~255' },
  { id: 'running_time', cat: 'input', shape: 'value', tpl: '작동시간(ms)', params: {}, code: { js: 'input.runningTime()', py: 'input.running_time()' } },
  { id: 'rotation', cat: 'input', shape: 'value', tpl: '기울기센서 %R 값(°)', params: { R: { kind: 'dropdown', options: [['피치 (앞-뒤)', 'Pitch', 'PITCH'], ['롤 (좌-우)', 'Roll', 'ROLL']], def: 'Pitch' } },
    code: { js: 'input.rotation(Rotation.${R})', py: 'input.rotation(Rotation.${R_code})' } },

  // ---------------- 음악 ----------------
  { id: 'play_tone', cat: 'music', shape: 'stack', tpl: '재생 %N 음을 %BEAT 박자 동안 재생 완료될 때까지',
    params: { N: { kind: 'dropdown', options: NOTES, def: 'C' }, BEAT: { kind: 'dropdown', options: BEATS, def: 'Whole' } },
    code: { js: 'music.play(music.tonePlayable(Note.${N}, music.beat(BeatFraction.${BEAT})), music.PlaybackMode.UntilDone)', py: 'music.play(music.tone_playable(Note.${N}, music.beat(BeatFraction.${BEAT_code})), music.PlaybackMode.UNTIL_DONE)' } },
  { id: 'ring_tone', cat: 'music', shape: 'stack', tpl: '%N (Hz) 소리 내기', params: { N: { kind: 'dropdown', options: NOTES, def: 'C' } },
    code: { js: 'music.ringTone(Note.${N})', py: 'music.ring_tone(${N:code})' } },
  { id: 'rest', cat: 'music', shape: 'stack', tpl: '%BEAT 박자 쉬기', params: { BEAT: { kind: 'dropdown', options: BEATS, def: 'Whole' } },
    code: { js: 'music.rest(music.beat(BeatFraction.${BEAT}))', py: 'music.rest(music.beat(BeatFraction.${BEAT_code}))' } },
  { id: 'play_melody', cat: 'music', shape: 'stack', tpl: '%M 멜로디를 %T (bpm) 템포로 연주', params: { M: { kind: 'text', def: 'C5 B A G F E D C ' }, T: { kind: 'value', def: 120 } },
    code: { js: 'music.play(music.stringPlayable(${M:q}, ${T}), music.PlaybackMode.UntilDone)', py: 'music.play(music.string_playable(${M:q}, ${T}), music.PlaybackMode.UNTIL_DONE)' } },
  { id: 'play_sound_effect', cat: 'music', shape: 'stack', tpl: '%E 재생 완료될 때까지', params: { E: { kind: 'dropdown', options: [['키득키득', 'giggle'], ['행복함', 'happy'], ['안녕', 'hello'], ['신비함', 'mysterious'], ['슬픔', 'sad'], ['미끄러짐', 'slide'], ['날아오름', 'soaring'], ['튀어오름', 'spring'], ['반짝임', 'twinkle'], ['하품', 'yawn']], def: 'happy' } },
    code: { js: 'music.play(music.builtinPlayableSoundEffect(soundExpression.${E}), music.PlaybackMode.UntilDone)', py: 'music.play(music.builtin_playable_sound_effect(soundExpression.${E}), music.PlaybackMode.UNTIL_DONE)' }, v2: true },
  { id: 'set_volume', cat: 'music', shape: 'stack', tpl: '음량을 %V 로 설정', params: { V: { kind: 'value', def: 127 } }, code: { js: 'music.setVolume(${V})', py: 'music.set_volume(${V})' } },
  { id: 'stop_all_sounds', cat: 'music', shape: 'stack', tpl: '모든 소리 끄기', params: {}, code: { js: 'music.stopAllSounds()', py: 'music.stop_all_sounds()' } },
  { id: 'set_tempo', cat: 'music', shape: 'stack', tpl: '템포를 %V bpm 으로 설정', params: { V: { kind: 'value', def: 120 } }, code: { js: 'music.setTempo(${V})', py: 'music.set_tempo(${V})' } },

  // ---------------- LED ----------------
  { id: 'plot', cat: 'led', shape: 'stack', tpl: '켜기 x %X y %Y', params: { X: { kind: 'value', def: 2 }, Y: { kind: 'value', def: 2 } }, code: { js: 'led.plot(${X}, ${Y})', py: 'led.plot(${X}, ${Y})' } },
  { id: 'unplot', cat: 'led', shape: 'stack', tpl: '끄기 x %X y %Y', params: { X: { kind: 'value', def: 2 }, Y: { kind: 'value', def: 2 } }, code: { js: 'led.unplot(${X}, ${Y})', py: 'led.unplot(${X}, ${Y})' } },
  { id: 'toggle', cat: 'led', shape: 'stack', tpl: '반전 x %X y %Y', params: { X: { kind: 'value', def: 2 }, Y: { kind: 'value', def: 2 } }, code: { js: 'led.toggle(${X}, ${Y})', py: 'led.toggle(${X}, ${Y})' } },
  { id: 'point', cat: 'led', shape: 'boolean', tpl: '상태 x %X y %Y', params: { X: { kind: 'value', def: 2 }, Y: { kind: 'value', def: 2 } }, code: { js: 'led.point(${X}, ${Y})', py: 'led.point(${X}, ${Y})' } },
  { id: 'plot_bar_graph', cat: 'led', shape: 'stack', tpl: '그래프 그리기 입력 %V 최대치 %MAX', params: { V: { kind: 'value', def: 0 }, MAX: { kind: 'value', def: 255 } }, code: { js: 'led.plotBarGraph(${V}, ${MAX})', py: 'led.plot_bar_graph(${V}, ${MAX})' } },
  { id: 'set_brightness', cat: 'led', shape: 'stack', tpl: '밝기를 %V 로 설정', params: { V: { kind: 'value', def: 255 } }, code: { js: 'led.setBrightness(${V})', py: 'led.set_brightness(${V})' } },

  // ---------------- 라디오 ----------------
  { id: 'radio_set_group', cat: 'radio', shape: 'stack', tpl: '라디오 그룹을 %G 로 설정', params: { G: { kind: 'value', def: 1 } }, code: { js: 'radio.setGroup(${G})', py: 'radio.set_group(${G})' } },
  { id: 'radio_send_number', cat: 'radio', shape: 'stack', tpl: '라디오 전송:수 %V', params: { V: { kind: 'value', def: 0 } }, code: { js: 'radio.sendNumber(${V})', py: 'radio.send_number(${V})' } },
  { id: 'radio_send_string', cat: 'radio', shape: 'stack', tpl: '라디오 전송:문자열 %S', params: { S: { kind: 'text', def: 'hi' } }, code: { js: 'radio.sendString(${S:q})', py: 'radio.send_string(${S:q})' } },
  { id: 'radio_send_value', cat: 'radio', shape: 'stack', tpl: '라디오 전송:변수,값 %NAME = %V', params: { NAME: { kind: 'text', def: 'name' }, V: { kind: 'value', def: 0 } }, code: { js: 'radio.sendValue(${NAME:q}, ${V})', py: 'radio.send_value(${NAME:q}, ${V})' } },
  { id: 'radio_on_received_number', cat: 'radio', shape: 'hat', tpl: '라디오 숫자 수신시 (receivedNumber)', params: {},
    code: { js: 'radio.onReceivedNumber(function (receivedNumber) {\n${BODY}\n})', py: 'def on_received_number(receivedNumber):\n${BODY}\nradio.on_received_number(on_received_number)' } },
  { id: 'radio_on_received_string', cat: 'radio', shape: 'hat', tpl: '라디오 문자열 수신시 (receivedString)', params: {},
    code: { js: 'radio.onReceivedString(function (receivedString) {\n${BODY}\n})', py: 'def on_received_string(receivedString):\n${BODY}\nradio.on_received_string(on_received_string)' } },
  { id: 'received_number', cat: 'radio', shape: 'value', tpl: 'receivedNumber', params: {}, code: { js: 'receivedNumber', py: 'receivedNumber' } },
  { id: 'received_string', cat: 'radio', shape: 'value', tpl: 'receivedString', params: {}, code: { js: 'receivedString', py: 'receivedString' } },

  // ---------------- 반복 ----------------
  { id: 'repeat', cat: 'loops', shape: 'c', tpl: '%N 번 반복', params: { N: { kind: 'value', def: 4 } },
    code: { js: 'for (let index = 0; index < ${N}; index++) {\n${BODY}\n}', py: 'for index in range(${N}):\n${BODY}' } },
  { id: 'while', cat: 'loops', shape: 'c', tpl: '%COND 인 동안', params: { COND: { kind: 'boolean' } },
    code: { js: 'while (${COND}) {\n${BODY}\n}', py: 'while ${COND}:\n${BODY}' } },
  { id: 'every_interval', cat: 'loops', shape: 'hat', tpl: '%MS ms 마다', params: { MS: { kind: 'value', def: 500 } },
    code: { js: 'loops.everyInterval(${MS}, function () {\n${BODY}\n})', py: 'def on_every_interval():\n${BODY}\nloops.every_interval(${MS}, on_every_interval)' } },

  // ---------------- 논리 ----------------
  { id: 'if', cat: 'logic', shape: 'c', tpl: '만약 %COND 이면', params: { COND: { kind: 'boolean' } },
    code: { js: 'if (${COND}) {\n${BODY}\n}', py: 'if ${COND}:\n${BODY}' } },
  { id: 'if_else', cat: 'logic', shape: 'c_else', tpl: '만약 %COND 이면', tplElse: '아니면', params: { COND: { kind: 'boolean' } },
    code: { js: 'if (${COND}) {\n${BODY}\n} else {\n${ELSE}\n}', py: 'if ${COND}:\n${BODY}\nelse:\n${ELSE}' } },
  { id: 'compare', cat: 'logic', shape: 'boolean', tpl: '%A %OP %B', params: { A: { kind: 'value', def: 0 }, OP: { kind: 'dropdown', options: CMP, def: '==' }, B: { kind: 'value', def: 0 } },
    code: { js: '${A} ${OP:code} ${B}', py: '${A} ${OP:code} ${B}' } },
  { id: 'and_or', cat: 'logic', shape: 'boolean', tpl: '%A %OP %B', params: { A: { kind: 'boolean' }, OP: { kind: 'dropdown', options: [['그리고', 'and', '&&'], ['또는', 'or', '||']], def: 'and' }, B: { kind: 'boolean' } },
    code: { js: '(${A} ${OP:code} ${B})', py: (p) => `(${p.A} ${p.OP} ${p.B})` } },
  { id: 'not', cat: 'logic', shape: 'boolean', tpl: '%A 아님', params: { A: { kind: 'boolean' } }, code: { js: '!(${A})', py: 'not (${A})' } },
  { id: 'true', cat: 'logic', shape: 'boolean', tpl: '참', params: {}, code: { js: 'true', py: 'True' } },

  // ---------------- 변수 ----------------
  { id: 'set_variable', cat: 'variables', shape: 'stack', tpl: '%VAR 에 %V 저장', params: { VAR: { kind: 'variable', def: 'steps' }, V: { kind: 'value', def: 0 } },
    code: { js: '${VAR} = ${V}', py: '${VAR} = ${V}' } },
  { id: 'change_variable', cat: 'variables', shape: 'stack', tpl: '%VAR 값 %V 증가', params: { VAR: { kind: 'variable', def: 'steps' }, V: { kind: 'value', def: 1 } },
    code: { js: '${VAR} += ${V}', py: '${VAR} += ${V}' } },
  { id: 'get_variable', cat: 'variables', shape: 'value', tpl: '%VAR', params: { VAR: { kind: 'variable', def: 'steps' } }, code: { js: '${VAR}', py: '${VAR}' } },

  // ---------------- 계산 ----------------
  { id: 'arith', cat: 'math', shape: 'value', tpl: '%A %OP %B', params: { A: { kind: 'value', def: 0 }, OP: { kind: 'dropdown', options: [['+', '+', '+'], ['-', '-', '-'], ['×', '*', '*'], ['÷', '/', '/']], def: '+' }, B: { kind: 'value', def: 0 } },
    code: { js: '(${A} ${OP:code} ${B})', py: '(${A} ${OP:code} ${B})' } },
  { id: 'random_range', cat: 'math', shape: 'value', tpl: '%A 부터 %B 사이 랜덤', params: { A: { kind: 'value', def: 0 }, B: { kind: 'value', def: 10 } },
    code: { js: 'randint(${A}, ${B})', py: 'randint(${A}, ${B})' } },
  { id: 'remainder', cat: 'math', shape: 'value', tpl: '%A / %B 의 나머지', params: { A: { kind: 'value', def: 0 }, B: { kind: 'value', def: 1 } }, code: { js: '(${A} % ${B})', py: '(${A} % ${B})' } },
  { id: 'map', cat: 'math', shape: 'value', tpl: '비례 변환: %V 을 %A1~%A2 에서 %B1~%B2 범위로 변환', params: { V: { kind: 'value', def: 0 }, A1: { kind: 'value', def: 0 }, A2: { kind: 'value', def: 1023 }, B1: { kind: 'value', def: 0 }, B2: { kind: 'value', def: 4 } },
    code: { js: 'Math.map(${V}, ${A1}, ${A2}, ${B1}, ${B2})', py: 'Math.map(${V}, ${A1}, ${A2}, ${B1}, ${B2})' } },

  // ---------------- 핀 ----------------
  { id: 'digital_write', cat: 'pins', shape: 'stack', tpl: '%P 에 디지털 값 %V 출력', params: { P: { kind: 'dropdown', options: PINS, def: 'P0' }, V: { kind: 'value', def: 1 } },
    code: { js: 'pins.digitalWritePin(DigitalPin.${P}, ${V})', py: 'pins.digital_write_pin(DigitalPin.${P}, ${V})' } },
  { id: 'digital_read', cat: 'pins', shape: 'value', tpl: '%P 의 디지털 입력 값', params: { P: { kind: 'dropdown', options: PINS, def: 'P0' } },
    code: { js: 'pins.digitalReadPin(DigitalPin.${P})', py: 'pins.digital_read_pin(DigitalPin.${P})' } },
  { id: 'analog_read', cat: 'pins', shape: 'value', tpl: '%P 의 아날로그 입력 값', params: { P: { kind: 'dropdown', options: PINS, def: 'P0' } },
    code: { js: 'pins.analogReadPin(AnalogPin.${P})', py: 'pins.analog_read_pin(AnalogPin.${P})' } },
  { id: 'analog_write', cat: 'pins', shape: 'stack', tpl: '%P 에 아날로그 값 %V 출력', params: { P: { kind: 'dropdown', options: PINS, def: 'P0' }, V: { kind: 'value', def: 1023 } },
    code: { js: 'pins.analogWritePin(AnalogPin.${P}, ${V})', py: 'pins.analog_write_pin(AnalogPin.${P}, ${V})' } },
  { id: 'servo_write', cat: 'pins', shape: 'stack', tpl: '%P 에 서보 값 %V 출력', params: { P: { kind: 'dropdown', options: PINS, def: 'P0' }, V: { kind: 'value', def: 90 } },
    code: { js: 'pins.servoWritePin(AnalogPin.${P}, ${V})', py: 'pins.servo_write_pin(AnalogPin.${P}, ${V})' } },
];
