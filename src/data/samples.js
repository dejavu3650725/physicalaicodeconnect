// AI 호출 없이도 바로 볼 수 있는 예시 설계 (카탈로그 id만 사용)
const cmp = (A, OP, B) => ({ type: 'boolean_basic_operator', params: { A, OP, B } });
const hv = (V) => ({ type: 'hamster_value', params: { V } });

export const SAMPLES = {
  hamster: {
    platformKey: 'entry-hamster', idea: '장애물을 피하는 AI 배달 로봇',
    title: '똑똑 배달 햄스터', summary: '앞에 장애물이 있으면 피해 가고, 손 모양 신호를 보면 멈추는 배달 로봇을 만들어요.',
    edgeCase: null, realWorld: '자율주행 배달 로봇(서빙 로봇)은 거리 센서로 장애물을 감지해 경로를 바꿉니다.', lessonLink: '교육청 자료 [중급] 엔트리 AI 햄스터 자동차 3차시(손 인식으로 제어)와 연결',
    variables: [{ name: '위험거리', value: 40, desc: '근접 센서 값이 이보다 크면 장애물이 가까운 것으로 판단(0~255)' }, { name: '속도', value: 30, desc: '바퀴 속도(%). 너무 빠르면 회피가 늦어요' }],
    levels: {
      basic: { goal: '순서대로 움직이고 LED·소리로 배달 완료를 알려요.', ctConcepts: ['순차'], tryThis: '앞으로 가는 초를 2초로 바꾸고 거리가 어떻게 달라지는지 재 보세요.',
        explanation: '배달 로봇의 첫걸음은 **순서대로 움직이기**예요. 앞으로 1초, 오른쫽으로 돌고, 다시 앞으로! 도착하면 **양쪽 LED**를 초록으로 켜고 **삐 소리**로 "배달 완료!"를 알려요.'.replace('오른쫽', '오른쪽'),
        blocks: [{ type: 'when_run_button_click', params: {}, children: [
          { type: 'hamster_move_forward_for_secs', params: { SEC: 1 } },
          { type: 'hamster_turn_for_secs', params: { DIR: 'RIGHT', SEC: 0.5 } },
          { type: 'hamster_move_forward_for_secs', params: { SEC: 1 } },
          { type: 'hamster_set_led_to', params: { SIDE: 'BOTH', COLOR: '2' } },
          { type: 'hamster_beep', params: {} },
          { type: 'hamster_stop', params: {} },
        ] }] },
      standard: { goal: '근접 센서 값을 판단해 장애물을 피해요.', ctConcepts: ['반복', '조건', '변수'], tryThis: '위험거리 변수를 20으로 줄이면 어떤 일이 생길까요? 너무 늦게 피하지 않나요?',
        explanation: '**계속 반복하기** 안에서 **왼쪽 근접 센서** 값을 계속 확인해요. 값이 **위험거리보다 크면** 장애물이 가까운 거예요! 그러면 뒤로 살짝 물러나 오른쪽으로 돌고, 아니면 계속 앞으로 가요. 센서 → 판단 → 동작, 이게 로봇의 기본 원리!',
        blocks: [{ type: 'when_run_button_click', params: {}, children: [
          { type: 'set_variable', params: { VAR: '위험거리', VALUE: 40 } },
          { type: 'set_variable', params: { VAR: '속도', VALUE: 30 } },
          { type: 'repeat_inf', params: {}, children: [
            { type: 'if_else', params: { COND: { type: 'boolean_and_or', params: { A: cmp(hv('leftProximity'), 'GREATER', { type: 'get_variable', params: { VAR: '위험거리' } }), OP: 'OR', B: cmp(hv('rightProximity'), 'GREATER', { type: 'get_variable', params: { VAR: '위험거리' } }) } } },
              children: [
                { type: 'hamster_set_led_to', params: { SIDE: 'BOTH', COLOR: '4' } },
                { type: 'hamster_move_backward_for_secs', params: { SEC: 0.5 } },
                { type: 'hamster_turn_for_secs', params: { DIR: 'RIGHT', SEC: 0.6 } },
              ],
              elseChildren: [
                { type: 'hamster_set_led_to', params: { SIDE: 'BOTH', COLOR: '2' } },
                { type: 'hamster_set_both_wheels_to', params: { L: { type: 'get_variable', params: { VAR: '속도' } }, R: { type: 'get_variable', params: { VAR: '속도' } } } },
              ] },
          ] },
        ] }] },
      advanced: { goal: 'PC 카메라의 손 인식 결과로 로봇을 제어해요.', ctConcepts: ['인공지능 인식', '조건 분기', '추상화'], tryThis: '"엄지 위로"를 인식하면 배달 완료 노래를 연주하도록 블록을 추가해 보세요.',
        explanation: '엔트리의 **인공지능 > 비디오 감지** 블록은 이미 학습된 AI예요. **손 인식 시작하기** 후 **1번째 손의 모양이 편 손인가?**를 판단해 "정지!" 신호로 쓰고, **주먹**이면 다시 출발해요. 우리가 규칙을 짜지 않아도 AI가 손 모양을 알아보는 것이 **기계학습**의 힘!',
        blocks: [{ type: 'when_run_button_click', params: {}, children: [
          { type: 'ai_video_toggle', params: { MODE: 'on' } },
          { type: 'ai_recognition_toggle', params: { MODEL: 'hand', ACT: 'on' } },
          { type: 'ai_recognition_show', params: { MODEL: 'hand', MODE: 'on' } },
          { type: 'repeat_inf', params: {}, children: [
            { type: '_if', params: { COND: { type: 'ai_hand_gesture', params: { N: '1', G: 'open' } } }, children: [
              { type: 'hamster_stop', params: {} },
              { type: 'hamster_set_led_to', params: { SIDE: 'BOTH', COLOR: '4' } },
              { type: 'dialog_time', params: { TEXT: '정지 신호 확인!', SEC: 1, MODE: 'speak' } },
            ] },
            { type: '_if', params: { COND: { type: 'ai_hand_gesture', params: { N: '1', G: 'fist' } } }, children: [
              { type: 'hamster_set_led_to', params: { SIDE: 'BOTH', COLOR: '2' } },
              { type: 'hamster_set_both_wheels_to', params: { L: 30, R: 30 } },
            ] },
            { type: '_if', params: { COND: cmp(hv('leftProximity'), 'GREATER', 40) }, children: [
              { type: 'hamster_turn_for_secs', params: { DIR: 'RIGHT', SEC: 0.5 } },
            ] },
          ] },
        ] }] },
    },
  },
  microbit: {
    platformKey: 'makecode-microbit', idea: '걸음 수를 세는 스마트워치(만보기)',
    title: '손목 위 만보기 워치', summary: '흔들림을 감지해 걸음을 세고, 목표를 달성하면 축하 멜로디가 나오는 스마트워치를 만들어요.',
    edgeCase: null, realWorld: '스마트워치의 걸음 수 측정은 가속도 센서의 흔들림 패턴을 세는 원리예요.', lessonLink: '교육청 자료 [초급] 마이크로비트 센서 탐색(가속도) 활동과 연결',
    variables: [{ name: 'steps', value: 0, desc: '걸음 수' }, { name: 'goal', value: 100, desc: '목표 걸음 수. 수업 시간엔 20으로 낮춰 테스트!' }],
    levels: {
      basic: { goal: '버튼으로 아이콘과 숫자를 출력해요.', ctConcepts: ['이벤트', '순차'], tryThis: 'B 버튼을 누르면 다른 아이콘이 나오게 바꿔 보세요.',
        explanation: '**시작하면** 하트를 보여 주고, **A 버튼 누를 때** 숫자 0을 출력해요. 마이크로비트는 **이벤트**(버튼·흔들림)가 생기면 그 안의 블록을 실행하는 컴퓨터예요.',
        blocks: [{ type: 'on_start', params: {}, children: [{ type: 'show_icon', params: { I: 'Heart' } }] },
          { type: 'on_button_pressed', params: { B: 'A' }, children: [{ type: 'show_number', params: { V: 0 } }] },
          { type: 'on_button_pressed', params: { B: 'B' }, children: [{ type: 'show_icon', params: { I: 'Happy' } }, { type: 'pause', params: { MS: 500 } }, { type: 'clear_screen', params: {} }] }] },
      standard: { goal: '흔들림 이벤트로 변수 steps를 1씩 늘리고 표시해요.', ctConcepts: ['변수', '이벤트', '조건'], tryThis: 'goal을 20으로 바꾸고 20걸음 걸으면 어떤 일이 생기는지 확인!',
        explanation: '**흔들림 감지될 때** steps를 1 증가시켜요. **A 버튼**으로 현재 걸음 수를 확인하고, **무한반복**에서 steps가 goal 이상이면 **하트**를 보여 줘요. 변수는 로봇의 **기억 상자**!',
        blocks: [{ type: 'on_start', params: {}, children: [{ type: 'set_variable', params: { VAR: 'steps', V: 0 } }, { type: 'set_variable', params: { VAR: 'goal', V: 100 } }, { type: 'show_icon', params: { I: 'Heart' } }] },
          { type: 'on_gesture', params: { G: 'Shake' }, children: [{ type: 'change_variable', params: { VAR: 'steps', V: 1 } }, { type: 'plot_bar_graph', params: { V: { type: 'get_variable', params: { VAR: 'steps' } }, MAX: { type: 'get_variable', params: { VAR: 'goal' } } } }] },
          { type: 'on_button_pressed', params: { B: 'A' }, children: [{ type: 'show_number', params: { V: { type: 'get_variable', params: { VAR: 'steps' } } } }] },
          { type: 'forever', params: {}, children: [{ type: 'if', params: { COND: { type: 'compare', params: { A: { type: 'get_variable', params: { VAR: 'steps' } }, OP: '>=', B: { type: 'get_variable', params: { VAR: 'goal' } } } } }, children: [{ type: 'show_icon', params: { I: 'Heart' } }, { type: 'play_melody', params: { M: 'C5 B A G F E D C ', T: 180 } }, { type: 'set_variable', params: { VAR: 'steps', V: 0 } }] }] }] },
      advanced: { goal: '온도·소리 센서와 라디오로 친구 워치와 데이터를 나눠요.', ctConcepts: ['센서 데이터', '통신', '조건'], tryThis: '라디오 그룹 번호를 짝과 같은 번호로 맞추고, 상대 걸음 수가 오면 하트가 뜨는지 확인!',
        explanation: '**A+B 버튼**을 누르면 내 걸음 수를 **라디오로 전송**하고, 친구 워치는 **라디오 숫자 수신시** 받은 수를 보여 줘요. **온도(°C)**가 30을 넘으면 해골 아이콘으로 "더워요!" 경고. 실제 스마트워치도 센서 데이터를 폰과 **무선 통신**으로 나눠요. (AI 확장: microbit.org CreateAI로 걷기/뛰기 동작을 학습시켜 인식 모델을 넣을 수 있어요)',
        blocks: [{ type: 'on_start', params: {}, children: [{ type: 'radio_set_group', params: { G: 7 } }, { type: 'set_variable', params: { VAR: 'steps', V: 0 } }] },
          { type: 'on_gesture', params: { G: 'Shake' }, children: [{ type: 'change_variable', params: { VAR: 'steps', V: 1 } }] },
          { type: 'on_button_pressed', params: { B: 'AB' }, children: [{ type: 'radio_send_number', params: { V: { type: 'get_variable', params: { VAR: 'steps' } } } }, { type: 'show_icon', params: { I: 'Yes' } }] },
          { type: 'radio_on_received_number', params: {}, children: [{ type: 'show_string', params: { S: 'FRIEND' } }, { type: 'show_number', params: { V: { type: 'received_number', params: {} } } }, { type: 'show_icon', params: { I: 'Heart' } }] },
          { type: 'forever', params: {}, children: [{ type: 'if_else', params: { COND: { type: 'compare', params: { A: { type: 'temperature', params: {} }, OP: '>', B: 30 } } }, children: [{ type: 'show_icon', params: { I: 'Skull' } }], elseChildren: [{ type: 'if', params: { COND: { type: 'compare', params: { A: { type: 'sound_level', params: {} }, OP: '>', B: 180 } } }, children: [{ type: 'show_icon', params: { I: 'Surprised' } }, { type: 'play_sound_effect', params: { E: 'giggle' } }] }] }, { type: 'pause', params: { MS: 200 } }] }] },
    },
  },
  tory: {
    platformKey: 'entry-tory', idea: '손 모양으로 이륙·착륙하는 구조 드론',
    title: '손짓 구조 드론', summary: '이륙해 사각형으로 순찰하고, 손 모양(편 손)을 보면 착륙하는 드론 프로그램이에요.',
    edgeCase: null, realWorld: '구조·순찰 드론은 정해진 경로를 비행하고 신호에 따라 복귀해요.', lessonLink: '',
    variables: [{ name: '비행거리', value: 0.5, desc: '한 변의 길이(m). 실내에서는 0.5m 이하로!' }, { name: '속도', value: 0.5, desc: '이동 속도(m/s)' }],
    levels: {
      basic: { goal: '이륙 → 앞으로 → 착륙, 안전한 순차 비행.', ctConcepts: ['순차', '안전'], tryThis: '착륙 전에 LED를 파랑 깜빡임으로 바꿔 "복귀 중" 신호를 만들어 보세요.',
        explanation: '드론 코딩의 첫 규칙은 **이륙 → 동작 → 착륙**! 이륙 뒤 2초 기다려 안정되게 하고, **앞으로 0.5m** 이동한 뒤 **착륙**해요. 항상 프로펠러 안전망을 확인하고 사람과 거리를 두어야 해요.',
        blocks: [{ type: 'when_run_button_click', params: {}, children: [
          { type: 'drone_light_color_select', params: { COLOR: 'GREEN', MODE: 'HOLD', INTERVAL: 100 } },
          { type: 'drone_takeoff', params: {} }, { type: 'wait_second', params: { SEC: 2 } },
          { type: 'drone_move_dir', params: { DIR: 'FORWARD', M: 0.5, V: 0.5 } }, { type: 'wait_second', params: { SEC: 2 } },
          { type: 'drone_landing', params: {} }] }] },
      standard: { goal: '반복으로 사각형 순찰 비행을 하고 센서 값을 확인해요.', ctConcepts: ['반복', '조건', '센서'], tryThis: '4번 반복을 3번으로 바꾸면 어떤 도형이 될까요?',
        explanation: '**4번 반복하기** 안에 "앞으로 이동 → 시계 방향 90도 회전"을 넣으면 **사각형 순찰**! 이동 중 **바닥과의 거리**가 1.5m를 넘으면 너무 높은 것이니 LED를 빨강으로 경고해요.',
        blocks: [{ type: 'when_run_button_click', params: {}, children: [
          { type: 'set_variable', params: { VAR: '비행거리', VALUE: 0.5 } },
          { type: 'drone_takeoff', params: {} }, { type: 'wait_second', params: { SEC: 2 } },
          { type: 'repeat_basic', params: { N: 4 }, children: [
            { type: 'drone_move_dir', params: { DIR: 'FORWARD', M: { type: 'get_variable', params: { VAR: '비행거리' } }, V: 0.5 } },
            { type: 'drone_turn', params: { DIR: 'CW', DEG: 90, V: 45 } },
            { type: '_if', params: { COND: cmp({ type: 'drone_value', params: { S: 'range_height' } }, 'GREATER', 1.5) }, children: [{ type: 'drone_light_color_select', params: { COLOR: 'RED', MODE: 'FLICKER', INTERVAL: 100 } }] },
          ] },
          { type: 'drone_landing', params: {} }] }] },
      advanced: { goal: 'PC 카메라 손 인식 결과로 드론을 조종해요.', ctConcepts: ['인공지능 인식', '이벤트', '안전 설계'], tryThis: '"엄지 아래로"면 비상 착륙, "브이"면 LED 무지개가 켜지도록 확장해 보세요.',
        explanation: '**손 인식 시작하기** 후 **편 손**이면 착륙, **주먹**이면 이륙! 인공지능이 손 모양을 판단하고, 드론은 그 결과에 따라 움직여요. 사람 대신 AI가 **조종사**가 되는 셈이죠. 안전을 위해 착륙 조건을 항상 먼저 확인하도록 순서를 짰어요.',
        blocks: [{ type: 'when_run_button_click', params: {}, children: [
          { type: 'ai_video_toggle', params: { MODE: 'on' } }, { type: 'ai_recognition_toggle', params: { MODEL: 'hand', ACT: 'on' } },
          { type: 'set_variable', params: { VAR: '비행중', VALUE: 0 } },
          { type: 'repeat_inf', params: {}, children: [
            { type: '_if', params: { COND: { type: 'boolean_and_or', params: { A: { type: 'ai_hand_gesture', params: { N: '1', G: 'open' } }, OP: 'AND', B: cmp({ type: 'get_variable', params: { VAR: '비행중' } }, 'EQUAL', 1) } } }, children: [
              { type: 'drone_landing', params: {} }, { type: 'set_variable', params: { VAR: '비행중', VALUE: 0 } }, { type: 'drone_light_color_select', params: { COLOR: 'BLUE', MODE: 'HOLD', INTERVAL: 100 } }] },
            { type: '_if', params: { COND: { type: 'boolean_and_or', params: { A: { type: 'ai_hand_gesture', params: { N: '1', G: 'fist' } }, OP: 'AND', B: cmp({ type: 'get_variable', params: { VAR: '비행중' } }, 'EQUAL', 0) } } }, children: [
              { type: 'drone_takeoff', params: {} }, { type: 'set_variable', params: { VAR: '비행중', VALUE: 1 } }, { type: 'drone_light_color_select', params: { COLOR: 'GREEN', MODE: 'HOLD', INTERVAL: 100 } }] },
            { type: 'wait_second', params: { SEC: 0.5 } },
          ] } ] }] },
    },
  },
  spike: {
    platformKey: 'spike-prime', idea: '쓰레기를 인식해 분류하는 수거 로봇',
    title: '분류왕 수거 로봇', summary: '검은 선을 따라 이동하고 색을 구분해 멈추며, AI 모델의 분류 결과로 로봇팔을 움직이는 수거 로봇이에요.',
    edgeCase: null, realWorld: '재활용 선별장에서는 카메라 AI가 페트병·캔을 인식해 자동으로 분류해요.', lessonLink: '교육청 자료 [중급] 레고 스파이크 프라임 사회문제 해결 프로젝트(쓰레기 수거) 2~3차시와 연결',
    variables: [{ name: '속도', value: 50, desc: '동작 속도(%)' }],
    levels: {
      basic: { goal: '드라이빙 베이스를 순서대로 움직여요.', ctConcepts: ['순차'], tryThis: '10cm를 20cm로 바꾸고 실제 거리를 재 보세요. 바퀴 둘레가 왜 중요할까요?',
        explanation: '**동작 모터를 C+D로 정하기**로 두 모터를 한 팀으로 만들고 **↑ 방향으로 10cm 움직이기**, **오른쪽으로 90도 회전**을 순서대로 실행해요. 라이트 매트릭스에 하트를 켜서 완료를 알려요.',
        blocks: [{ type: 'when_program_starts', params: {}, children: [
          { type: 'set_movement_motors', params: { PAIR: 'C+D' } }, { type: 'set_movement_speed', params: { V: 50 } },
          { type: 'move_for', params: { DIR: 'FWD', V: 10, UNIT: 'CM' } }, { type: 'steer_for', params: { SIDE: 'R', STEER: 100, V: 0.5, UNIT: 'ROT' } },
          { type: 'move_for', params: { DIR: 'FWD', V: 10, UNIT: 'CM' } }, { type: 'light_image_for', params: { IMG: 'HEART', SEC: 2 } }] }] },
      standard: { goal: '컬러 센서로 선을 따라가고 거리 센서로 멈춰요.', ctConcepts: ['반복', '조건', '센서'], tryThis: '거리 10cm를 5cm로 바꾸면 더 가까이 가서 멈추나요? 안전한 거리는 얼마일까요?',
        explanation: '**무한 반복하기** 속에서 **B의 색상이 검은색인가?**를 판단해 검은 선이면 오른쪽으로, 아니면 왼쪽으로 살짝 조향하면 선을 따라가요(지그재그 라인트레이싱). **A가 10cm보다 가까우면** 쓰레기(장애물) 앞에서 **이동 멈추기**!',
        blocks: [{ type: 'when_program_starts', params: {}, children: [
          { type: 'set_movement_motors', params: { PAIR: 'C+D' } },
          { type: 'forever', params: {}, children: [
            { type: 'if_else', params: { COND: { type: 'distance_closer', params: { P: 'A', D: 10, CMP: 'CLOSER' } } }, children: [
              { type: 'stop_moving', params: {} }, { type: 'beep_for', params: { N: 72, SEC: 0.3 } }, { type: 'light_image_for', params: { IMG: 'YES', SEC: 1 } }],
              elseChildren: [
                { type: 'if_else', params: { COND: { type: 'color_is', params: { P: 'B', C: 'BLACK' } } }, children: [{ type: 'start_steering', params: { SIDE: 'R', STEER: 30 } }], elseChildren: [{ type: 'start_steering', params: { SIDE: 'L', STEER: -30 } }] }] },
          ] }] }] },
      advanced: { goal: 'AI 이거다 분류 결과에 따라 로봇팔과 이동을 제어해요.', ctConcepts: ['기계학습 분류', '조건 분기', '신뢰도'], tryThis: '클래스 "can"을 추가 학습시키고, 캔이면 왼쪽으로 돌아 다른 상자에 넣도록 확장!',
        explanation: '**로봇조종 분류 결과 요청하기**를 반복해서 최신 결과를 받아요. 결과가 **go**면 전진, **stop**이면 멈춤, **arm**이면 **E 모터**로 로봇팔을 들었다 내려요. 신뢰도가 70% 이상일 때만 움직이면 AI의 실수를 줄일 수 있어요!',
        blocks: [{ type: 'when_program_starts', params: {}, children: [
          { type: 'set_movement_motors', params: { PAIR: 'C+D' } },
          { type: 'forever', params: {}, children: [
            { type: 'ai_request_result', params: { MODEL: '로봇조종' } },
            { type: 'if', params: { COND: { type: 'and_or', params: { A: { type: 'ai_result_is', params: { MODEL: '로봇조종', CLS: 'go' } }, OP: 'and', B: { type: 'compare', params: { A: { type: 'ai_confidence', params: { MODEL: '로봇조종', CLS: 'go' } }, OP: '>', B: 70 } } } } }, children: [{ type: 'start_moving', params: { DIR: 'FWD' } }] },
            { type: 'if', params: { COND: { type: 'ai_result_is', params: { MODEL: '로봇조종', CLS: 'stop' } } }, children: [{ type: 'stop_moving', params: {} }] },
            { type: 'if', params: { COND: { type: 'ai_result_is', params: { MODEL: '로봇조종', CLS: 'arm' } } }, children: [
              { type: 'motor_run_for', params: { P: 'E', DIR: 'CW', V: 0.5, UNIT: 'ROT' } }, { type: 'wait_seconds', params: { SEC: 1 } }, { type: 'motor_run_for', params: { P: 'E', DIR: 'CCW', V: 0.5, UNIT: 'ROT' } }, { type: 'wait_seconds', params: { SEC: 1 } }] },
          ] }] }] },
    },
  },
};
