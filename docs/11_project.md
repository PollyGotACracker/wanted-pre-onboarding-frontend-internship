# Project

### 프로젝트의 완성도를 결정하는 요소들

1.  코드 가독성

    - formatting, 불필요한 코드, 변수명 등

2.  컴포넌트의 분리

    - 논리적 단위의 분해한 후 용도에 맞게 설계한다.
    - 컴포넌트가 어디에 사용되며 역할과 책임은 무엇인가?

3.  관심사의 분리

    - 반복되는 코드들이 적절한 단위로 추상화되고 분리되었는가?
    - 각 모듈(함수, 클래스 등)의 역할과 책임, 동작이 명확히 드러나는가?
    - 각 모듈들은 재사용 가능한 형태인가?

4.  프로젝트의 아키텍쳐 설계

    - 모듈간 의존성은 잘 설계되었는가?
    - 외부의 변화에 유연하게 대응할 수 있게 설계되었는가?

- 과제를 수행하면서 겪은 문제와 이를 해결하기 위한 고민을 작성해 둔다.

### 보기 싫은 프로젝트가 되는 이유들

1. 제대로 접근이 되지 않는 링크들

   - 브라우저의 secret mode 를 켜서 배포한 결과물을 plain 한 상태에서 확인한다.
   - 서버를 종료할 경우 관련 내용을 반드시 문서로 기록해 알려야 한다.

2. 작성되지 않은, 부실한 내용의 README

   - README 는 과제의 첫 인상이다. README 가 부실하다면 과제에 대해 설명하고 어필할 기회를 잃는 것이다.

3. 기능이 돌아가는지 확인하기 힘든 과제

   - 지원자의 PC 에서는 제대로 실행되지만, 평가자의 PC 에서는 환경이 달라 확인이 불가능하다면?
   - 내가 통제할 수 있는 환경에서 배포를 해두고 배포한 결과물에 사람들이 접근 가능하게 한다.  
     이에 접근하여 테스트하는 방법을 README 에 작성한다.
   - 환경 변수 .env 파일을 .gitignore 에 작성하여 실행이 안되는 경우에 주의한다.

4. 허가되지 않은 라이브러리의 사용

   - 허용범위 밖의 라이브러리를 사용하면 메소드 하나 때문에 코드 구현을 평가할 수 없게 되며, 지원자의 실력을 의심할 수 있다.
   - package.json 의 dependency 관리: dependency 와 devDependency 를 구분, 실제 사용하지 않은 라이브러리는 uninstall 한다.

5. 규칙성이 없는 코드의 포멧팅 및 변수명

   - 프로젝트를 처음 보는 사람이 읽고 이해하기 쉬워야 한다.
   - `x`, `y`, `info`, `data`, `foo`, `bar`, `baz`, `i`, `j`, `k` 같은 변수명은 지양한다.

6. 관리되지 않은 Git(commit history, branch)

   - Git history 가 관리되지 않고, commit message 가 중구난방하거나 의미를 알 수 없다면 협업 능력이 없는 것이다.
