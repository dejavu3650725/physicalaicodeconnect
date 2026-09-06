// ============================================================
// 레고 스파이크 프라임 — SPIKE 앱(3.x) 워드 블록 카탈로그 + SPIKE Python
// 캡션은 서울시교육청 자료집(레고 스파이크 프라임 챕터)에 실린 화면 표기를 따른다.
// code.py : SPIKE Python 3 (hub / motor_pair / motor / color_sensor / distance_sensor / runloop)
// ============================================================

export const SPIKE_COLORS = {
  motors:    { fill: '#0090F5', dark: '#0070c0', label: '모터' },
  movement:  { fill: '#FF3FA7', dark: '#d02a86', label: '움직임' },
  light:     { fill: '#9B51E0', dark: '#7b3cb8', label: '라이트' },
  sound:     { fill: '#CF63CF', dark: '#a848a8', label: '소리' },
  events:    { fill: '#FFBF00', dark: '#d9a200', label: '이벤트', text: '#3b2a00' },
  control:   { fill: '#FFAB19', dark: '#e0900a', label: '제어', text: '#3b2a00' },
  sensors:   { fill: '#3FC1FF', dark: '#1ea3e6', label: '센서', text: '#04283a' },
  operators: { fill: '#59C059', dark: '#43a043', label: '연산' },
  variables: { fill: '#FF8C1A', dark: '#db7409', label: '변수' },
  ai:        { fill: '#8222ff', dark: '#670bdd', label: 'AI 이거다' },
};

const PORTS = ['A', 'B', 'C', 'D', 'E', 'F'].map((p) => [p, p]);
const PAIRS = [['A+B', 'A+B', 'port.A, port.B'], ['C+D', 'C+D', 'port.C, port.D'], ['E+F', 'E+F', 'port.E, port.F']];
const COLORS = [['빨간색', 'RED'], ['노란색', 'YELLOW'], ['초록색', 'GREEN'], ['파란색', 'BLUE'], ['하늘색', 'AZURE'], ['보라색', 'MAGENTA'], ['검은색', 'BLACK'], ['흰색', 'WHITE']];
const HUB_COLORS = [['빨간색', 'RED'], ['노란색', 'YELLOW'], ['초록색', 'GREEN'], ['파란색', 'BLUE'], ['보라색', 'PURPLE'], ['흰색', 'WHITE'], ['끄기', 'BLACK']];
const CMP = [['=', '==', '=='], ['<', '<', '<'], ['>', '>', '>']];

export const SPIKE_BLOCKS = [
  // ---- 이벤트 ----
  { id: 'when_program_starts', cat: 'events', shape: 'hat', tpl: '프로그램이 시작될 때', params: {},
    code: { py: 'async def main():\n${BODY}\n\nrunloop.run(main())' } },
  { id: 'when_button_pressed', cat: 'events', shape: 'hat', tpl: '%B 버튼이 누름 일 때', params: { B: { kind: 'dropdown', options: [['왼쪽', 'LEFT'], ['오른쪽', 'RIGHT']], def: 'LEFT' } },
    code: { py: 'async def on_${B:lower}_button():\n    await runloop.until(lambda: button.pressed(button.${B}) > 0)\n${BODY}\n\nrunloop.run(on_${B:lower}_button())' } },
  { id: 'when_color', cat: 'events', shape: 'hat', tpl: '%P 의 색상이 %C 일 때', params: { P: { kind: 'dropdown', options: PORTS, def: 'B' }, C: { kind: 'dropdown', options: COLORS, def: 'RED' } },
    code: { py: 'async def on_color_${P}():\n    await runloop.until(lambda: color_sensor.color(port.${P}) == color.${C})\n${BODY}\n\nrunloop.run(on_color_${P}())' } },
  { id: 'when_closer_than', cat: 'events', shape: 'hat', tpl: '%P 이(가) %D cm 보다 가까울 때', params: { P: { kind: 'dropdown', options: PORTS, def: 'A' }, D: { kind: 'value', def: 10 } },
    code: { py: 'async def on_near_${P}():\n    await runloop.until(lambda: 0 <= distance_sensor.distance(port.${P}) < ${D} * 10)\n${BODY}\n\nrunloop.run(on_near_${P}())' } },
  { id: 'when_tilted', cat: 'events', shape: 'hat', tpl: '%DIR 을(를) 기울일 때', params: { DIR: { kind: 'dropdown', options: [['←', 'LEFT', '< -100'], ['→', 'RIGHT', '> 100'], ['↑', 'FRONT', '< -100'], ['↓', 'BACK', '> 100']], def: 'LEFT' } },
    code: { py: 'async def on_tilt():\n    await runloop.until(lambda: motion_sensor.tilt_angles()[1] ${DIR:code})  # 기울기(0.1도 단위) 근사\n${BODY}\n\nrunloop.run(on_tilt())' } },

  // ---- 움직임(드라이빙 베이스) ----
  { id: 'set_movement_motors', cat: 'movement', shape: 'stack', tpl: '동작 모터를 %PAIR (으)로 정하기', params: { PAIR: { kind: 'dropdown', options: PAIRS, def: 'C+D' } },
    code: { py: 'motor_pair.pair(motor_pair.PAIR_1, ${PAIR:code})' } },
  { id: 'move_for', cat: 'movement', shape: 'stack', tpl: '%DIR 방향으로 %V %UNIT 만큼 움직이기',
    params: { DIR: { kind: 'dropdown', options: [['↑', 'FWD'], ['↓', 'BWD']], def: 'FWD' }, V: { kind: 'value', def: 10 }, UNIT: { kind: 'dropdown', options: [['cm', 'CM'], ['회전', 'ROT'], ['도', 'DEG'], ['초', 'SEC']], def: 'CM' } },
    code: { py: (p) => { const s = p.DIR === 'FWD' ? '' : '-'; if (p.UNIT === 'SEC') return `await motor_pair.move_for_time(motor_pair.PAIR_1, ${p.V} * 1000, 0, velocity=${s}360)`; const deg = p.UNIT === 'CM' ? `int(${p.V} / 17.5 * 360)` : p.UNIT === 'ROT' ? `int(${p.V} * 360)` : `${p.V}`; return `await motor_pair.move_for_degrees(motor_pair.PAIR_1, ${s}${deg}, 0)`; } },
    help: 'cm→도 변환은 바퀴 둘레 17.5cm(스파이크 기본 바퀴) 기준' },
  { id: 'steer_for', cat: 'movement', shape: 'stack', tpl: '%SIDE: %STEER 방향으로 %V %UNIT 만큼 움직이기',
    params: { SIDE: { kind: 'dropdown', options: [['오른쪽', 'R'], ['왼쪽', 'L']], def: 'R' }, STEER: { kind: 'value', def: 100 }, V: { kind: 'value', def: 0.5 }, UNIT: { kind: 'dropdown', options: [['회전', 'ROT'], ['도', 'DEG'], ['cm', 'CM'], ['초', 'SEC']], def: 'ROT' } },
    code: { py: (p) => { const deg = p.UNIT === 'CM' ? `int(${p.V} / 17.5 * 360)` : p.UNIT === 'ROT' ? `int(${p.V} * 360)` : `${p.V}`; return p.UNIT === 'SEC' ? `await motor_pair.move_for_time(motor_pair.PAIR_1, ${p.V} * 1000, ${p.STEER})` : `await motor_pair.move_for_degrees(motor_pair.PAIR_1, ${deg}, ${p.STEER})`; } },
    help: '조향값 100 = 제자리 우회전, -100 = 제자리 좌회전' },
  { id: 'start_moving', cat: 'movement', shape: 'stack', tpl: '%DIR 방향으로 동작 시작하기', params: { DIR: { kind: 'dropdown', options: [['↑', 'FWD'], ['↓', 'BWD']], def: 'FWD' } },
    code: { py: (p) => `motor_pair.move(motor_pair.PAIR_1, 0, velocity=${p.DIR === 'FWD' ? '' : '-'}360)` } },
  { id: 'start_steering', cat: 'movement', shape: 'stack', tpl: '%SIDE: %STEER 방향으로 동작 시작하기', params: { SIDE: { kind: 'dropdown', options: [['오른쪽', 'R'], ['왼쪽', 'L']], def: 'R' }, STEER: { kind: 'value', def: 50 } },
    code: { py: 'motor_pair.move(motor_pair.PAIR_1, ${STEER})' } },
  { id: 'stop_moving', cat: 'movement', shape: 'stack', tpl: '이동 멈추기', params: {}, code: { py: 'motor_pair.stop(motor_pair.PAIR_1)' } },
  { id: 'set_movement_speed', cat: 'movement', shape: 'stack', tpl: '동작 속도를 %V %로 정하기', params: { V: { kind: 'value', def: 50 } },
    code: { py: 'speed = int(${V} * 11)  # % → deg/s (최대 약 1100)' } },

  // ---- 모터 ----
  { id: 'motor_run_for', cat: 'motors', shape: 'stack', tpl: '%P 모터 %DIR 방향으로 %V %UNIT 만큼 작동하기',
    params: { P: { kind: 'dropdown', options: PORTS, def: 'C' }, DIR: { kind: 'dropdown', options: [['↻', 'CW'], ['↺', 'CCW']], def: 'CW' }, V: { kind: 'value', def: 1 }, UNIT: { kind: 'dropdown', options: [['회전', 'ROT'], ['도', 'DEG'], ['초', 'SEC']], def: 'ROT' } },
    code: { py: (p) => { const s = p.DIR === 'CW' ? '' : '-'; if (p.UNIT === 'SEC') return `await motor.run_for_time(port.${p.P}, ${p.V} * 1000, ${s}360)`; const deg = p.UNIT === 'ROT' ? `int(${p.V} * 360)` : `${p.V}`; return `await motor.run_for_degrees(port.${p.P}, ${s}${deg}, 360)`; } } },
  { id: 'motor_start', cat: 'motors', shape: 'stack', tpl: '%P 모터 %DIR 방향으로 작동 시작하기', params: { P: { kind: 'dropdown', options: PORTS, def: 'C' }, DIR: { kind: 'dropdown', options: [['↻', 'CW'], ['↺', 'CCW']], def: 'CW' } },
    code: { py: (p) => `motor.run(port.${p.P}, ${p.DIR === 'CW' ? '' : '-'}360)` } },
  { id: 'motor_stop', cat: 'motors', shape: 'stack', tpl: '%P 모터 멈추기', params: { P: { kind: 'dropdown', options: PORTS, def: 'C' } }, code: { py: 'motor.stop(port.${P})' } },
  { id: 'motor_set_speed', cat: 'motors', shape: 'stack', tpl: '%P 모터 속도를 %V %로 정하기', params: { P: { kind: 'dropdown', options: PORTS, def: 'C' }, V: { kind: 'value', def: 75 } }, code: { py: 'motor_speed_${P} = int(${V} * 11)' } },
  { id: 'motor_go_to_position', cat: 'motors', shape: 'stack', tpl: '%P 모터 %DEG 도 위치로 %DIR 이동하기', params: { P: { kind: 'dropdown', options: PORTS, def: 'C' }, DEG: { kind: 'value', def: 0 }, DIR: { kind: 'dropdown', options: [['가장 빠른 방향으로', 'SHORTEST', 'SHORTEST_PATH'], ['↻', 'CW', 'CLOCKWISE'], ['↺', 'CCW', 'COUNTERCLOCKWISE']], def: 'SHORTEST' } },
    code: { py: 'await motor.run_to_absolute_position(port.${P}, ${DEG}, 360, direction=motor.${DIR:code})' } },

  // ---- 라이트 ----
  { id: 'light_write', cat: 'light', shape: 'stack', tpl: '%TEXT 쓰기', params: { TEXT: { kind: 'text', def: 'Hello' } }, code: { py: 'await light_matrix.write(${TEXT:q})' } },
  { id: 'light_image_for', cat: 'light', shape: 'stack', tpl: '%IMG 을(를) %SEC 초동안 켜기', params: { IMG: { kind: 'dropdown', options: [['하트', 'HEART'], ['행복', 'HAPPY'], ['슬픔', 'SAD'], ['화살표 ↑', 'ARROW_N'], ['화살표 ↓', 'ARROW_S'], ['네', 'YES'], ['아니오', 'NO'], ['체크', 'YES']], def: 'HEART' }, SEC: { kind: 'value', def: 2 } },
    code: { py: 'light_matrix.show_image(light_matrix.IMAGE_${IMG})\nawait runloop.sleep_ms(${SEC} * 1000)\nlight_matrix.clear()' } },
  { id: 'light_pixel', cat: 'light', shape: 'stack', tpl: '%X %Y 위치의 픽셀을 %B % 밝기로 정하기', params: { X: { kind: 'value', def: 1 }, Y: { kind: 'value', def: 1 }, B: { kind: 'value', def: 100 } },
    code: { py: 'light_matrix.set_pixel(${X} - 1, ${Y} - 1, ${B})' } },
  { id: 'light_off', cat: 'light', shape: 'stack', tpl: '픽셀 끄기', params: {}, code: { py: 'light_matrix.clear()' } },
  { id: 'hub_button_color', cat: 'light', shape: 'stack', tpl: '전원 버튼 라이트를 %C 으로 정하기', params: { C: { kind: 'dropdown', options: HUB_COLORS, def: 'RED' } },
    code: { py: 'light.color(light.POWER, color.${C})' } },

  // ---- 소리 ----
  { id: 'beep_for', cat: 'sound', shape: 'stack', tpl: '비프음 %N 을(를) %SEC 초간 재생하기', params: { N: { kind: 'value', def: 60 }, SEC: { kind: 'value', def: 0.5 } },
    code: { py: 'await sound.beep(int(440 * 2 ** ((${N} - 69) / 12)), int(${SEC} * 1000))' }, help: 'N은 MIDI 음 번호(60 = 도)' },
  { id: 'play_sound', cat: 'sound', shape: 'stack', tpl: '%S 재생하기', params: { S: { kind: 'text', def: 'Cat Meow 1' } },
    code: { py: '# 앱 사운드 "${S}" 재생 — SPIKE Python에서는 허브 비프음으로 대체\nawait sound.beep(440, 300)' } },
  { id: 'stop_sounds', cat: 'sound', shape: 'stack', tpl: '모든 소리 멈추기', params: {}, code: { py: 'sound.stop()' } },

  // ---- 제어 ----
  { id: 'wait_seconds', cat: 'control', shape: 'stack', tpl: '%SEC 초 기다리기', params: { SEC: { kind: 'value', def: 1 } }, code: { py: 'await runloop.sleep_ms(int(${SEC} * 1000))' } },
  { id: 'wait_until', cat: 'control', shape: 'stack', tpl: '%COND 까지 기다리기', params: { COND: { kind: 'boolean' } }, code: { py: 'await runloop.until(lambda: ${COND})' } },
  { id: 'repeat', cat: 'control', shape: 'c', tpl: '%N 번 반복하기', params: { N: { kind: 'value', def: 10 } }, code: { py: 'for i in range(${N}):\n${BODY}' } },
  { id: 'forever', cat: 'control', shape: 'c', tpl: '무한 반복하기', params: {}, code: { py: 'while True:\n${BODY}' } },
  { id: 'repeat_until', cat: 'control', shape: 'c', tpl: '%COND 까지 반복하기', params: { COND: { kind: 'boolean' } }, code: { py: 'while not (${COND}):\n${BODY}' } },
  { id: 'if', cat: 'control', shape: 'c', tpl: '만약 %COND (이)라면', params: { COND: { kind: 'boolean' } }, code: { py: 'if ${COND}:\n${BODY}' } },
  { id: 'if_else', cat: 'control', shape: 'c_else', tpl: '만약 %COND (이)라면', tplElse: '아니면', params: { COND: { kind: 'boolean' } }, code: { py: 'if ${COND}:\n${BODY}\nelse:\n${ELSE}' } },
  { id: 'stop_all', cat: 'control', shape: 'stack', tpl: '멈추기 %WHAT', params: { WHAT: { kind: 'dropdown', options: [['모두', 'ALL'], ['이 스택', 'THIS']], def: 'ALL' } }, code: { py: 'raise SystemExit' } },

  // ---- 센서 ----
  { id: 'color_is', cat: 'sensors', shape: 'boolean', tpl: '%P 의 색상이 %C 인가?', params: { P: { kind: 'dropdown', options: PORTS, def: 'B' }, C: { kind: 'dropdown', options: COLORS, def: 'BLACK' } },
    code: { py: '(color_sensor.color(port.${P}) == color.${C})' } },
  { id: 'color_value', cat: 'sensors', shape: 'value', tpl: '%P 의 색상', params: { P: { kind: 'dropdown', options: PORTS, def: 'B' } }, code: { py: 'color_sensor.color(port.${P})' } },
  { id: 'reflection', cat: 'sensors', shape: 'value', tpl: '%P 의 반사광 %', params: { P: { kind: 'dropdown', options: PORTS, def: 'B' } }, code: { py: 'color_sensor.reflection(port.${P})' } },
  { id: 'distance_closer', cat: 'sensors', shape: 'boolean', tpl: '%P 이(가) %D cm 보다 %CMP ?', params: { P: { kind: 'dropdown', options: PORTS, def: 'A' }, D: { kind: 'value', def: 10 }, CMP: { kind: 'dropdown', options: [['가까운가', 'CLOSER', '<'], ['먼가', 'FARTHER', '>']], def: 'CLOSER' } },
    code: { py: '(0 <= distance_sensor.distance(port.${P}) and distance_sensor.distance(port.${P}) ${CMP:code} ${D} * 10)' } },
  { id: 'distance_cm', cat: 'sensors', shape: 'value', tpl: '%P 의 거리 cm', params: { P: { kind: 'dropdown', options: PORTS, def: 'A' } }, code: { py: '(distance_sensor.distance(port.${P}) / 10)' } },
  { id: 'force_pressed', cat: 'sensors', shape: 'boolean', tpl: '%P 이(가) 눌림 인가?', params: { P: { kind: 'dropdown', options: PORTS, def: 'E' } }, code: { py: 'force_sensor.pressed(port.${P})' } },
  { id: 'hub_button_pressed', cat: 'sensors', shape: 'boolean', tpl: '%B 버튼이 누름 인가?', params: { B: { kind: 'dropdown', options: [['왼쪽', 'LEFT'], ['오른쪽', 'RIGHT']], def: 'LEFT' } }, code: { py: '(button.pressed(button.${B}) > 0)' } },
  { id: 'yaw_angle', cat: 'sensors', shape: 'value', tpl: '요 각도', params: {}, code: { py: '(motion_sensor.tilt_angles()[0] / 10)' } },
  { id: 'timer', cat: 'sensors', shape: 'value', tpl: '타이머', params: {}, code: { py: '(time.ticks_ms() / 1000)' } },

  // ---- 연산 ----
  { id: 'compare', cat: 'operators', shape: 'boolean', tpl: '%A %OP %B', params: { A: { kind: 'value', def: 0 }, OP: { kind: 'dropdown', options: CMP, def: '<' }, B: { kind: 'value', def: 50 } }, code: { py: '(${A} ${OP:code} ${B})' } },
  { id: 'and_or', cat: 'operators', shape: 'boolean', tpl: '%A %OP %B', params: { A: { kind: 'boolean' }, OP: { kind: 'dropdown', options: [['그리고', 'and'], ['또는', 'or']], def: 'and' }, B: { kind: 'boolean' } }, code: { py: '(${A} ${OP} ${B})' } },
  { id: 'not', cat: 'operators', shape: 'boolean', tpl: '%A 이(가) 아니다', params: { A: { kind: 'boolean' } }, code: { py: '(not ${A})' } },
  { id: 'arith', cat: 'operators', shape: 'value', tpl: '%A %OP %B', params: { A: { kind: 'value', def: 0 }, OP: { kind: 'dropdown', options: [['+', '+'], ['-', '-'], ['*', '*'], ['/', '/']], def: '+' }, B: { kind: 'value', def: 0 } }, code: { py: '(${A} ${OP} ${B})' } },
  { id: 'random', cat: 'operators', shape: 'value', tpl: '%A 부터 %B 사이의 난수', params: { A: { kind: 'value', def: 1 }, B: { kind: 'value', def: 10 } }, code: { py: 'random.randint(${A}, ${B})' } },

  // ---- 변수 ----
  { id: 'set_variable', cat: 'variables', shape: 'stack', tpl: '%VAR 을(를) %V 로 정하기', params: { VAR: { kind: 'variable', def: '점수' }, V: { kind: 'value', def: 0 } }, code: { py: '${VAR} = ${V}' } },
  { id: 'change_variable', cat: 'variables', shape: 'stack', tpl: '%VAR 을(를) %V 만큼 바꾸기', params: { VAR: { kind: 'variable', def: '점수' }, V: { kind: 'value', def: 1 } }, code: { py: '${VAR} += ${V}' } },
  { id: 'get_variable', cat: 'variables', shape: 'value', tpl: '%VAR', params: { VAR: { kind: 'variable', def: '점수' } }, code: { py: '${VAR}' } },

  // ---- AI 이거다 (교육청 자료집 방식: 카메라 AI 모델 분류 확장) ----
  { id: 'ai_request_result', cat: 'ai', shape: 'stack', tpl: '%MODEL 분류 결과 요청하기', params: { MODEL: { kind: 'text', def: '로봇조종' } }, aiOnly: true,
    code: { py: '# [AI 이거다] ${MODEL} 모델 분류 결과 요청 (SPIKE 앱 확장 블록 전용)' } },
  { id: 'ai_result_is', cat: 'ai', shape: 'boolean', tpl: '%MODEL 분류 결과가 클래스 %CLS 인가?', params: { MODEL: { kind: 'text', def: '로봇조종' }, CLS: { kind: 'text', def: 'go' } }, aiOnly: true,
    code: { py: '(ai_result("${MODEL}") == ${CLS:q})  # [AI 이거다]' } },
  { id: 'ai_confidence', cat: 'ai', shape: 'value', tpl: '%MODEL 클래스 %CLS 의 신뢰도(%)', params: { MODEL: { kind: 'text', def: '로봇조종' }, CLS: { kind: 'text', def: 'go' } }, aiOnly: true,
    code: { py: 'ai_confidence("${MODEL}", ${CLS:q})  # [AI 이거다]' } },
];

export const SPIKE_PY_HEADER = `from hub import port, light_matrix, light, button, motion_sensor, sound\nimport motor, motor_pair, color, color_sensor, distance_sensor, force_sensor, runloop, random, time\n\n`;
export const SPIKE_PY_FOOTER = ``;
