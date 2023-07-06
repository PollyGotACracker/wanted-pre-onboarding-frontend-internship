# React Optimization

- 최적화에는 시간, 노력 등의 비용이 필요하다.
- 프로젝트에 최적화를 위한 코드가 더 추가될 수 있으며 이는 프로젝트의 복잡도를 비교적 증가시킨다.
- 이 최적화가 명확히 가치를 창출해낼 수 있을 것이라고 기대되는 상황, 즉 현재의 프로젝트에 성능적인 이슈가 발생했거나, 발생할 가능성이 있고 이를 해결해야 될 필요성이 있는 상황에서 수행해야 한다.
- 현재 상황을 분석해 최적화를 해야 하는 이유를 정리하고, 관련 사람들에게 알리고, 최적화 필요성에 대한 공감대를 형성한 뒤에 수행해야 한다.
- 도전정신, 탐구욕을 채우기 위한 개발은 사이드 프로젝트 등을 통해서 수행한다.

## React Rendering

1. HTML, CSS 의 객체형은 각각 DOM, CSSOM 이다.
2. DOM 과 CSSOM 은 결합되고, 위치를 계산하고, 최종적으로 화면에 그려진다.
3. 브라우저에서 제공하는 DOM API 를 JavaScript 를 통해 호출하여 화면을 변화시킨다.

- 명령형 프로그래밍은 Vanila JavaScript 를 이용해서 DOM 에 직접 접근하고 수정한다.  
  따라서 애플리케이션의 규모가 커질수록 관리 및 최적화가 어렵다.
- React 는 선언형 프로그래밍을 지향한다. 애플리케이션의 핵심 UI 를 선언하면 DOM 을 조작해 UI 를 그려내고, 변화시키는 일은 라이브러리나 프레임워크가 대신한다.

### Re-rendering

- state: UI 와 연동되어야 하고, 변할 여지가 있는 데이터를 사용
- setState(): state 변경시키는 방법 제한. 이 함수가 호출될 때, 즉 state 가 변할 때 re-rendering
- state 가 변하면 해당 컴포넌트를 포함한 하위 컴포넌트들은 모두 리렌더링된다.

1. 기존 컴포넌트의 UI 재사용 여부 확인
2. 함수 컴포넌트는 컴포넌트 함수 호출, 클래스 컴포넌트는 `render` 메서드 호출
3. 2의 결과를 통해 새로운 virtualDOM 생성
4. 이전 virtualDOM 과 새로운 virturalDOM 을 비교해 실제 변경된 부분만 DOM 에 적용

### Critical Rendering Path

- HTML, CSS, JS 를 다운로드받고 처리하여 화면에 픽셀 형태로 그려내는 것

1. HTML 을 파싱해서 DOM 생성
2. CSS 파싱해서 CSSOM 생성
3. DOM 과 CSSOM 을 결합해서 Render Tree 생성
4. Render Tree 와 Viewport 의 width 를 통해서 각 요소들의 위치와 크기 계산(Layout)
5. 지금까지 계산된 정보를 이용해 Render Tree 상의 요소들을 실제 Pixel 로 그려낸다(Paint)

- CRP 과정을 최적화하는 것이 퍼포먼스상 중요하다. 특히 Layout, Paint 과정은 많은 계산을 필요로 한다.  
  React 는 CRP 수행 횟수를 최적화하기 위해 virtualDOM 을 사용한다.
- 개발자가 할 수 있는 최적화:

  - 1번: 이전 UI 가 이전 UI 와 동일하다고 판단되는 경우 새롭게 컴포넌트 함수를 호출하지 않고 이전 결과값을 그대로 사용하도록 한다.
  - 3번: 컴포넌트 함수가 호출되면서 만들어질 virtualDOM 의 형태를 비교적 차이가 적도록 만든다.  
    e.g. div -> span 보단 div -> div

## 불변성

### 기본형 타입(원시형 타입)

- 다른 데이터 없이 해당 데이터 스스로 온전히 존재할 수 있는 형태
- 재할당 시 할당된 값 자체를 교체한다.

### 참조형 타입(객체형 타입)

- Object(Array, Function...) 로 다른 데이터들을 모아서 만들어진 타입
- 객체 안의 내용물들은 언제든지, 어떤 형태로든 변경 가능하다.
- 객체 간 비교의 어려움:
  - 안의 내용물과 상관없이 해당 객체를 가리키는 메모리 주소는 동일하기에 객체의 내용이 실질적으로 변경되었는지 판단하기 어렵다.
  - 두 객체의 내용물이 완벽히 일치하더라도 객체 간 메모리 주소가 다르므로 두 객체는 동일하지 않다는 결과가 나온다.
- 객체를 불변하게:
  - 한번 만들어진 객체를 수정하지 않고, 새로운 객체로 복사하여 변경한 후 재할당한다.

## Memoization

- 특정 값을 저장해뒀다가, 해당 값이 필요할 때 새롭게 계산해서 사용하지 않고 저장해둔 값을 재활용하는 테크닉
- 새로운 값을 만들어야 하는 상황에서 이전 값이 재활용되는 경우에 주의한다.
- 새로운 값을 만드는 것 vs 이전 값을 저장해두고 memoization 함수를 호출하고 의존성을 비교해서 가져올지 말지 여부를 판단하는 것 중 더 효율적인 방법을 판단해야 한다.

### `useMemo`

- 콜백함수에서 리턴하는 값을 메모
- deps 값이 변경되어야만 새로 계산하여 사용

### `useCallback`

- 함수 자체를 메모
- deps 값이 변경되어야만 새로 계산하여 사용

### `useEffect`

-[react.dev: escape hatches](https://react.dev/learn/escape-hatches)

- A 라는 요소가 온전히 동작하기 위해서 B, C, D 등 다른 요소들을 필요로 할 때 B, C, D 에 의존하고 있다고 표현한다. 즉 B, C, D는 A 의 의존성이다.
- `useEffect` 의 의존성 배열은 callback 이 의존하고 있는 요소들의 모음이다.
- `useEffect` 는 로직별로 분리해 여러 개로 나누면 좋다.
- state, setState 는 기본적으로 memoization 되어 있다. 그러므로 의존성에 state 와 setState 중 하나만 넣어주어도 된다.

### 좋은 의존성

- 모든 의존성을 빼먹지 말고 배열에 명시한다.
- 가능하다면 의존성을 적게 만든다:
  - setState 내부에 callback 을 넣으면 의존성에 setState 만 넣고, state 는 뺄 수 있다.
- object, funtion 을 의존성에 넣는 경우 변경사항을 비교하게 되면 무한 루프를 돌게 된다:

  1. 함수를 `useEffect` 안에 선언하기

  - 함수는 외부의 값이 아니므로 의존성이 아니다.

  2. 함수를 컴포넌트 바깥으로 이동시키기

  - 함수 안에서 state 를 사용하지 않을 경우
  - 파일의 최초 로드 시에만 함수를 가져온다.

  3. 메모이제이션(최후의 수단)

  - 2 가지 이상의 `useEffect` 에 동일 함수를 사용할 경우
  - 함수 안에서 state 를 사용할 경우
  - 함수를 `useCallback` 으로 감싼다.

## Context API

- props drilling 을 해결하기 위한 수단이다.
- useState 와 결합할 경우 전역 상태를 관리할 수 있다.
- `createContext` 내부의 값은 default value 로, 요소가 provider로 감싸져 있지 않은 경우 기본적으로 사용할 값이다(error 처리 등).
- 실제 initial value 는 `provider` 의 value 이다.
- 렌더링 최적화 측면에서, `createContext` 를 여러 개 사용함으로써 같은 파일 내에서 관심사 별로 context 를 분리시킨다. 이 때, 여러 개의 `provider` 로 감싸야 하므로 각 context 가 감싸는 위치에 주의한다.  
  e.g. 값 자체의 context 와 값을 change 하는 context 를 분리
- `provider` value 로 전달하는 함수에 `useCallback` 을 사용할 수 있다.
- 같은 파일 내에서 `useContext` 로 custom hook 을 만들어 export 할 수 있다.