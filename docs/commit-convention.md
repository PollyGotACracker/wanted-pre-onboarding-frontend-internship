# Commit Convention

- Udacity Git Commit Message Style Guide 를 바탕으로 작성한다.

## 커밋 메시지 구조

```
방법1. type[(scope)]: subject [(#issueNumber)]
방법2. type: [#issueNumber - ] subject

[body]

[footer]

* [ ] 는 선택사항
```

### type

- feat: 새로운 기능 추가
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅. 세미콜론 누락 등(코드 변경이 없는 경우)
- refactor: 코드 리팩토링
- test: 테스트 코드의 추가 또는 리팩토링
- chore: 빌드 작업이나 패키지 매니저 설정 등(production 코드 변경이 없을 때)

- 추가 type?
  - design: UI 디자인 변경
  - rename: 파일, 폴더의 이름 수정 또는 이동
  - remove: 파일 삭제
  - BREAKING CHANGE: 중요 API의 변경
  - HOTFIX: 치명적인 버그를 급하게 고쳐야 하는 경우
  - comment: 주석 추가 또는 변경
  - build: 빌드 관련 파일 수정

### scope

```
fix(forms):
feat(inputHandler):
```

- 구체적으로 무엇이 변경되었는지 작성

### issueNumber

- 이슈 번호 추가

### subject

- `수정`, `변경`, `추가` 처럼 구문으로 작성
- 50자 이하로 작성
- 마침표를 찍지 않을 것
- 영어로 작성할 경우 첫 글자는 대문자

### body

- 상단에 빈 줄을 추가하여 구분할 것
- 무엇을, 왜 했는지 작성
- 72자 단위로 개행

### footer

```
Fixes: #1234
```

- 상단에 빈 줄을 추가하여 구분할 것
- 해당 커밋의 참조 정보 추가
- 여러 개의 이슈번호는 ,(comma)로 구분
- 이슈 트래커 유형:
  - Fixes: 이슈 수정 중
  - Resolves: 이슈 해결
  - Ref: 참조할 이슈가 있을 때
  - Related to: 해당 커밋과 관련된 이슈번호(아직 해결되지 않은 이슈)
