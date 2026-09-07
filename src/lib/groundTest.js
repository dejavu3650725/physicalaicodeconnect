// ============================================================
// 지상 테스트 버전 — 토리드론 비행 블록을 LED·부저·진동 신호로 바꿔, 바닥에 둔 채 코드 논리를 검증한다
//  (비행 5~6분/충전 40분인 배터리를 아끼고, 첫 실행의 안전을 확보하기 위한 진입장벽 낮추기)
//  구조(반복·조건·변수·센서)는 그대로 두고 "몸으로 움직이는 블록"만 신호 블록으로 치환한다.
// ============================================================

const led = (COLOR, MODE = 'ON') => ({ type: 'drone_led_simple', params: { COLOR, MODE } });
const note = (NOTE, SEC = 0.5, OCT = '5') => ({ type: 'controller_note', params: { OCT, NOTE, SEC } });
const vib = (SEC) => ({ type: 'controller_vibrate', params: { SEC } });
const wait = (SEC) => ({ type: 'wait_second', params: { SEC } });

const DIR_SIGNAL = { FORWARD: ['BLUE', 'E'], BACKWARD: ['YELLOW', 'C'], RIGHT: ['MAGENTA', 'G'], LEFT: ['CYAN', 'D'], UP: ['WHITE', 'A'], DOWN: ['SUNSET', 'F'] };

/** 블록 하나 → 지상 신호 블록 배열 (치환 대상이 아니면 null) */
function mapBlock(b) {
  const p = b.params || {};
  switch (b.type) {
    case 'drone_takeoff': return [led('GREEN'), note('G', 0.5), note('B', 0.5, '5')];
    case 'drone_landing': return [led('RED'), note('E', 0.5), note('C', 0.6)];
    case 'drone_stop': return [led('RED', 'OFF'), vib(0.3)];
    case 'drone_move_dir': { const [c, n] = DIR_SIGNAL[p.DIR] || ['WHITE', 'G']; const sec = Math.max(0.3, Math.min(2, Number(p.M) || 1)); return [led(c), note(n, sec)]; }
    case 'drone_turn': return [led('LAVENDER'), note(p.DIR === 'CCW' ? 'D' : 'A', 0.6)];
    case 'drone_move_xyz': return [led('WHITE'), vib(0.5), wait(1)];
    case 'drone_axis_run': case 'drone_quad_run': { const sec = Math.max(0.3, Math.min(3, Number(p.SEC) || 1)); return [led('EMERALD'), vib(sec)]; }
    case 'drone_axis_set': case 'drone_quad_set': return [led('MUSCAT', 'B50')];
    case 'drone_reset_heading': case 'drone_headless': return [led('COTTONCANDY'), note('C', 0.2)];
    default: return null;
  }
}

/** 트리 전체 치환. 반환: { blocks, replaced } */
export function toGroundTest(blocks) {
  let replaced = 0;
  const walk = (list) => {
    const out = [];
    for (const b of list || []) {
      const m = mapBlock(b);
      if (m) { replaced += 1; out.push(...m); continue; }
      const nb = { ...b };
      if (b.children) nb.children = walk(b.children);
      if (b.elseChildren) nb.elseChildren = walk(b.elseChildren);
      out.push(nb);
    }
    return out;
  };
  return { blocks: walk(blocks), replaced };
}

export const GROUND_LEGEND = [
  ['이륙', '🟢 초록 LED + 솔·시 ♪'], ['착륙', '🔴 빨강 LED + 미·도 ♪'], ['정지', 'LED 끄기 + 진동'],
  ['앞/뒤/오른쪽/왼쪽/위/아래 이동', '🔵파랑 / 🟡노랑 / 🟣자홍 / 🩵하늘 / ⚪흰색 / 🟠노을 LED + 음'],
  ['회전', '💜 라벤더 LED'], ['% 실행·좌표 이동', '에메랄드/흰색 LED + 진동'],
];
