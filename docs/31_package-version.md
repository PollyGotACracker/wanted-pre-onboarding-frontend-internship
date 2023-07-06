# Package Version

- `npm install` 은 package.json 을 기준으로 의존성 설치
- `npm ci`(clean install) 는 package-lock.json 을 기준으로 의존성 설치(더 안정적인 install)
- package.json 은 `^`, `~` 가 포함되지만 package-lock.json 은 그렇지 않다.
- 따라서 package.json 은 허용되는 범위가 존재하지만, package-lock.json 은 해당 버전만 install 하도록 한다.

---

## Tilde(~)

- 마지막 자리수 version 까지만 업데이트하도록 허용(자주 쓰이지 않음)

## Caret(^)

- Semantic Versioning 을 따른다는 가정 하에 작동, `npm install` 시 기본적으로 적용되는 버전 표기
- 기본적으로 minor version update 까지만 허용(호환성 문제 발생하지 않음)
- minor version 이 1 이하인 경우(정식 버전이 아님):
  - 0.1 이상 버전의 경우: patch update 까지 허용
  - 0.1 이하 버전의 경우: 기입된 버전만 허용
- 심각한 issue 의 bug fix 상황을 고려하면서, 호환성 문제가 발생하는 상황을 막기 위해 install 허용 범위를 정해놓은 것이다.

---

## Semantic Versioning

- NPM 은 Semantic Versioning 이란 버전 표기법을 따른다.  
  `major.minor.patch`:

  - major: breaking change 를 포함한 변경 포함 업데이트
  - minor: breaking change 가 없는 변경이 포함된 업데이트(기능 추가 등)
  - patch: breaking change 가 없는 bug fix

- breaking change: 이전 버전과 호환이 되지 않는(break) 변경사항 발생
