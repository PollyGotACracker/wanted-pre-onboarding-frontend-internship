# React Code

## 1. 주석

### 좋은 주석 vs 나쁜 주석

1. 코드를 설명하는 주석: X

- 난해한 코드를 설명하는 주석을 달지 말고, 이해하기 쉽도록 코드를 리팩토링 해야 한다.
- 정규표현식 같은 코드는 설명을 다는 것이 오히려 좋다.

2. 나중에 사용될 수도 있는 코드를 주석 처리: X

- 코드 작성자가 사라지면 존재 이유를 모르는 주석이 된다.
- GitHub 의 버전 관리를 사용한다.

3. 코드로 표현하지 못하는 부분을 주석 처리: O

- 작업 중 다른 곳에서 문제를 발견했거나, 나중에 해야할 일을 마킹하는 것은 좋은 주석이다.

### 주석의 중복

- 주석도 중복이다.
- 실제 코드가 변경되어 주석 내용과 달라지면 주석까지 바꿔야 한다.
- 주석 내용을 바꾸지 않으면 읽는 사람에게 혼란을 준다.
- 아래 주석은 일부 IDE 에서 하이라이트 처리되며, 코드 검색 시 유용하다.  
  `// TODO`, `// FIXME`

## 2. 함수명, 변수명

- 함수명 및 변수명에는 무슨 동작을 할 수 있는지 표현되어야 한다.
- `handleCheck`: X, `toggleComplete`: O

## 3. 불필요한 state

- React 의 state 는 최소화해야 한다.

- 부모로부터 props 를 통해 전달되면 거의 state 에 넣을 필요 없다.
  - props 를 다시 state 에 저장하면 source of truth 에 위배된다.
  - 또한 복잡성이 커지고, 중복 데이터가 생기면서 데이터가 불일치할 확률이 높아지게 된다.
  - 하나의 아이덴티티를 표현하는 값, 변수, 데이터는 단 하나만 존재해야 한다.
  - 그러므로 부모의 데이터 중 일부를 변경할 수 있는 방법을 찾는 것이 좋다.
- 값이 시간이 지나도 변하지 않으면 state 를 쓰지 않는다.
- 컴포넌트 안의 다른 state 나 props 를 가지고 계산 가능하면 state 를 쓰지 않는다.

- 참고: 각 요소의 조건 체크가 state 변수라면, button 의 `disabled` 값인 `isDisabled` 변수까지 state 일 필요는 없다.

### Render

- browser UI 를 paint 하는 것

```js
const Component = props => {
  // jsx 를 계산하는 과정
  return JSX;
};
```

- React 에서는 Component call -> return JSX -> JSX browser paint
- state change: setState() -> state change -> Component recall
- re-render: Component call -> return JSX -> prev JSX, cur JSX -> difference paint

## 4. 함수는 한가지 일만 처리해야 한다.

- 컴포넌트를 재사용할 경우 재사용되는 컴포넌트에 조건문을 작성하지 않는다.
  그 컴포넌트를 쓰는 해당 컴포넌트에서 코드를 작성해 역할을 분리한다.

## 5. 불필요한 `useMemo` 또는 `React.memo`

- 상위 컴포넌트가 리렌더링되면, 하위 컴포넌트는 무조건 리렌더링 된다.  
  그러나 하위 컴포넌트의 경우, props 가 변화하지 않았다면 해당 컴포넌트의 UI 가 변화하지 않았을 것이다. 따라서 불필요한 리렌더링이 발생한다.

- 컴포넌트의 이전 props 와 다음 렌더링 때 사용될 props 를 비교(shallow compare;얕은 비교)해 값이 같지 않을 경우 리렌더링 한다.
  또는 주어진 함수를 사용해 비교하여 false 이면 리렌더링, true 이면 리렌더링 하지 않는다.
  `export default React.memo(<comp>, [<func>])`

- `React.memo` 는 Higher Order Component 이다.
  HOC 란 컴포넌트를 인자로 받아 컴포넌트를 리턴하는 컴포넌트이다.

## 6. 파일 안에 내용 작성 순서

- 글을 두괄식으로 서술하는 것처럼, 코드도 중요한 부분을 상단에 올린다.
- 최대한 컴포넌트 블록을 상단에 올린다. 어렵다면 별도의 파일로 나눈다.
