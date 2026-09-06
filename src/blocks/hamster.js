// ============================================================
// 햄스터 / 햄스터S 엔트리 하드웨어 블록 카탈로그
// 출처: entrylabs/entryjs develop — block_hamster.js, block_hamster_s.js (ko.template 그대로)
// code.entryPy : 엔트리 파이썬 문법(블록 syntax.py 그대로)
// code.py      : roboid 파이썬(pip install roboid) 문법
// ============================================================

const LR = [['왼쪽', 'LEFT'], ['오른쪽', 'RIGHT']];
const LRB = [['왼쪽', 'LEFT'], ['오른쪽', 'RIGHT'], ['양쪽', 'BOTH']];
const NOTES = [['도', 'C'], ['도♯(레♭)', 'C#'], ['레', 'D'], ['레♯(미♭)', 'D#'], ['미', 'E'], ['파', 'F'], ['파♯(솔♭)', 'F#'], ['솔', 'G'], ['솔♯(라♭)', 'G#'], ['라', 'A'], ['라♯(시♭)', 'A#'], ['시', 'B']];
const OCT = ['1', '2', '3', '4', '5', '6', '7'].map((o) => [o, o]);
const NOTE_PY = { C: 'c', 'C#': 'c_sharp', D: 'd', 'D#': 'd_sharp', E: 'e', F: 'f', 'F#': 'f_sharp', G: 'g', 'G#': 'g_sharp', A: 'a', 'A#': 'a_sharp', B: 'b' };

const SENSORS = [['왼쪽 근접 센서', 'leftProximity', 'left_proximity'], ['오른쪽 근접 센서', 'rightProximity', 'right_proximity'], ['왼쪽 바닥 센서', 'leftFloor', 'left_floor'], ['오른쪽 바닥 센서', 'rightFloor', 'right_floor'], ['x축 가속도', 'accelerationX', 'acceleration_x'], ['y축 가속도', 'accelerationY', 'acceleration_y'], ['z축 가속도', 'accelerationZ', 'acceleration_z'], ['밝기', 'light', 'light'], ['온도', 'temperature', 'temperature'], ['신호 세기', 'signalStrength', 'signal_strength'], ['입력 A', 'inputA', 'input_a'], ['입력 B', 'inputB', 'input_b']];
const TILTS = [['앞으로 기울임', 'TILT_FORWARD', 'tilt() == Hamster.TILT_FORWARD'], ['뒤로 기울임', 'TILT_BACKWARD', 'tilt() == Hamster.TILT_BACKWARD'], ['왼쪽으로 기울임', 'TILT_LEFT', 'tilt() == Hamster.TILT_LEFT'], ['오른쪽으로 기울임', 'TILT_RIGHT', 'tilt() == Hamster.TILT_RIGHT'], ['거꾸로 뒤집음', 'TILT_FLIP', 'tilt() == Hamster.TILT_FLIP'], ['기울이지 않음', 'TILT_NOT', 'tilt() == Hamster.TILT_NOT'], ['배터리 정상', 'BATTERY_NORMAL', 'battery_state() == Hamster.BATTERY_NORMAL'], ['배터리 부족', 'BATTERY_LOW', 'battery_state() == Hamster.BATTERY_LOW'], ['배터리 없음', 'BATTERY_EMPTY', 'battery_state() == Hamster.BATTERY_EMPTY']];
const COLORS = [['빨간색', '4', 'red', 'set_led_red'], ['노란색', '6', 'yellow', 'set_led_yellow'], ['초록색', '2', 'green', 'set_led_green'], ['하늘색', '3', 'sky_blue', 'set_led_sky_blue'], ['파란색', '1', 'blue', 'set_led_blue'], ['자주색', '5', 'purple', 'set_led_purple'], ['하얀색', '7', 'white', 'set_led_white']];
const COLORS_S = [['빨간색', 'RED', 'red'], ['주황색', 'ORANGE', 'orange'], ['노란색', 'YELLOW', 'yellow'], ['초록색', 'GREEN', 'green'], ['하늘색', 'SKY_BLUE', 'sky_blue'], ['파란색', 'BLUE', 'blue'], ['보라색', 'VIOLET', 'violet'], ['자주색', 'PURPLE', 'purple'], ['하얀색', 'WHITE', 'white']];
const SOUNDS_S = [['삐', 'BEEP', 'beep'], ['무작위 삐', 'RANDOM_BEEP', 'random beep'], ['지지직', 'NOISE', 'noise'], ['사이렌', 'SIREN', 'siren'], ['엔진', 'ENGINE', 'engine'], ['쩝', 'CHOP', 'chop'], ['로봇', 'ROBOT', 'robot'], ['디비디비딥', 'DIBIDIBIDIP', 'dibidibidip'], ['잘 했어요', 'GOOD_JOB', 'good job'], ['행복', 'HAPPY', 'happy'], ['화남', 'ANGRY', 'angry'], ['슬픔', 'SAD', 'sad'], ['졸림', 'SLEEP', 'sleep'], ['행진', 'MARCH', 'march'], ['생일', 'BIRTHDAY', 'birthday']];
const LINE_MODE = { BLACK: { LEFT: 'line_left', RIGHT: 'line_right', BOTH: 'line_both' }, WHITE: { LEFT: 'white_line_left', RIGHT: 'white_line_right', BOTH: 'white_line_both' } };
const CROSS_MODE = { BLACK: { LEFT: 'cross_left', RIGHT: 'cross_right', FRONT: 'cross_forward', REAR: 'cross_uturn' }, WHITE: { LEFT: 'white_cross_left', RIGHT: 'white_cross_right', FRONT: 'white_cross_forward', REAR: 'white_cross_uturn' } };

function ledPy(p, robot) { // roboid: leds / left_led / right_led
  const c = `"${p.COLOR_code}"`;
  if (p.SIDE === 'BOTH') return `${robot}.leds(${c})`;
  return p.SIDE === 'LEFT' ? `${robot}.left_led(${c})` : `${robot}.right_led(${c})`;
}

function build(variant) {
  const S = variant === 'S';
  const P = S ? 'hamster_s_' : 'hamster_';   // block id prefix
  const E = S ? 'HamsterS' : 'Hamster';       // 엔트리 파이썬 클래스
  const R = 'hamster';                         // roboid 변수명
  const blocks = [];
  const add = (b) => blocks.push({ cat: 'hardware', hw: true, ...b, id: P + b.id });

  // ---- 센서 ----
  add({ id: 'hand_found', shape: 'boolean', tpl: '손 찾음?', params: {}, group: '센서',
    code: { entryPy: `${E}.hand_found()`, py: `${R}.hand_found()` } });
  add({ id: 'boolean', shape: 'boolean', tpl: '%B?', group: '센서',
    params: { B: { kind: 'dropdown', options: TILTS.concat(S ? [['두드림', 'TAP', 'tap()'], ['자유 낙하', 'FREE_FALL', 'free_fall()']] : []), def: 'TILT_FORWARD' } },
    code: { entryPy: `${E}.boolean_value("\${B}")`, py: `(${R}.\${B:code})` } });
  add({ id: 'value', shape: 'value', tpl: '%V', group: '센서',
    params: { V: { kind: 'dropdown', options: SENSORS.concat(S ? [['시리얼 입력', 'SERIAL_INPUT', 'read_serial()']] : []), def: 'leftProximity' } },
    code: { entryPy: `${E}.sensor_value("\${V}")`, py: `${R}.\${V:code}()` },
    help: '근접 센서 0~255, 바닥 센서 0~100, 밝기 0~65535, 온도 ℃' });

  // ---- 말판 ----
  add({ id: 'move_forward_once', shape: 'stack', tpl: '말판 앞으로 한 칸 이동하기', params: {}, group: '말판',
    code: { entryPy: `${E}.board_forward()`, py: `${R}.board_forward()` } });
  add({ id: 'turn_once', shape: 'stack', tpl: '말판 %DIR 으로 한 번 돌기', group: '말판',
    params: { DIR: { kind: 'dropdown', options: LR, def: 'LEFT' } },
    code: { entryPy: `${E}.board_turn("\${DIR}")`, py: (p) => (p.DIR === 'LEFT' ? `${R}.board_left()` : `${R}.board_right()`) } });

  // ---- 바퀴 ----
  if (!S) {
    add({ id: 'move_forward_for_secs', shape: 'stack', tpl: '앞으로 %SEC 초 이동하기', group: '바퀴',
      params: { SEC: { kind: 'value', def: 1 } }, code: { entryPy: `${E}.move_forward(\${SEC})`, py: `${R}.move_forward(\${SEC})` } });
    add({ id: 'move_backward_for_secs', shape: 'stack', tpl: '뒤로 %SEC 초 이동하기', group: '바퀴',
      params: { SEC: { kind: 'value', def: 1 } }, code: { entryPy: `${E}.move_backward(\${SEC})`, py: `${R}.move_backward(\${SEC})` } });
    add({ id: 'turn_for_secs', shape: 'stack', tpl: '%DIR 으로 %SEC 초 돌기', group: '바퀴',
      params: { DIR: { kind: 'dropdown', options: LR, def: 'LEFT' }, SEC: { kind: 'value', def: 1 } },
      code: { entryPy: `${E}.turn("\${DIR}", \${SEC})`, py: (p) => (p.DIR === 'LEFT' ? `${R}.turn_left(${p.SEC})` : `${R}.turn_right(${p.SEC})`) } });
  } else {
    const UNIT = [['cm', 'CM'], ['초', 'SEC'], ['펄스', 'PULSE']];
    const mv = (dir, p) => {
      const fn = dir === 'F' ? 'move_forward' : 'move_backward';
      if (p.UNIT === 'CM') return `${R}.${fn}(${p.V})`;
      if (p.UNIT === 'SEC') return `${R}.${fn}_sec(${p.V})`;
      return `${R}.${fn}_pulse(${p.V})`;
    };
    add({ id: 'move_forward_unit', shape: 'stack', tpl: '앞으로 %V %UNIT 이동하기', group: '바퀴',
      params: { V: { kind: 'value', def: 5 }, UNIT: { kind: 'dropdown', options: UNIT, def: 'CM' } },
      code: { entryPy: `${E}.move_forward(\${V}, "\${UNIT}")`, py: (p) => mv('F', p) } });
    add({ id: 'move_backward_unit', shape: 'stack', tpl: '뒤로 %V %UNIT 이동하기', group: '바퀴',
      params: { V: { kind: 'value', def: 5 }, UNIT: { kind: 'dropdown', options: UNIT, def: 'CM' } },
      code: { entryPy: `${E}.move_backward(\${V}, "\${UNIT}")`, py: (p) => mv('B', p) } });
    add({ id: 'turn_unit_in_place', shape: 'stack', tpl: '%DIR 으로 %V %UNIT 제자리 돌기', group: '바퀴',
      params: { DIR: { kind: 'dropdown', options: LR, def: 'LEFT' }, V: { kind: 'value', def: 90 }, UNIT: { kind: 'dropdown', options: [['도', 'DEG'], ['초', 'SEC'], ['펄스', 'PULSE']], def: 'DEG' } },
      code: { entryPy: `${E}.turn("\${DIR}", \${V}, "\${UNIT}")`, py: (p) => { const fn = p.DIR === 'LEFT' ? 'turn_left' : 'turn_right'; return p.UNIT === 'DEG' ? `${R}.${fn}(${p.V})` : p.UNIT === 'SEC' ? `${R}.${fn}_sec(${p.V})` : `${R}.${fn}_pulse(${p.V})`; } } });
  }
  add({ id: 'change_both_wheels_by', shape: 'stack', tpl: '왼쪽 바퀴 %L 오른쪽 바퀴 %R 만큼 바꾸기', group: '바퀴',
    params: { L: { kind: 'value', def: 10 }, R: { kind: 'value', def: 10 } },
    code: { entryPy: `${E}.add_wheels(\${L}, \${R})`, py: `# 바퀴 속도를 현재 값에서 (\${L}, \${R})만큼 변경\nleft_speed += \${L}; right_speed += \${R}\n${R}.wheels(left_speed, right_speed)` } });
  add({ id: 'set_both_wheels_to', shape: 'stack', tpl: '왼쪽 바퀴 %L 오른쪽 바퀴 %R (으)로 정하기', group: '바퀴',
    params: { L: { kind: 'value', def: 30 }, R: { kind: 'value', def: 30 } },
    code: { entryPy: `${E}.set_wheels(\${L}, \${R})`, py: `${R}.wheels(\${L}, \${R})` }, help: '속도 범위 -100 ~ 100 (%)' });
  add({ id: 'change_wheel_by', shape: 'stack', tpl: '%SIDE 바퀴 %V 만큼 바꾸기', group: '바퀴',
    params: { SIDE: { kind: 'dropdown', options: LRB, def: 'LEFT' }, V: { kind: 'value', def: 10 } },
    code: { entryPy: `${E}.add_wheel("\${SIDE}", \${V})`, py: (p) => (p.SIDE === 'BOTH' ? `left_speed += ${p.V}; right_speed += ${p.V}; ${R}.wheels(left_speed, right_speed)` : p.SIDE === 'LEFT' ? `left_speed += ${p.V}; ${R}.left_wheel(left_speed)` : `right_speed += ${p.V}; ${R}.right_wheel(right_speed)`) } });
  add({ id: 'set_wheel_to', shape: 'stack', tpl: '%SIDE 바퀴 %V (으)로 정하기', group: '바퀴',
    params: { SIDE: { kind: 'dropdown', options: LRB, def: 'LEFT' }, V: { kind: 'value', def: 30 } },
    code: { entryPy: `${E}.set_wheel("\${SIDE}", \${V})`, py: (p) => (p.SIDE === 'BOTH' ? `${R}.wheels(${p.V})` : p.SIDE === 'LEFT' ? `${R}.left_wheel(${p.V})` : `${R}.right_wheel(${p.V})`) } });
  add({ id: 'follow_line_using', shape: 'stack', tpl: '%COLOR 선을 %SIDE 바닥 센서로 따라가기', group: '바퀴',
    params: { COLOR: { kind: 'dropdown', options: [['검은색', 'BLACK'], ['하얀색', 'WHITE']], def: 'BLACK' }, SIDE: { kind: 'dropdown', options: LRB, def: 'LEFT' } },
    code: { entryPy: `${E}.follow_line("\${COLOR}", "\${SIDE}")`, py: (p) => `${R}.${LINE_MODE[p.COLOR][p.SIDE]}()` } });
  add({ id: 'follow_line_until', shape: 'stack', tpl: '%COLOR 선을 따라 %DIR 교차로까지 이동하기', group: '바퀴',
    params: { COLOR: { kind: 'dropdown', options: [['검은색', 'BLACK'], ['하얀색', 'WHITE']], def: 'BLACK' }, DIR: { kind: 'dropdown', options: [['왼쪽', 'LEFT'], ['오른쪽', 'RIGHT'], ['앞쪽', 'FRONT'], ['뒤쪽', 'REAR']], def: 'FRONT' } },
    code: { entryPy: `${E}.follow_line_until("\${COLOR}", "\${DIR}")`, py: (p) => `${R}.${CROSS_MODE[p.COLOR][p.DIR]}()` } });
  add({ id: 'set_following_speed_to', shape: 'stack', tpl: '선 따라가기 속도를 %V (으)로 정하기', group: '바퀴',
    params: { V: { kind: 'dropdown', options: ['1', '2', '3', '4', '5', '6', '7', '8'].map((v) => [v, v]), def: '1' } },
    code: { entryPy: `${E}.set_line_speed(\${V})`, py: `${R}.line_speed(\${V})` } });
  add({ id: 'stop', shape: 'stack', tpl: '정지하기', params: {}, group: '바퀴',
    code: { entryPy: `${E}.stop()`, py: `${R}.stop()` } });

  // ---- LED ----
  if (!S) {
    add({ id: 'set_led_to', shape: 'stack', tpl: '%SIDE LED를 %COLOR 으로 정하기', group: 'LED',
      params: { SIDE: { kind: 'dropdown', options: LRB, def: 'LEFT' }, COLOR: { kind: 'dropdown', options: COLORS, def: '4' } },
      code: { entryPy: (p) => `${E}.${COLORS.find((c) => c[1] === p.COLOR)?.[3] || 'set_led_red'}("${p.SIDE}")`, py: (p) => ledPy(p, R) } });
  } else {
    add({ id: 'set_led_to', shape: 'stack', tpl: '%SIDE LED를 %COLOR 으로 정하기', group: 'LED',
      params: { SIDE: { kind: 'dropdown', options: LRB, def: 'LEFT' }, COLOR: { kind: 'dropdown', options: COLORS_S, def: 'RED' } },
      code: { entryPy: `${E}.set_led("\${SIDE}", "\${COLOR}")`, py: (p) => ledPy(p, R) } });
    add({ id: 'set_led_to_rgb', shape: 'stack', tpl: '%SIDE LED를 R: %R G: %G B: %B (으)로 정하기', group: 'LED',
      params: { SIDE: { kind: 'dropdown', options: LRB, def: 'LEFT' }, R: { kind: 'value', def: 255 }, G: { kind: 'value', def: 0 }, B: { kind: 'value', def: 0 } },
      code: { entryPy: `${E}.set_rgb("\${SIDE}", \${R}, \${G}, \${B})`, py: (p) => (p.SIDE === 'BOTH' ? `${R}.rgbs(${p.R}, ${p.G}, ${p.B})` : p.SIDE === 'LEFT' ? `${R}.left_rgb(${p.R}, ${p.G}, ${p.B})` : `${R}.right_rgb(${p.R}, ${p.G}, ${p.B})`) } });
  }
  add({ id: 'clear_led', shape: 'stack', tpl: '%SIDE LED 끄기', group: 'LED',
    params: { SIDE: { kind: 'dropdown', options: LRB, def: 'LEFT' } },
    code: { entryPy: `${E}.clear_led("\${SIDE}")`, py: (p) => (p.SIDE === 'BOTH' ? `${R}.leds("off")` : p.SIDE === 'LEFT' ? `${R}.left_led("off")` : `${R}.right_led("off")`) } });

  // ---- 소리 ----
  if (!S) {
    add({ id: 'beep', shape: 'stack', tpl: '삐 소리내기', params: {}, group: '소리', code: { entryPy: `${E}.beep()`, py: `${R}.beep()` } });
  } else {
    add({ id: 'play_sound_times', shape: 'stack', tpl: '%SND 소리 %N 번 재생하기', group: '소리',
      params: { SND: { kind: 'dropdown', options: SOUNDS_S, def: 'BEEP' }, N: { kind: 'value', def: 1 } },
      code: { entryPy: `${E}.play_sound("\${SND}", \${N})`, py: `${R}.sound("\${SND:code}", \${N})` } });
    add({ id: 'play_sound_times_until_done', shape: 'stack', tpl: '%SND 소리 %N 번 재생하고 기다리기', group: '소리',
      params: { SND: { kind: 'dropdown', options: SOUNDS_S, def: 'BEEP' }, N: { kind: 'value', def: 1 } },
      code: { entryPy: `${E}.play_sound_until_done("\${SND}", \${N})`, py: `${R}.sound_until_done("\${SND:code}", \${N})` } });
  }
  add({ id: 'change_buzzer_by', shape: 'stack', tpl: '버저 음을 %V 만큼 바꾸기', group: '소리',
    params: { V: { kind: 'value', def: 10 } }, code: { entryPy: `${E}.add_buzzer(\${V})`, py: `buzzer_hz += \${V}; ${R}.buzzer(buzzer_hz)` } });
  add({ id: 'set_buzzer_to', shape: 'stack', tpl: '버저 음을 %V (으)로 정하기', group: '소리',
    params: { V: { kind: 'value', def: 1000 } }, code: { entryPy: `${E}.set_buzzer(\${V})`, py: `${R}.buzzer(\${V})` }, help: '단위 Hz, 0이면 끄기' });
  if (!S) add({ id: 'clear_buzzer', shape: 'stack', tpl: '버저 끄기', params: {}, group: '소리', code: { entryPy: `${E}.clear_buzzer()`, py: `${R}.buzzer(0)` } });
  else add({ id: 'clear_sound', shape: 'stack', tpl: '소리 끄기', params: {}, group: '소리', code: { entryPy: `${E}.clear_sound()`, py: `${R}.buzzer(0)` } });
  add({ id: 'play_note', shape: 'stack', tpl: '%NOTE %OCT 음을 연주하기', group: '소리',
    params: { NOTE: { kind: 'dropdown', options: NOTES, def: 'C' }, OCT: { kind: 'dropdown', options: OCT, def: '4' } },
    code: { entryPy: (p) => (S ? `${E}.play_pitch("${p.NOTE}", ${p.OCT})` : `${E}.play_pitch_${NOTE_PY[p.NOTE]}(${p.OCT})`), py: `${R}.note("\${NOTE}\${OCT}")` } });
  add({ id: 'play_note_for', shape: 'stack', tpl: '%NOTE %OCT 음을 %BEAT 박자 연주하기', group: '소리',
    params: { NOTE: { kind: 'dropdown', options: NOTES, def: 'C' }, OCT: { kind: 'dropdown', options: OCT, def: '4' }, BEAT: { kind: 'value', def: 0.5 } },
    code: { entryPy: (p) => (S ? `${E}.play_note("${p.NOTE}", ${p.OCT}, ${p.BEAT})` : `${E}.play_note_${NOTE_PY[p.NOTE]}(${p.OCT}, ${p.BEAT})`), py: `${R}.note("\${NOTE}\${OCT}", \${BEAT})` } });
  add({ id: 'rest_for', shape: 'stack', tpl: '%BEAT 박자 쉬기', group: '소리',
    params: { BEAT: { kind: 'value', def: 0.25 } }, code: { entryPy: `${E}.rest(\${BEAT})`, py: `${R}.note("off", \${BEAT})` } });
  add({ id: 'change_tempo_by', shape: 'stack', tpl: '연주 속도를 %V 만큼 바꾸기', group: '소리',
    params: { V: { kind: 'value', def: 20 } }, code: { entryPy: `${E}.add_tempo(\${V})`, py: `tempo_bpm += \${V}; ${R}.tempo(tempo_bpm)` } });
  add({ id: 'set_tempo_to', shape: 'stack', tpl: '연주 속도를 %V BPM으로 정하기', group: '소리',
    params: { V: { kind: 'value', def: 60 } }, code: { entryPy: `${E}.set_tempo(\${V})`, py: `${R}.tempo(\${V})` } });

  // ---- 포트/집게 ----
  const PORTS = [['A', 'A'], ['B', 'B'], ['A와 B', 'AB']];
  const MODES = (S ? [['아날로그 입력', 'ANALOG_INPUT', 'analog input'], ['디지털 입력', 'DIGITAL_INPUT', 'digital input'], ['서보 출력', 'SERVO_OUTPUT', 'servo output'], ['PWM 출력', 'PWM_OUTPUT', 'pwm output'], ['디지털 출력', 'DIGITAL_OUTPUT', 'digital output']]
    : [['아날로그 입력', '0', 'analog input', 'set_io_mode_analog_input'], ['디지털 입력', '1', 'digital input', 'set_io_mode_digital_input'], ['서보 출력', '8', 'servo output', 'set_io_mode_servo_output'], ['PWM 출력', '9', 'pwm output', 'set_io_mode_pwm_output'], ['디지털 출력', '10', 'digital output', 'set_io_mode_digital_output']]);
  add({ id: 'set_port_to', shape: 'stack', tpl: '포트 %PORT 를 %MODE 으로 정하기', group: '포트',
    params: { PORT: { kind: 'dropdown', options: PORTS, def: 'A' }, MODE: { kind: 'dropdown', options: MODES, def: MODES[0][1] } },
    code: { entryPy: (p) => (S ? `${E}.set_io_mode("${p.PORT}", "${p.MODE}")` : `${E}.${MODES.find((m) => m[1] === p.MODE)?.[3]}("${p.PORT}")`),
            py: (p) => { const m = `"${p.MODE_code}"`; return p.PORT === 'AB' ? `${R}.io_mode_a(${m}); ${R}.io_mode_b(${m})` : `${R}.io_mode_${p.PORT.toLowerCase()}(${m})`; } } });
  add({ id: 'set_output_to', shape: 'stack', tpl: '출력 %PORT 를 %V (으)로 정하기', group: '포트',
    params: { PORT: { kind: 'dropdown', options: PORTS, def: 'A' }, V: { kind: 'value', def: 100 } },
    code: { entryPy: `${E}.set_output("\${PORT}", \${V})`, py: (p) => (p.PORT === 'AB' ? `${R}.output_a(${p.V}); ${R}.output_b(${p.V})` : `${R}.output_${p.PORT.toLowerCase()}(${p.V})`) } });
  add({ id: 'gripper', shape: 'stack', tpl: '집게 %ACT', group: '포트',
    params: { ACT: { kind: 'dropdown', options: [['열기', 'OPEN'], ['닫기', 'CLOSE']], def: 'OPEN' } },
    code: { entryPy: `${E}.set_gripper("\${ACT}")`, py: (p) => (p.ACT === 'OPEN' ? `${R}.open_gripper()` : `${R}.close_gripper()`) } });
  add({ id: 'release_gripper', shape: 'stack', tpl: '집게 끄기', params: {}, group: '포트', code: { entryPy: `${E}.release_gripper()`, py: `${R}.release_gripper()` } });

  return blocks;
}

export const HAMSTER_BLOCKS = build('');
export const HAMSTER_S_BLOCKS = build('S');

export const HAMSTER_PY_HEADER = (variant) => `from roboid import *\nimport random, time\n\nhamster = ${variant === 'S' ? 'HamsterS' : 'Hamster'}()\nleft_speed = 0; right_speed = 0; buzzer_hz = 1000; tempo_bpm = 60\nstart_time = time.time()\n`;
export const HAMSTER_PY_FOOTER = `\ndispose()`;
