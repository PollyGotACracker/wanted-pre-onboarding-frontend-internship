# SoC(Seperation of Concerns;관심사의 분리)

- 각 모듈들이 여러 관심사를 한번에 처리하지 않고, 하나의 관심사만 처리하도록 분리하는 것
  - 관심사: 하나의 모듈이 수행하고자 하는 목적. 여기서 모듈이란, 함수, 클래스 등의 단위
- 좋은 코드를 짜기 위한 가장 기본적인 원칙으로, 여러 디자인 패턴, 기법, 아키텍쳐 등의 근간이다.
- 핵심 모듈을 하나로 제한해두고 나머지는 이 모듈을 사용하는 형식으로 설계한다면,  
  동작을 변경할 때 해당 모듈만 수정하면 되므로 변화에 유연하게 대응할 수 있다.
- 이처럼 관심사를 분리하면 소프트웨어의 특정 부분이 변경되는 이유를 한 가지로 제한할 수 있게 된다.  
  따라서 기능 수정 및 확장 등 유지보수가 쉬워진다.

## 관련 개념

- 단일 책임 원칙(SRP;Single Responsibility Principle):

  - 관심사의 분리와 유사한 개념으로, 관심사를 책임으로 표현
  - 각 모듈들은 책임(수행해야 하는 동작)을 가지고 있으며, 각자 하나의 책임만을 가져야 한다는 원칙

- KISS(Keep It Simple, Stupid):
  - 각 모듈들을 간단하고 단순하게 만들어 하나의 기능만 수행하도록 만들어야 한다

## React 에서의 SoC 기법

- UI 구축 라이브러리인 React 의 핵심 관심사:
  1. UI
     - JSX 형태로 표현
  2. 로직
     - 동작으로 인한 UI 변경
     - 사용자 입력에 반응, API 호출, 스크린 변화 대응 등

### 1. Presentational - Container 패턴

- 컴포넌트를 크게 두 계층으로 분리
  - Container: 로직들을 다루는 부분으로, UI 에 관여하지 않고 오로지 UI 구성 및 변화시키는 로직에만 집중하는 컴포넌트
  - Presentational: 로직은 상관하지 않고, UI 가 어떻게 구성되어야 하는지에만 집중하는 컴포넌트
- Container 는 props 로 필요한 정보와 로직을 전달하면서 Presentational 을 return 한다.
- 단, Container 컴포넌트 내에 모든 로직이 작성되어야 하므로 관심사 분리가 어렵다.
- Custom Hook 이 등장한 후로 이 패턴은 많이 사용되지 않는다.

### 2. Custom Hook

- [react.dev: Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [codesandbox](https://codesandbox.io/s/custom-hook-example-rfnc6n?file=/src/App.js)

- `useState`, `useEffect` 등의 hook 을 사용해 로직을 구현하고, 이를 컴포넌트와는 별도로 분리한 함수
- 컴포넌트를 단순하게 하고, 동일한 로직을 여러 컴포넌트에 걸쳐서 재사용할 수 있다.
- Custom Hook 의 조건:
  - React 의 Hook 들을 호출하는 함수여야 한다.
  - 함수의 이름은 `use` 로 시작해야 한다.
- return 할 값이 많을 경우 객체 리터럴 또는 배열로 만들어 return 한다.

  - 배열:
    - index 순서만 지켜진다면 어떤 이름으로 가져오든 상관 없다.
    - 가져오려는 값의 index 를 알아야 하고, 그 순서가 지켜져야 한다. 그러므로 return 하는 값이 많다면 배열은 부적합하다.
    - state-setState 처럼, 값-변경함수 로 이루어진 tuple 형태로 주로 쓰인다.
  - 객체:
    - key 만 알고 있다면 값을 가져올 수 있다.
    - 가져오는 이름(key)은 변경할 수 없다.

#### :pushpin: Context API 와의 차이점

- 목적: Context API 는 props 전달을 용이하게 하려는 목적으로 사용되며, Custom Hook 은 로직 분리를 위해 사용된다.
- state: Context API 나 Custom Hook 에서 state 변수를 사용할 경우,  
  Context API 는 전역 상태를 관리할 수 있지만 Custom Hook 은 hook 을 사용하는 컴포넌트 별로 각자 다른 상태이다.
- Context API 에 Custom Hook 을 포함하는 등 복합적으로 사용할 수 있다.

## Clean Code

- 좋은 코드를 작성하는 것보다, *나쁜 코드를 쓰지 않는 것*이 중요하다.
- 소프트웨어가 나쁜 코드로 구성되어 있으면, 기능 확장이나 수정이 거의 불가능해진다.
- 간혹 기능 구현이 급해서 좋은 코드를 포기하고자 하는 상황이 발생한다. 그리고 그 결정은 안 좋은 결과로 이어지게 된다:
  - 프로그램의 복잡도가 올라갈수록, 코드 한 줄을 추가하거나 수정하는 데 드는 비용이 증가한다.
  - 좋은 코드를 고민하고 찾아보려는 노력을 하지 않게 된다.
  - 나중에 코드를 다시 고치는 경우는 거의 없다(르블랑의 법칙).
- 단, legacy 코드가 나쁜 코드는 아니다. 그 때 최선이었던 방법이 시간이 흘러 현재 적합한 방법이 아닐 수 있지만, 마이그레이션이나 개편이 쉽다. 반면 나쁜 코드는 이러한 작업이 불가능에 가깝다.
