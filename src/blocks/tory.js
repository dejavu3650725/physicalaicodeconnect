// ============================================================
// 토리드론(잇플) — 엔트리 하드웨어 블록 카탈로그
// ※ 토리드론은 바이로봇 e_drone 프로토콜 계열(에이럭스 CodingRider 라이브러리 사용)이며,
//    엔트리 블록 캡션은 같은 계열의 엔트리 공식 모듈 '바이로봇 코딩 드론'(block_byrobot_drone_8.js)
//    캡션을 기준으로 수록했다. 실제 화면에서 캡션이 조금 다를 수 있으니 교재/제조사 안내로 확인할 것.
// code.entryPy : 엔트리 파이썬(Drone.* 계열, 참고용)
// code.py      : CodingRider 파이썬(pip install CodingRider) — 검증된 API
// ============================================================

const DIRS = [['앞', 'FORWARD', 'pitch', 1], ['뒤', 'BACKWARD', 'pitch', -1], ['왼쪽', 'LEFT', 'roll', -1], ['오른쪽', 'RIGHT', 'roll', 1], ['위', 'UP', 'throttle', 1], ['아래', 'DOWN', 'throttle', -1]];
const AXES = [['Roll', 'roll'], ['Pitch', 'pitch'], ['Yaw', 'yaw'], ['Throttle', 'throttle']];
const LED_COLORS = [['빨강', 'RED', '255, 0, 0'], ['노랑', 'YELLOW', '255, 255, 0'], ['초록', 'GREEN', '0, 255, 0'], ['하늘색', 'CYAN', '0, 255, 255'], ['파랑', 'BLUE', '0, 0, 255'], ['자홍', 'MAGENTA', '255, 0, 255'], ['흰색', 'WHITE', '255, 255, 255'], ['검정', 'BLACK', '0, 0, 0'], ['구름솜사탕', 'COTTONCANDY', '255, 200, 230'], ['에메랄드', 'EMERALD', '80, 200, 120'], ['라벤더', 'LAVENDER', '180, 150, 255'], ['청포도', 'MUSCAT', '180, 255, 100'], ['딸기우유', 'STRAWBERRYMILK', '255, 160, 190'], ['저녁노을', 'SUNSET', '255, 120, 60']];
const LED_MODES = [['켜짐', 'HOLD', 'LightModeDrone.BodyHold'], ['깜빡임', 'FLICKER', 'LightModeDrone.BodyFlicker'], ['2번 연속 깜빡임', 'FLICKER_DOUBLE', 'LightModeDrone.BodyFlickerDouble'], ['천천히 깜빡임', 'DIMMING', 'LightModeDrone.BodyDimming'], ['점점 밝아짐', 'SUNRISE', 'LightModeDrone.BodySunrise'], ['점점 어두워짐', 'SUNSET', 'LightModeDrone.BodySunset'], ['무지개', 'RAINBOW', 'LightModeDrone.BodyRainbow'], ['무지개2', 'RAINBOW2', 'LightModeDrone.BodyRainbow2']];
const NOTES = [['도', 'C', 'BuzzerScale.C4'], ['도#', 'CS', 'BuzzerScale.CS4'], ['레', 'D', 'BuzzerScale.D4'], ['레#', 'DS', 'BuzzerScale.DS4'], ['미', 'E', 'BuzzerScale.E4'], ['파', 'F', 'BuzzerScale.F4'], ['파#', 'FS', 'BuzzerScale.FS4'], ['솔', 'G', 'BuzzerScale.G4'], ['솔#', 'GS', 'BuzzerScale.GS4'], ['라', 'A', 'BuzzerScale.A4'], ['라#', 'AS', 'BuzzerScale.AS4'], ['시', 'B', 'BuzzerScale.B4']];
const BUTTONS = [['전면 왼쪽 상단 버튼', 'FRONT_LEFT_TOP'], ['전면 왼쪽 하단 버튼', 'FRONT_LEFT_BOTTOM'], ['전면 오른쪽 상단 버튼', 'FRONT_RIGHT_TOP'], ['전면 오른쪽 하단 버튼', 'FRONT_RIGHT_BOTTOM'], ['상단 왼쪽 버튼', 'TOP_LEFT'], ['상단 오른쪽 버튼', 'TOP_RIGHT'], ['중앙 위 버튼', 'CENTER_UP'], ['중앙 왼쪽 버튼', 'CENTER_LEFT'], ['중앙 오른쪽 버튼', 'CENTER_RIGHT'], ['중앙 아래쪽 버튼', 'CENTER_DOWN'], ['하단 왼쪽 버튼', 'BOTTOM_LEFT'], ['하단 오른쪽 버튼', 'BOTTOM_RIGHT']];
const JOY = [['왼쪽', 'LEFT'], ['오른쪽', 'RIGHT']];
const JOY_DIR = [['위', 'UP'], ['아래', 'DOWN'], ['왼쪽', 'LEFT'], ['오른쪽', 'RIGHT'], ['중앙', 'CENTER'], ['왼쪽 위', 'LEFT_UP'], ['오른쪽 위', 'RIGHT_UP'], ['왼쪽 아래', 'LEFT_DOWN'], ['오른쪽 아래', 'RIGHT_DOWN']];
const SENSORS = [['정면과의 거리', 'range_front', 'drone.getData(DataType.Range).front / 1000'], ['바닥과의 거리', 'range_height', 'drone.getData(DataType.Range).bottom / 1000'], ['해발고도', 'altitude', 'drone.getData(DataType.Altitude).altitude'], ['자세 Roll', 'attitude_roll', 'drone.getData(DataType.Attitude).roll'], ['자세 Pitch', 'attitude_pitch', 'drone.getData(DataType.Attitude).pitch'], ['자세 Yaw', 'attitude_yaw', 'drone.getData(DataType.Attitude).yaw'], ['위치 X', 'position_x', 'drone.getData(DataType.Position).x'], ['위치 Y', 'position_y', 'drone.getData(DataType.Position).y'], ['위치 Z', 'position_z', 'drone.getData(DataType.Position).z'], ['가속도 x', 'accel_x', 'drone.getData(DataType.Motion).accelX'], ['가속도 y', 'accel_y', 'drone.getData(DataType.Motion).accelY'], ['가속도 z', 'accel_z', 'drone.getData(DataType.Motion).accelZ'], ['배터리', 'battery', 'drone.getData(DataType.State).battery']];

export const TORY_BLOCKS = [
  // ---- 이륙/착륙 ----
  { id: 'drone_takeoff', cat: 'hardware', hw: true, group: '비행', shape: 'stack', tpl: '드론 이륙', params: {},
    code: { entryPy: 'Drone.takeoff()', py: 'drone.sendTakeOff(); sleep(3)' } },
  { id: 'drone_landing', cat: 'hardware', hw: true, group: '비행', shape: 'stack', tpl: '드론 착륙', params: {},
    code: { entryPy: 'Drone.landing()', py: 'drone.sendLanding(); sleep(3)' } },
  { id: 'drone_stop', cat: 'hardware', hw: true, group: '비행', shape: 'stack', tpl: '드론 정지', params: {},
    code: { entryPy: 'Drone.stop()', py: 'drone.sendStop()' }, help: '비상 정지(모터 즉시 멈춤) — 공중에서는 추락하므로 주의' },
  { id: 'drone_reset_heading', cat: 'hardware', hw: true, group: '비행', shape: 'stack', tpl: '드론 방향 초기화', params: {},
    code: { entryPy: 'Drone.reset_heading()', py: 'drone.sendClearBias(); sleep(0.5)' } },
  // ---- 이동 ----
  { id: 'drone_move_dir', cat: 'hardware', hw: true, group: '이동', shape: 'stack', tpl: '드론 %DIR(으)로 %M m를 %V m/s로 이동',
    params: { DIR: { kind: 'dropdown', options: DIRS, def: 'FORWARD' }, M: { kind: 'value', def: 1 }, V: { kind: 'value', def: 0.5 } },
    code: { entryPy: 'Drone.move("${DIR}", ${M}, ${V})', py: (p) => { const d = DIRS.find((x) => x[1] === p.DIR) || DIRS[0]; const sign = d[3]; const x = d[2] === 'pitch' ? `${sign} * ${p.M}` : 0; const y = d[2] === 'roll' ? `${-sign} * ${p.M}` : 0; const z = d[2] === 'throttle' ? `${sign} * ${p.M}` : 0; return `drone.sendControlPosition(${x}, ${y}, ${z}, ${p.V}, 0, 0); sleep(${p.M} / ${p.V} + 1)`; } },
    help: '위치 제어(m 단위). 실내에서는 1m 이내 권장' },
  { id: 'drone_turn', cat: 'hardware', hw: true, group: '이동', shape: 'stack', tpl: '드론 %DIR(으)로 %DEG도를 %V deg/s로 회전',
    params: { DIR: { kind: 'dropdown', options: [['시계 방향', 'CW'], ['반시계 방향', 'CCW']], def: 'CW' }, DEG: { kind: 'value', def: 90 }, V: { kind: 'value', def: 45 } },
    code: { entryPy: 'Drone.turn("${DIR}", ${DEG}, ${V})', py: (p) => `drone.sendControlPosition(0, 0, 0, 0, ${p.DIR === 'CW' ? '-' : ''}${p.DEG}, ${p.V}); sleep(${p.DEG} / ${p.V} + 1)` } },
  { id: 'drone_control_one', cat: 'hardware', hw: true, group: '이동', shape: 'stack', tpl: '드론 %AXIS %V% 정하기',
    params: { AXIS: { kind: 'dropdown', options: AXES, def: 'Pitch' }, V: { kind: 'value', def: 30 } },
    code: { entryPy: 'Drone.set_${AXIS:code}(${V})', py: (p) => { const m = { roll: '${V}, 0, 0, 0', pitch: '0, ${V}, 0, 0', yaw: '0, 0, ${V}, 0', throttle: '0, 0, 0, ${V}' }; return `drone.sendControl(${m[p.AXIS_code].replace('${V}', p.V)})`; } },
    help: '-100 ~ 100 (%)' },
  { id: 'drone_control_one_delay', cat: 'hardware', hw: true, group: '이동', shape: 'stack', tpl: '드론 %AXIS %V% %SEC 초 실행',
    params: { AXIS: { kind: 'dropdown', options: AXES, def: 'Pitch' }, V: { kind: 'value', def: 30 }, SEC: { kind: 'value', def: 1 } },
    code: { entryPy: 'Drone.run_${AXIS:code}(${V}, ${SEC})', py: (p) => { const m = { roll: `${p.V}, 0, 0, 0`, pitch: `0, ${p.V}, 0, 0`, yaw: `0, 0, ${p.V}, 0`, throttle: `0, 0, 0, ${p.V}` }; return `drone.sendControlWhile(${m[p.AXIS_code]}, ${p.SEC} * 1000)`; } } },
  { id: 'drone_control_quad_delay', cat: 'hardware', hw: true, group: '이동', shape: 'stack', tpl: '드론 Roll %R%, Pitch %P%, Yaw %Y%, Throttle %T% %SEC초 실행',
    params: { R: { kind: 'value', def: 0 }, P: { kind: 'value', def: 0 }, Y: { kind: 'value', def: 0 }, T: { kind: 'value', def: 0 }, SEC: { kind: 'value', def: 1 } },
    code: { entryPy: 'Drone.run_control(${R}, ${P}, ${Y}, ${T}, ${SEC})', py: 'drone.sendControlWhile(${R}, ${P}, ${Y}, ${T}, ${SEC} * 1000)' } },
  // ---- LED ----
  { id: 'drone_light_color_select', cat: 'hardware', hw: true, group: 'LED', shape: 'stack', tpl: '드론 LED %COLOR %MODE %INTERVAL',
    params: { COLOR: { kind: 'dropdown', options: LED_COLORS, def: 'RED' }, MODE: { kind: 'dropdown', options: LED_MODES, def: 'HOLD' }, INTERVAL: { kind: 'value', def: 100 } },
    code: { entryPy: 'Drone.led("${COLOR}", "${MODE}", ${INTERVAL})', py: 'drone.sendLightModeColor(${MODE:code}, ${INTERVAL}, ${COLOR:code})' } },
  { id: 'drone_light_color_input', cat: 'hardware', hw: true, group: 'LED', shape: 'stack', tpl: '드론 LED R %R, G %G, B %B %MODE %INTERVAL',
    params: { R: { kind: 'value', def: 255 }, G: { kind: 'value', def: 0 }, B: { kind: 'value', def: 0 }, MODE: { kind: 'dropdown', options: LED_MODES, def: 'HOLD' }, INTERVAL: { kind: 'value', def: 100 } },
    code: { entryPy: 'Drone.led_rgb(${R}, ${G}, ${B}, "${MODE}", ${INTERVAL})', py: 'drone.sendLightModeColor(${MODE:code}, ${INTERVAL}, ${R}, ${G}, ${B})' } },
  { id: 'drone_light_off', cat: 'hardware', hw: true, group: 'LED', shape: 'stack', tpl: '드론 LED 끄기', params: {},
    code: { entryPy: 'Drone.led_off()', py: 'drone.sendLightModeColor(LightModeDrone.BodyHold, 100, 0, 0, 0)' } },
  // ---- 소리(버저) ----
  { id: 'buzzer_scale_delay', cat: 'hardware', hw: true, group: '소리', shape: 'stack', tpl: '%DEV %OCT 옥타브 %NOTE을(를) %SEC초 연주',
    params: { DEV: { kind: 'dropdown', options: [['조종기', 'CONTROLLER'], ['드론', 'DRONE']], def: 'CONTROLLER' }, OCT: { kind: 'dropdown', options: ['1', '2', '3', '4', '5', '6', '7'].map((o) => [o, o]), def: '4' }, NOTE: { kind: 'dropdown', options: NOTES, def: 'C' }, SEC: { kind: 'value', def: 0.5 } },
    code: { entryPy: 'Drone.buzzer_scale("${DEV}", ${OCT}, "${NOTE}", ${SEC})', py: (p) => `drone.sendBuzzerScale(BuzzerScale.${p.NOTE}${p.OCT}, ${p.SEC} * 1000); sleep(${p.SEC})` } },
  { id: 'buzzer_hz_delay', cat: 'hardware', hw: true, group: '소리', shape: 'stack', tpl: '%DEV %HZ Hz 소리를 %SEC초 연주',
    params: { DEV: { kind: 'dropdown', options: [['조종기', 'CONTROLLER'], ['드론', 'DRONE']], def: 'CONTROLLER' }, HZ: { kind: 'value', def: 440 }, SEC: { kind: 'value', def: 0.5 } },
    code: { entryPy: 'Drone.buzzer_hz("${DEV}", ${HZ}, ${SEC})', py: 'drone.sendBuzzerHz(${HZ}, ${SEC} * 1000); sleep(${SEC})' } },
  { id: 'buzzer_off', cat: 'hardware', hw: true, group: '소리', shape: 'stack', tpl: '%DEV 버저 끄기',
    params: { DEV: { kind: 'dropdown', options: [['조종기', 'CONTROLLER'], ['드론', 'DRONE']], def: 'CONTROLLER' } },
    code: { entryPy: 'Drone.buzzer_off("${DEV}")', py: 'drone.sendBuzzerMute(10)' } },
  // ---- 센서 ----
  { id: 'drone_value', cat: 'hardware', hw: true, group: '센서', shape: 'value', tpl: '%S',
    params: { S: { kind: 'dropdown', options: SENSORS, def: 'range_height' } },
    code: { entryPy: 'Drone.sensor("${S}")', py: '${S:code}' }, help: '거리 단위 m(유효 2m), 자세 단위 °' },
  // ---- 조종기 ----
  { id: 'controller_if_button_press', cat: 'hardware', hw: true, group: '조종기', shape: 'hat', tpl: '조종기 %BTN 눌렀을 때',
    params: { BTN: { kind: 'dropdown', options: BUTTONS, def: 'FRONT_LEFT_TOP' } },
    code: { entryPy: 'def when_controller_button("${BTN}"):\n${BODY}', py: '# 조종기 ${BTN:label} 눌렸을 때 (drone.setEventHandler(DataType.Button, ...) 로 구현)\n${BODY_FLAT}' } },
  { id: 'controller_if_joystick', cat: 'hardware', hw: true, group: '조종기', shape: 'hat', tpl: '조종기 %J 조이스틱 %D (으)로 움직였을 때',
    params: { J: { kind: 'dropdown', options: JOY, def: 'LEFT' }, D: { kind: 'dropdown', options: JOY_DIR, def: 'UP' } },
    code: { entryPy: 'def when_joystick("${J}", "${D}"):\n${BODY}', py: '# 조종기 ${J:label} 조이스틱 ${D:label} (DataType.Joystick 이벤트로 구현)\n${BODY_FLAT}' } },
  { id: 'controller_value_joystick', cat: 'hardware', hw: true, group: '조종기', shape: 'value', tpl: '%V',
    params: { V: { kind: 'dropdown', options: [['왼쪽 조이스틱 가로축', 'LEFT_X', 'drone.getData(DataType.Joystick).left.x'], ['왼쪽 조이스틱 세로축', 'LEFT_Y', 'drone.getData(DataType.Joystick).left.y'], ['오른쪽 조이스틱 가로축', 'RIGHT_X', 'drone.getData(DataType.Joystick).right.x'], ['오른쪽 조이스틱 세로축', 'RIGHT_Y', 'drone.getData(DataType.Joystick).right.y']], def: 'LEFT_Y' } },
    code: { entryPy: 'Drone.joystick("${V}")', py: '${V:code}' }, help: '-100 ~ 100' },
];

export const TORY_PY_HEADER = `from time import sleep\nfrom CodingRider.drone import *\nfrom CodingRider.protocol import *\n\ndrone = Drone()\ndrone.open()          # 조종기(USB-SERIAL CH340) 포트 자동 탐색. 필요하면 drone.open('COM3')\nsleep(1)\n`;
export const TORY_PY_FOOTER = `\ndrone.close()`;
