/** @type {import('jest').Config} */
const config = {
  // # Setup
  preset: "ts-jest", // Jest config의 기반이 되는 프리셋
  // roots: ["<rootDir>"],

  // # 테스트 환경
  testEnvironment: "node",

  // # 테스트 범위
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"], // Jest가 테스트 파일을 감지하는 데 사용하는 글로브 패턴
  testPathIgnorePatterns: ["\\\\.yarn\\\\", "\\\\node_modules\\\\"],

  // # 모듈
  moduleDirectories: [".yarn"], // 필요 모듈을 재귀적으로 검색할 디렉토리 이름 배열
  moduleFileExtensions: ["ts", "js", "json", "node"], // 모듈이 사용하는 파일 확장자 배열(자주 사용되는 확장자를 왼쪽에 배치)
  moduleNameMapper: {
    "@jinhyeong/js-result": "<rootDir>/src/index.ts",
  }, // 정규식에서 모듈 이름 또는 모듈 이름 배열로 매핑하여 단일 모듈로 리소스를 스텁아웃

  // # Mock
  clearMocks: true, // 모든 테스트 전에 `mock`의 호출, 인스턴스, 컨텍스트 및 결과를 자동으로 삭제

  // # Coverage
  collectCoverage: false, // // 테스트 실행 중 커버리지 정보 수집 여부
  collectCoverageFrom: ["src/**/*.ts"], // 커버리지 정보를 수집할 파일 집합을 나타내는 배열(글로브 패턴)
  coveragePathIgnorePatterns: ["\\\\node_modules\\\\"], // 커버리지 수집 스킵 배열(정규식 패턴)
  coverageProvider: "v8",

  // # Verbose
  verbose: false,

  // # ETC
  errorOnDeprecated: false, // 더 이상 사용되지 않는 API를 호출하면 오류 메시지가 표시

  // 테스트가 오래걸리는 코드가 있을 때 사용
  // fakeTimers: {
  //   enableGlobally: false,
  // },

  // 테스트를 실행하는 데 사용되는 최대 작업자 수(% 혹은 숫자로 지정)
  // 예: maxWorkers: 10%는 CPU 사용량의 10% + 1을 최대 작업자 수로 사용합니다. maxWorkers: 2는 최대 2명의 작업자를 사용
  // maxWorkers: "50%",

  // slowTestThreshold: 5, // 정해진 시간을 초과하는 테스트를 보고함(값: second)
};

module.exports = config;
