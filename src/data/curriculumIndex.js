import microbitBasic from './curriculum/microbit-basic.json';
import microbitIntermediate from './curriculum/microbit-intermediate.json';
import microbitAdvanced from './curriculum/microbit-advanced.json';
import hamsterBasic from './curriculum/hamster-basic.json';
import hamsterIntermediate from './curriculum/hamster-intermediate.json';
import spikeBasic from './curriculum/spike-basic.json';
import spikeIntermediate from './curriculum/spike-intermediate.json';
import spikeAdvancedSocial from './curriculum/spike-advanced-social.json';
import spikeAdvancedHusky from './curriculum/spike-advanced-huskylens.json';
import { HARDWARE_MAP } from './hardware.js';

const RAW = [microbitBasic, microbitIntermediate, microbitAdvanced, hamsterBasic, hamsterIntermediate, spikeBasic, spikeIntermediate, spikeAdvancedSocial, spikeAdvancedHusky];

export const CURRICULUM = RAW.map((c) => {
  const hw = HARDWARE_MAP[c.hardware];
  return { ...c, hwName: hw?.short || c.hardware, hwEmoji: hw?.emoji || '📘', hwColor: hw?.color || '#64748b', sessionCount: (c.sessions || []).length, pages: c.source?.pages || '' };
});
export const CURRICULUM_MAP = Object.fromEntries(CURRICULUM.map((c) => [c.id, c]));
export const BOOK = { title: '피지컬 AI 원리를 활용한 문제해결 프로젝트 자료집', publisher: '서울특별시교육청', note: '본 교육청 담당 장학사 배포 교육자료를 JSON으로 구조화한 것입니다. 원문 표기를 최대한 그대로 옮겼습니다.' };
