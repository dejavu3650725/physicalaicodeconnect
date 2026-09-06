// ============================================================
// 토리드론(잇플) — 엔트리 하드웨어 블록 카탈로그
// 캡션 출처: 잇플 교재 『엔트리 인공지능과 함께하는 토리드론』 화면 캡처(연구회 보유 자료) 전사 — 실제 엔트리 표기 그대로
//   연결: 잇플 자료실의 'Entry_Alux'(엔트리 토리드론 설치) → 하드웨어 → 연결 프로그램 열기 → '토리드론' 검색
//        (또는 공식 엔트리 하드웨어 프로그램에서 '바이로봇 배틀 드론' 선택)
// code.entryPy : 엔트리 파이썬(참고용) / code.py : CodingRider 파이썬(pip install CodingRider)
// ============================================================

const DIRS = [['앞', 'FORWARD', 'pitch', 1], ['뒤', 'BACKWARD', 'pitch', -1], ['오른쪽', 'RIGHT', 'roll', 1], ['왼쪽', 'LEFT', 'roll', -1], ['위', 'UP', 'throttle', 1], ['아래', 'DOWN', 'throttle', -1]];
const AXES = [['Roll', 'Roll', 'roll'], ['Pitch', 'Pitch', 'pitch'], ['Yaw', 'Yaw', 'yaw'], ['Throttle', 'Throttle', 'throttle']];
const COLORS = [['빨강', 'RED', '255, 0, 0'], ['초록', 'GREEN', '0, 255, 0'], ['파랑', 'BLUE', '0, 0, 255'], ['노랑', 'YELLOW', '255, 255, 0'], ['자홍', 'MAGENTA', '255, 0, 255'], ['하늘색', 'CYAN', '0, 255, 255'], ['흰색', 'WHITE', '255, 255, 255'], ['저녁노을', 'SUNSET', '255, 120, 60'], ['구름솜사탕', 'COTTONCANDY', '255, 200, 230'], ['청포도', 'MUSCAT', '180, 255, 100'], ['딸기우유', 'STRAWBERRYMILK', '255, 160, 190'], ['에메랄드', 'EMERALD', '80, 200, 120'], ['라벤더', 'LAVENDER', '180, 150, 255']];
const LED_SIMPLE = [['켜기', 'ON', 'LightModeDrone.BodyHold, 100'], ['끄기', 'OFF', 'LightModeDrone.BodyHold, 0'], ['25%', 'B25', 'LightModeDrone.BodyHold, 64'], ['50%', 'B50', 'LightModeDrone.BodyHold, 128'], ['75%', 'B75', 'LightModeDrone.BodyHold, 192'], ['100%', 'B100', 'LightModeDrone.BodyHold, 255']];
const LED_MODES = [['켜짐', 'HOLD', 'LightModeDrone.BodyHold'], ['깜빡임', 'FLICKER', 'LightModeDrone.BodyFlicker'], ['2번 연속 깜빡임', 'FLICKER_DOUBLE', 'LightModeDrone.BodyFlickerDouble'], ['천천히 깜빡임', 'DIMMING', 'LightModeDrone.BodyDimming'], ['점점 밝아짐', 'SUNRISE', 'LightModeDrone.BodySunrise'], ['점점 어두워짐', 'SUNSET', 'LightModeDrone.BodySunset'], ['무지개', 'RAINBOW', 'LightModeDrone.BodyRainbow'], ['무지개2', 'RAINBOW2', 'LightModeDrone.BodyRainbow2']];
const NOTES = [['도', 'C'], ['도#', 'CS'], ['레', 'D'], ['레#', 'DS'], ['미', 'E'], ['파', 'F'], ['파#', 'FS'], ['솔', 'G'], ['솔#', 'GS'], ['라', 'A'], ['라#', 'AS'], ['시', 'B']];
const OCT = ['1', '2', '3', '4', '5', '6', '7'].map((o) => [o, o]);
const VALUES = [
  ['각도 Roll', 'attitude_roll', 'drone.getData(DataType.Attitude).roll'], ['각도 Pitch', 'attitude_pitch', 'drone.getData(DataType.Attitude).pitch'], ['각도 Yaw', 'attitude_yaw', 'drone.getData(DataType.Attitude).yaw'],
  ['가속도 x', 'accel_x', 'drone.getData(DataType.Motion).accelX'], ['가속도 y', 'accel_y', 'drone.getData(DataType.Motion).accelY'], ['가속도 z', 'accel_z', 'drone.getData(DataType.Motion).accelZ'],
  ['각속도 Roll', 'gyro_roll', 'drone.getData(DataType.Motion).gyroRoll'], ['각속도 Pitch', 'gyro_pitch', 'drone.getData(DataType.Motion).gyroPitch'], ['각속도 Yaw', 'gyro_yaw', 'drone.getData(DataType.Motion).gyroYaw'],
  ['위치 X', 'position_x', 'drone.getData(DataType.Position).x'], ['위치 Y', 'position_y', 'drone.getData(DataType.Position).y'], ['위치 Z', 'position_z', 'drone.getData(DataType.Position).z'],
  ['해발고도', 'altitude', 'drone.getData(DataType.Altitude).altitude'],
  ['비행 동작 상태', 'mode_flight', 'drone.getData(DataType.State).modeFlight'], ['비행 제어 모드', 'mode_control', 'drone.getData(DataType.State).modeControlFlight'], ['이동 상태', 'mode_movement', 'drone.getData(DataType.State).modeMovement'],
  ['Headless', 'headless', 'drone.getData(DataType.State).headless'], ['센서 방향', 'sensor_orientation', 'drone.getData(DataType.State).sensorOrientation'], ['배터리', 'battery', 'drone.getData(DataType.State).battery'],
];
const axisCtl = (p, secKey) => { const m = { roll: `${p.V}, 0, 0, 0`, pitch: `0, ${p.V}, 0, 0`, yaw: `0, 0, ${p.V}, 0`, throttle: `0, 0, 0, ${p.V}` }; return secKey ? `drone.sendControlWhile(${m[p.AXIS_code]}, ${p[secKey]} * 1000)` : `drone.sendControl(${m[p.AXIS_code]})`; };

export const TORY_BLOCKS = [
  // ---- 기본 ----
  { id: 'drone_sensor_reset', cat: 'hardware', hw: true, group: '기본', shape: 'stack', tpl: '센서 초기화', params: {},
    code: { entryPy: 'Drone.sensor_reset()', py: 'drone.sendClearBias(); sleep(0.5)' }, help: '평평한 곳에 두고 실행(드리프트 예방)' },
  { id: 'drone_takeoff', cat: 'hardware', hw: true, group: '기본', shape: 'stack', tpl: '드론 이륙', params: {},
    code: { entryPy: 'Drone.takeoff()', py: 'drone.sendTakeOff(); sleep(3)' } },
  { id: 'drone_landing', cat: 'hardware', hw: true, group: '기본', shape: 'stack', tpl: '드론 착륙', params: {},
    code: { entryPy: 'Drone.landing()', py: 'drone.sendLanding(); sleep(3)' } },
  { id: 'drone_stop', cat: 'hardware', hw: true, group: '기본', shape: 'stack', tpl: '드론 정지', params: {},
    code: { entryPy: 'Drone.stop()', py: 'drone.sendStop()' }, help: '비상 정지(모터 즉시 멈춤) — 공중에서는 추락하므로 주의' },
  { id: 'drone_reset_heading', cat: 'hardware', hw: true, group: '기본', shape: 'stack', tpl: '드론 방향 초기화', params: {},
    code: { entryPy: 'Drone.reset_heading()', py: 'drone.sendClearBias(); sleep(0.5)' } },
  { id: 'drone_headless', cat: 'hardware', hw: true, group: '기본', shape: 'stack', tpl: 'Headless mode %MODE',
    params: { MODE: { kind: 'dropdown', options: [['on (초보자용)', 'ON', 'Headless.Headless'], ['off (숙련자용)', 'OFF', 'Headless.Normal']], def: 'ON' } },
    code: { entryPy: 'Drone.headless("${MODE}")', py: 'drone.sendHeadless(${MODE:code})' }, help: 'on이면 드론 머리 방향과 상관없이 조종자 기준으로 움직임' },
  // ---- 조종값(축) ----
  { id: 'drone_axis_set', cat: 'hardware', hw: true, group: '조종', shape: 'stack', tpl: '드론 %AXIS %V % 정하기',
    params: { AXIS: { kind: 'dropdown', options: AXES, def: 'Pitch' }, V: { kind: 'value', def: 50 } },
    code: { entryPy: 'Drone.set_${AXIS:code}(${V})', py: (p) => axisCtl(p) }, help: '-100 ~ 100 (%). 정하기는 계속 유지되므로 마지막에 0으로 되돌리기' },
  { id: 'drone_axis_run', cat: 'hardware', hw: true, group: '조종', shape: 'stack', tpl: '드론 %AXIS %V % %SEC 초 실행',
    params: { AXIS: { kind: 'dropdown', options: AXES, def: 'Pitch' }, V: { kind: 'value', def: 50 }, SEC: { kind: 'value', def: 1 } },
    code: { entryPy: 'Drone.run_${AXIS:code}(${V}, ${SEC})', py: (p) => axisCtl(p, 'SEC') } },
  { id: 'drone_quad_set', cat: 'hardware', hw: true, group: '조종', shape: 'stack', tpl: '드론 Roll %R %, Pitch %P %, Yaw %Y %, Throttle %T % 정하기',
    params: { R: { kind: 'value', def: 0 }, P: { kind: 'value', def: 0 }, Y: { kind: 'value', def: 0 }, T: { kind: 'value', def: 0 } },
    code: { entryPy: 'Drone.set_control(${R}, ${P}, ${Y}, ${T})', py: 'drone.sendControl(${R}, ${P}, ${Y}, ${T})' } },
  { id: 'drone_quad_run', cat: 'hardware', hw: true, group: '조종', shape: 'stack', tpl: '드론 Roll %R %, Pitch %P %, Yaw %Y %, Throttle %T % %SEC 초 실행',
    params: { R: { kind: 'value', def: 0 }, P: { kind: 'value', def: 0 }, Y: { kind: 'value', def: 0 }, T: { kind: 'value', def: 0 }, SEC: { kind: 'value', def: 1 } },
    code: { entryPy: 'Drone.run_control(${R}, ${P}, ${Y}, ${T}, ${SEC})', py: 'drone.sendControlWhile(${R}, ${P}, ${Y}, ${T}, ${SEC} * 1000)' } },
  // ---- 거리 이동 / 회전 ----
  { id: 'drone_move_dir', cat: 'hardware', hw: true, group: '이동', shape: 'stack', tpl: '드론 %DIR (으)로 %M m를 %V m/s로 이동',
    params: { DIR: { kind: 'dropdown', options: DIRS, def: 'FORWARD' }, M: { kind: 'value', def: 1 }, V: { kind: 'value', def: 1 } },
    code: { entryPy: 'Drone.move("${DIR}", ${M}, ${V})', py: (p) => { const d = DIRS.find((x) => x[1] === p.DIR) || DIRS[0]; const s = d[3]; const x = d[2] === 'pitch' ? `${s} * ${p.M}` : 0; const y = d[2] === 'roll' ? `${-s} * ${p.M}` : 0; const z = d[2] === 'throttle' ? `${s} * ${p.M}` : 0; return `drone.sendControlPosition(${x}, ${y}, ${z}, ${p.V}, 0, 0); sleep(${p.M} / ${p.V} + 1)`; } },
    help: '실내에서는 1m 이내·0.5m/s 이하 권장' },
  { id: 'drone_move_xyz', cat: 'hardware', hw: true, group: '이동', shape: 'stack', tpl: '드론 %D1 %X m, %D2 %Y m, %D3 %Z m를 %V m/s로 이동',
    params: { D1: { kind: 'dropdown', options: [['앞', 'FORWARD', '1'], ['뒤', 'BACKWARD', '-1']], def: 'FORWARD' }, X: { kind: 'value', def: 1 }, D2: { kind: 'dropdown', options: [['오른쪽', 'RIGHT', '-1'], ['왼쪽', 'LEFT', '1']], def: 'RIGHT' }, Y: { kind: 'value', def: 0 }, D3: { kind: 'dropdown', options: [['위', 'UP', '1'], ['아래', 'DOWN', '-1']], def: 'UP' }, Z: { kind: 'value', def: 0 }, V: { kind: 'value', def: 1 } },
    code: { entryPy: 'Drone.move_xyz(${D1:code} * ${X}, ${D2:code} * ${Y}, ${D3:code} * ${Z}, ${V})', py: 'drone.sendControlPosition(${D1:code} * ${X}, ${D2:code} * ${Y}, ${D3:code} * ${Z}, ${V}, 0, 0); sleep(3)' } },
  { id: 'drone_turn', cat: 'hardware', hw: true, group: '이동', shape: 'stack', tpl: '드론 %DIR (으)로 %DEG 도를 %V deg/s로 회전',
    params: { DIR: { kind: 'dropdown', options: [['시계 방향', 'CW', '-1'], ['반시계 방향', 'CCW', '1']], def: 'CW' }, DEG: { kind: 'value', def: 90 }, V: { kind: 'value', def: 45 } },
    code: { entryPy: 'Drone.turn("${DIR}", ${DEG}, ${V})', py: 'drone.sendControlPosition(0, 0, 0, 0, ${DIR:code} * ${DEG}, ${V}); sleep(${DEG} / ${V} + 1)' }, help: 'Yaw는 + 값이 반시계 방향' },
  // ---- LED / 소리 / 진동 ----
  { id: 'drone_led_simple', cat: 'hardware', hw: true, group: 'LED', shape: 'stack', tpl: '드론 LED %COLOR %MODE',
    params: { COLOR: { kind: 'dropdown', options: COLORS, def: 'RED' }, MODE: { kind: 'dropdown', options: LED_SIMPLE, def: 'ON' } },
    code: { entryPy: 'Drone.led("${COLOR}", "${MODE}")', py: 'drone.sendLightModeColor(${MODE:code}, ${COLOR:code})' } },
  { id: 'drone_led_mode', cat: 'hardware', hw: true, group: 'LED', shape: 'stack', tpl: '드론 LED %COLOR %MODE %VAL',
    params: { COLOR: { kind: 'dropdown', options: COLORS, def: 'RED' }, MODE: { kind: 'dropdown', options: LED_MODES, def: 'HOLD' }, VAL: { kind: 'value', def: 255 } },
    code: { entryPy: 'Drone.led_mode("${COLOR}", "${MODE}", ${VAL})', py: 'drone.sendLightModeColor(${MODE:code}, ${VAL}, ${COLOR:code})' }, help: '켜짐: 밝기 0~255 / 깜빡임: 간격 100~1000(ms) / 무지개2: 속도 1~10' },
  { id: 'drone_led_rgb', cat: 'hardware', hw: true, group: 'LED', shape: 'stack', tpl: '드론 LED R %R , G %G , B %B %MODE %VAL',
    params: { R: { kind: 'value', def: 255 }, G: { kind: 'value', def: 255 }, B: { kind: 'value', def: 255 }, MODE: { kind: 'dropdown', options: LED_MODES, def: 'HOLD' }, VAL: { kind: 'value', def: 250 } },
    code: { entryPy: 'Drone.led_rgb(${R}, ${G}, ${B}, "${MODE}", ${VAL})', py: 'drone.sendLightModeColor(${MODE:code}, ${VAL}, ${R}, ${G}, ${B})' } },
  { id: 'controller_note', cat: 'hardware', hw: true, group: '소리', shape: 'stack', tpl: '%OCT 옥타브 %NOTE 을(를) %SEC 초 연주',
    params: { OCT: { kind: 'dropdown', options: OCT, def: '5' }, NOTE: { kind: 'dropdown', options: NOTES, def: 'G' }, SEC: { kind: 'value', def: 1 } },
    code: { entryPy: 'Drone.play_note(${OCT}, "${NOTE}", ${SEC})', py: (p) => `drone.sendBuzzerScale(BuzzerScale.${p.NOTE}${p.OCT}, ${p.SEC} * 1000); sleep(${p.SEC})` }, help: '조종기 버저로 연주' },
  { id: 'controller_vibrate', cat: 'hardware', hw: true, group: '소리', shape: 'stack', tpl: '진동 %SEC 초 켜기',
    params: { SEC: { kind: 'value', def: 1 } },
    code: { entryPy: 'Drone.vibrate(${SEC})', py: 'drone.sendVibrator(${SEC} * 1000, 0, ${SEC} * 1000)' }, help: '조종기 진동 — 배터리 경고 등에 활용' },
  { id: 'controller_vibrate_reserve', cat: 'hardware', hw: true, group: '소리', shape: 'stack', tpl: '진동 %SEC 초 예약',
    params: { SEC: { kind: 'value', def: 1 } },
    code: { entryPy: 'Drone.vibrate_reserve(${SEC})', py: 'drone.sendVibratorReserve(${SEC} * 1000, 0, ${SEC} * 1000)' } },
  // ---- 센서 값 ----
  { id: 'drone_value', cat: 'hardware', hw: true, group: '센서', shape: 'value', tpl: '%S',
    params: { S: { kind: 'dropdown', options: VALUES, def: 'battery' } },
    code: { entryPy: 'Drone.value("${S}")', py: '${S:code}' }, help: '각도(°)·가속도·각속도·위치(m)·해발고도(m)·배터리(%)' },
];

export const TORY_PY_HEADER = `from time import sleep\nimport random, time\nfrom CodingRider.drone import *\nfrom CodingRider.protocol import *\n\ndrone = Drone()\ndrone.open()          # 조종기(USB-SERIAL CH340) 포트 자동 탐색. 필요하면 drone.open('COM3')\nsleep(1)\nwait = lambda ms: sleep(ms / 1000)   # 엔트리 '초 기다리기' 대응\nstart_time = time.time()\n`;
export const TORY_PY_FOOTER = `\ndrone.close()`;
