module.exports = {
  // 한 line 의 최대 글자 수. 넘어가면 줄바꿈
  // 기본값 80
  printWidth: 80,

  // tab 당 공백 수
  // 기본값 2
  tabWidth: 2,

  // tab 사용 여부. tab 이 있으면 들여쓰기
  // 기본값 false
  useTabs: false,

  // 세미콜론 강제 여부
  // 기본값 true
  semi: true,

  // 객체의 속성을 따옴표로 묶는 경우
  // "as-needed": 따옴표가 필요한 속성에만 사용 (기본값)
  // "consistent": 하나 이상 속성에 따옴표가 필요하면 전체 속성에 따옴표 사용
  // "preserve": 개발자가 입력한 대로 사용
  quoteProps: 'as-needed',

  // 홑따옴표 사용 여부
  // 기본값 false(쌍따옴표 사용)
  singleQuote: true,

  // 객체, 배열, 함수 등 가능한 경우 후행쉼표 사용 여부
  // "es5": ES5 에서 유효한 경우(객체, 배열 등) 사용. TS type 파라미터에는 허용 X (기본값)
  // "none": 후행쉼표 없음
  // "all": 가능한 모든 곳에 후행쉼표 사용(함수 인수 등)
  trailingComma: 'es5',

  // 객체 리터럴 사용 시 양 괄호에 공백 삽입 여부
  // 기본값 true
  bracketSpacing: true,

  // HTML, JSX, Vue, Angular 등 마지막 `>`를 줄바꿈 하지 않을지 여부
  // 기본값 false(다음 줄로 줄바꿈)
  jsxBracketSameLine: true,

  // 화살표 함수의 매개변수가 하나일 때 소괄호로 감쌀지 여부
  // "always": 항상 괄호 포함 (기본값)
  // "avoid": 가능하면 생략
  arrowParens: 'avoid',

  // 포맷팅을 부분 적용할 파일의 시작 라인 지정
  rangeStart: 0,
  // 포맷팅을 부분 적용할 파일의 끝 라인 지정
  rangeEnd: Infinity,

  // 사용할 parser 지정
  // prettier 가 자동 유추하므로 설정 변경 필요 없음
  parser: 'babel',

  // parser 를 유추하는 데 사용할 파일명 지정
  filepath: '',

  // 파일 상단에 자동 포맷팅을 적용하는 특수주석(Pragma) 사용 여부
  //   /**
  //    * @prettier
  //    */
  //   /**
  //    * @format
  //    */
  requirePragma: false,
  // prettier 로 포맷팅되었음을 알리는 @format 마커의 사용 여부
  insertPragma: false,

  // markdown 텍스트 줄바꿈 방식
  // "always": 표시 너비를 초과하는 경우 텍스트 줄바꿈
  // "never": 각 텍스트 블록을 한 줄로 나열
  // "preserve": 텍스트를 그대로 둠
  proseWrap: 'preserve',

  // HTML, Vue, Angular 등의 공백 감도 지정
  // "css": CSS display 속성값에 따름 (기본값)
  // "strict": 모든 요소를 inline 요소처럼
  // "ignore": 모든 요소를 block 요소처럼
  htmlWhitespaceSensitivity: 'css',

  // vue 파일의 script와 style 태그 들여쓰기 여부
  // 기본값 false
  vueIndentScriptAndStyle: false,

  // 코드 문 끝의 줄바꿈 방식
  // "lf": Linux 및 macOS 및 git repos 내부에서 공통 (기본값)
  // "crlf": Windows에서 공통
  // "cr": 매우 드물게 사용됨
  // "auto": 기존 줄 끝 유지
  endOfLine: 'auto',

  // markdown 코드 블록처럼 형식이 지정된 코드에서
  // 해당 형식에 맞도록 코드를 수정할지 여부
  // "auto": 자동 수정 (기본값)
  // "off": 수정하지 않음
  embeddedLanguageFormatting: 'auto',

  // HTML, Vue 및 JSX 에서 한줄에 단일 속성 적용 여부
  // 기본값 false
  singleAttributePerLine: false,

  overrides: [
    {
      files: '*.md',
      options: {
        parser: 'markdown',
      },
    },
    {
      files: ['.eslintrc', '.prettierrc', '*.json'],
      options: { parser: 'json' },
    },
  ],
};
