# Lint, Format

## 협업을 위한 요소들

- 말로 하는 소통/문서로 하는 소통으로 구분
- 미리 정리해둔 문서 또는 실시간으로 노트에 적으며 시각화
- 개발자 간 소통: commit, PR(branch 작업), 코드

### commit message

- 작업중, 커밋, 시작, 수정 과 같은 메시지는 지양한다.  
  무엇을 왜 추가했는가? 왜 수정했는가? 코드의 목적을 작성해야 한다.
- 팀으로 작업을 진행한다면 커밋 메시지 규칙을 정해야 한다.
- `git blame <파일명.확장자>`: line 별로 누가, 언제, 어느 커밋에서 수정했는지 알 수 있다.

### history 및 branch

- 뒤죽박죽으로 되어있다면 프로젝트 history 맥락 파악이 어렵다.
- history 를 깔끔하게 유지하려고 유의미한 단위로 커밋하려 해선 안된다.  
  커밋하지 않다가 작업물을 잃어버릴 수 있으므로 커밋은 단기간으로 올린다.
- `git rebase -i HEAD~<커밋수>` 또는 `git rebase -i <커밋id>` 하여 s, squash 선택:  
  여러 불필요한 커밋을 하나로 병합. push 하지 않은 상태에서 실행 권장
- `git stash`:  
  임시 저장 명령어. 작업 도중 branch 를 전환해야 할 때 사용하여 작업물 저장

### linter, code formatter

- 코딩 스타일 자동화 툴: ESLint, Prettier
- Lintting 은 ESLint, Code Formatting 은 Prettier 에 일임하는 방식이 일반적이다.
- 자동화 될 수 없는 컨벤션은 최소화하는 것이 좋고, 문서화 시켜 그것을 기준으로 삼아야 한다.
- 한번 세팅할 땐 오래 걸리더라도 그 뒤로는 효율적으로, 빠르게 개발할 수 있다.

#### ESLint

- 일관되고, 버그를 피할 수 있는 코드를 짜기 위해 만들어진 코드 분석 툴
- 설정 커스터마이징을 허용하므로 필요한 규칙을 커스텀하여 적용 가능
- error 와 warn 2 가지 level 로 설정: 스크립트가 중단되느냐 아니냐의 차이를 갖는다. 따라서 error 는 push 를 막을 수 있다.

#### Prettier

- 코드 포맷팅 툴
- 포맷팅 룰을 커스터마이징 할 수 있다.
- 팀원 모두가 같은 포맷팅 룰을 공유할 수 있다.

#### 코딩 스타일 코드 자동화

```shell
# CRA 는 eslint 가 내장되어 있음
npm install prettier eslint eslint-config-prettier --save-dev
```

- IDE plugin(extension) 을 사용하지 않고 터미널 명령어를 실행함으로써 독립적으로 사용할 수 있다.
- 설정파일을 통해 팀원들과 설정을 공유할 수 있다.
- eslint 는 lint 기능을, prettier 는 formatting 을 담당하는 구조가 이상적이다.  
   단, eslint 는 일부 formatting 관련 rule 이 포함되어 있으므로 eslint formatting 관련 rule 을 해제해야 한다(eslint-config-prettier).
- formatting 된 상태에서 commit, lint pass 가 완료된 상태에서 push 하도록 작성한다.
  오류가 있더라도 commit 을 미리 해두는 경우가 있으므로 ESlint 는 push 전에 실행되도록 한다.

1. ESlint:

   - 커스터마이징 옵션이 많고 언어별, 환경별 세팅이 필요하므로 다소 복잡하다.
   - 프로젝트 루트 디렉토리에 .eslintrc 파일을 생성하거나, `npx eslint --init` 로 세팅한다.  
     세팅 후 확장자를 지울 경우, JSON 형식으로 코드를 수정한다.

> config: 기본으로 정의된 rule 을 사용하여 이를 확장  
> plugin: 특정 환경을 위하여 기본적으로 제공되지 않는 rule 추가

```js
// .eslintrc
// 확장자를 사용하지 않으면 JSON 형식에 주석 추가 가능

{
    "env": {
        "es6": true
    },
    "extends": ["react-app", "eslint:recommended", "prettier"],
    "rules": {
        "no-var": "error", // var 금지
        "no-multiple-empty-lines": "error", // 여러 줄 공백 금지
        "no-console": ["error", { "allow": ["warn", "error", "info"] }], // console.log 금지
        "eqeqeq": "error", // 일치 연산자 사용 필수
        "dot-notation": "error", // 가능하다면 dot notation 사용
        "no-unused-vars": "error" // 사용하지 않는 변수 금지
    }
}
```

2. Prettier:
   - [prettier: options](https://prettier.io/docs/en/options.html)
   - 프로젝트의 루트 디렉토리에 `.prettierrc.확장자` 파일을 통해 설정  
     (가능한 확장자: JS, JSON, YAML, TOML...)

```js
//.prettierrc.js

module.exports = {
  printWidth: 100, // 한 line 의 최대 글자 수, 넘어가면 줄바꿈. default 80
  singleQuote: true, // "" => ''
  arrowParens: 'avoid', // arrow function parameter 가 하나일 경우 괄호 생략
};
```

3. husky

```shell
npm install husky --save-dev
# 최초 세팅 시 .husky 폴더 생성
# .git 폴더와 같은 디렉토리에서 실행
npx husky install
```

- 신경쓰지 않고도 자동으로 적용되고, 특정 상황에서 강제 적용할 수 있도록 자동화 한다.
- 까다로운 git hook 설정 대신 npm install 과정에서 세팅한 git hook 을 쉽게 적용할 수 있다.
- lint-staged 와 결합해서 사용하는 것이 일반적이다:
  - 포맷팅 수행 뒤 git add 명령어를 자동으로 수행
  - 현재 git state 에 올라온 변경사항 대상으로만 수행

```js
// package.json
{
  // 단축어 스크립트. npm run ...
  "scripts": {
    // npm install 시 자동으로 husky install(최초 세팅 명령어와는 다름)
    "postinstall" : "husky install",
    // 현재 디렉토리 내에서 변경된 코드를 formatting 후 저장
    "format": "prettier --write --cache .",
    // 현재 디렉토리 내에서 변경된 코드에 대해 오류 검사
    "lint": "eslint --cache .",
  }
}
```

- 아래 코드는 .husky 폴더에 pre-commit 파일 및 pre-push 파일을 생성하여 명령어를 자동으로 실행하도록 한다.

```shell

npx husky add .husky/pre-commit "npm run format"
npx husky add .husky/pre-push "npm run lint"
```

- 그리고 cache 파일을 .gitignore 에 작성한다.

```js
// .gitignore
// prettiercache 는 node_modules 에 포함되어 있으므로 별도로 작성할 필요가 없다.
.eslintcache
node_modules/
```
