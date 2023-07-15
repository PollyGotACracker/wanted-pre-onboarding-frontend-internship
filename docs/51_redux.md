# Redux

## Design Pattern

- 소프트웨어를 설계하면서 자주 발생하는 문제에 대한 모범답안
- 일부 코드를 해결하기 위한 방법부터 애플리케이션 전체 설계까지 다양한 범위에서 사용된다.
- 애플리케이션 전체를 다루기 위한 디자인 패턴들은 여러 작은 범위의 디자인 패턴들을 함께 사용하여 복합 패턴이라고 한다. 모든 복합 패턴의 근간이 되는 패턴은 MVC 패턴이다.

### MVC

![mvc](https://github.com/PollyGotACracker/wanted-pre-onboarding-frontend-internship/assets/92136750/38a82bc6-19c7-41ed-8a38-d24293ba716e)

```
- Model: 데이터의 형태를 정의하고, 데이터를 수정
  e.g. 상품 추가 동작을 반영하여 애플리케이션 업데이트
- Controller: 사용자 입력을 받아 애플리케이션 내에서 어떻게 처리할지 판단 및 가공해서 모델 또는 뷰 조작(로직 부분)
  e.g. View 로부터 업데이트 사항을 받고, 상품 추가 동작을 Model 에 알림
- View: 모델을 UI 로 표현, 사용자의 입력을 받아서 Controller 에 전달
  e.g. 사용자가 장바구니에 담기 버튼을 클릭
```

- 애플리케이션의 구성요소를 역할에 따라 분리: Model - DB, Controller - Server, View - Client
- View는 기본적으로 Model 에 접근해서 데이터를 받아오지만, 때로는 Controller 에서 Model 을 거치지 않고 바로 View 를 변화시키기도 한다.

![mvc-bidirectional-flow](https://github.com/PollyGotACracker/wanted-pre-onboarding-frontend-internship/assets/92136750/42b2b88b-bae7-4129-8ffb-3831a8279faf)

- 애플리케이션의 규모가 커지고 세분화됨에 따라 상호작용이 많아지고 데이터 관리의 중요성이 커지면서 MVC 패턴의 양방향성은 문제를 일으키게 되었다.  
  e.g. Facebook 의 Direct Message 기능: 각 사용자별로 여러 모델과 뷰가 서로 유기적으로 연결되어 있을 때, 변경사항이 연쇄적으로 영향을 주어(양방향성) 모델과 뷰가 불일치하는 문제

### Flux

![flux-01](https://github.com/PollyGotACracker/wanted-pre-onboarding-frontend-internship/assets/92136750/527e4c33-64ac-4cee-92f0-cf066c365292)

- React 및 Redux 에서 핵심이 되는 패턴
- 단방향으로 애플리케이션 변화의 흐름을 최대한 단순화하고 예측 가능하게 함

![flux-02](https://github.com/PollyGotACracker/wanted-pre-onboarding-frontend-internship/assets/92136750/5c590df5-b292-47ac-a526-8ca03761647d)

```
- Action: 어떤 변화를 발생시킬지 정의하는 `type` property 와 변화에 필요한 데이터를 담고 있는 단순 객체
- Dispatcher: Action 을 받아서 모든 Store 에 전달
  모든 Action 은 Dispatcher 를 거쳐야 한다(Hub 역할).
- Store: 애플리케이션의 데이터를 저장하고, Dispatch 에 전달된 Action 에 따라 수정
- View: Store 에 저장된 데이터를 받아 UI 로 표현, 사용자 동작에 따라 Action 생성
```

## Redux

- 현재 Flux 패턴을 근간으로 하는 라이브러리의 표준
- Flux, CQRS, Event Sourcing 의 개념을 사용해서 만든 라이브러리

  - CQRS(Command and Query Responsibility Segregation):  
    데이터 저장소에 대한 읽기와 업데이트 작업을 분리하는 패턴  
    CRUD 에서 Read 만 Query 형태(상태 조회), 나머지는 Command 형태(상태 변경)로 각각 분리
    어플리케이션 성능, 확장성, 보안성 극대화
  - Event Sourcing:  
    어플리케이션에서 순차적으로 발생하는 event 들을 모두 데이터로 저장하여 status 를 만들고, 이를 바탕으로 데이터를 조작하는 패턴

- "JavaScript 앱을 위한 예측 가능한 상태 컨테이너"가 핵심 가치
- 프론트엔드에서 발생하는 복잡한 상태들의 변화를 관리하기에 좋다.
- 현재는 API 데이터에 대한 상태 관리를 없앤 React Query 가 대세지만, 기존 프로젝트는 아직 Redux 를 많이 사용하고 있다.

### Redux 의 3가지 원칙

1. Single source of truth

- Redux 내 모든 전역 상태는 Store 라는 하나의 객체 안에 트리 구조로 저장된다. 따라서 애플리케이션이 단순해지고 데이터의 상태, 흐름을 예측하기 쉬워진다.
- 한 객체의 변화만 추적하면 되므로 Undo, Redo 등의 기능을 구현하기 쉬워진다.

2. State is read-only

- state 는 반드시 Dispatch 를 통해 Action 객체를 전달해야만 수정 가능하다.
- state 를 불변하게 다루고 변경 방법을 제약해 안정성, 예측 가능성을 증대시킨다.
- 모든 변화는 Dispatch 를 통해 중앙화되고, 순서대로 수행되므로 여러 곳에서 동시에 데이터를 수정하여 발생하는 Condition 문제를 막을 수 있다.
- Action 을 통해 데이터 수정 의도를 표현할 수 있다. 이는 단순한 형태의 객체이기 때문에 추적하거나 로깅, 저장하기 용이해 디버깅이 쉬워지며, 테스트 코드 작성에 용이하다.

3. Changes are made with 'pure function'

- Action 을 통해서 Store 를 변경시키는 실제 동작은 Reducer 라는 '순수함수'를 통해 수행된다.
- 순수함수는 동일한 input 을 받으면 항상 동일한 output 을 내는 것이 보장되어 있는 함수로, 함수 내에 side effect 가 없어야 한다. side effect 란 외부의 값이나 함수에 접근하여 같은 input 이라도 다른 output 을 return 하는 것이다.
- Reducer 는 이전 state 값과 action 객체를 인자로 받아 새로운 state 를 return 하는 순수함수이다. 즉, 기존 state 객체를 직접 수정하는 것이 아니다.
- :pushpin: 관심사를 분리하기 위해 Reducer 함수를 여러 개 작성할 경우, `combineReducers({ reducerA, reducerB })` 를 사용할 수 있다.
  ```js
  import { combineReducers, createStore } from 'redux';
  // root reducer(reducerA, reducerB)를 통합해서 rootReducer 생성
  const reducer = combineReducers({ reducerA, reducerB });
  // root reducer를 통한 store 생성
  const store = createStore(reducer);
  ```

### Redux 의 구성요소

1. View: 유저에게 보이는 UI 로 Store 의 state 를 기반으로 그려진다.
2. Action: `type` property 를 가지고 있는 자바스크립트 객체로 애플리케이션 내에서 어떤 일이 일어났는지를 설명한다.

- `type` property:  
  어떤 변화가 발생했는지 설명하는 string  
  `domain/eventName` 형태가 일반적
- `payload` property:  
  추가적으로 전달할 데이터  
  property 이름 변경 가능

3. Action Creator: Action 객체를 return 하는 함수로, 코드 중복과 실수를 피하기 위해 선택적으로 만들어 사용한다.

```js
const addTodo = todo => {
  return {
    type: 'TODO/ADD_TODO',
    payload: todo,
  };
};
```

4. Reducer: 이전 state 값과 Action 객체를 인자로 받은 후 type 에 따라 새로운 state 를 return 하는 순수 함수이다. `(state, action) => newState`

- 새로운 state 는 기존 state 와 Action 객체 외의 다른 요소의 영향을 받아서는 안된다.
- Reducer 는 기존 state 를 직접 수정하지 않고 값을 복사하여 이를 변경한 후 return 하는 방식으로 동작해야 한다.
- Reducer 내부에서 비동기 통신, 랜덤 값 사용 등 side effect 를 수행해서는 안된다.

5. Store: redux 의 모든 state 를 관리하는 객체로 `createStore(reducer)` 로 호출한다.

- :pushpin: `store.getState()` 로 현재 state 값을 가져올 수 있다.  
  단, `store.getState()` 의 값은 React-Redux 의 `useSelector()` 와 달리 리렌더링을 발생시키지 않는다.

6. Dispatch: Store 객체의 메서드로 Action 객체를 Store 에 전달한다. Store 는 Reducer 를 통해 새로운 state 를 생성한다. `store.dispatch({ type: "counter/increment" })`
7. Selector: Store 의 크기가 커질 경우, View 에서 특정 state 만 가져오기 위한 동작이 반복되므로 별도의 사용자 함수로 정의한 것이다.

```js
const selectCounterValue = state => state.value;
const currentValue = selectCounterValue(store.getState());
console.log(currentValue); // 2
```

### React-Redux

- React 의 전역 상태 관리와 Props Drilling 문제 해결 가능
- Redux 는 어떤 JS 앱이든 사용할 수 있도록 범용성을 갖추고 있으므로, React 에 최적화되어 있지 않다.
- React-Redux 는 Redux 와 React 를 통합하기 위한 라이브러리이다. Redux 의 Store 에 저장된 state 를 React 컴포넌트에서 가져올 수 있게 해주고, Redux state 가 변경될 경우 React state 와 마찬가지로 리렌더링 한다.

#### React-Redux 의 기능

1. Provider: Redux Store 에 접근할 수 있는 기능을 제공한다. 내부적으로 Context API 를 활용하고 있다.
2. useSelector: Redux 의 Selector 를 React hook 으로 표현한 것으로, Redux Store 의 값을 가져올 수 있는 hook 이다. 변수에 할당하면 React state 처럼 동작해 리렌더링이 가능하다.

```js
import { useSelector } from 'react-redux';

const Counter = () => {
  const count = useSelector(state => state.value);

  return <h1>{count}</h1>;
};
```

3. useDispatch: Action 을 Store 에 보내기 위한 Dispatch 함수를 가져올 수 있는 hook 이다. `const dispatch = useDispatch();`

### Redux 와 Context API + useReducer 비교

- Redux 는 렌더링에 최적화되어 Redux state 값이 변경될 때만 리렌더링된다. 상태가 복잡해질수록 Redux Middleware 의 필요성이 부각되므로, 그런 상황에서는 Context API + `useReducer` 보다 Redux 가 더 나은 선택지가 될 수 있다.
- Props Drilling 과 전역 상태 관리로 목적을 분리하여 Context API 와 `useReducer` 를 함께 사용해도 된다.

### Tip

- 새로운 기술 스택을 배웠을 때는 바로 기존 프로젝트에 적용하지 마라.
  가장 간단한 애플리케이션을 먼저 만들어보고 이해한 후 프로젝트에 적용해라.
- Reducer 내부에서 type 에 따라 수행되는 코드가 복잡해질 경우 각각 별도의 함수로 분리하는 것도 괜찮은 선택이다.
- INITIAL_STATE 와 ACTION_TYPE 을 상수로 만들어 관리한다.
- Redux Toolkit 을 사용하여 Redux 를 더욱 쉽고 효율적으로 관리할 수 있다.

### Ducks pattern

- 기존 Redux 에서는 Action 과 Reducer 를 다른 폴더 및 파일로 관리한다. action.type, Reducer 는 함께 동작하므로 수정사항이 생기면 여러 파일들을 동시에 수정해야 한다. 따라서 이를 하나의 모듈로 묶어서 관리하는 패턴이다.

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { addNumber } from './store/calculator';

const App = () => {
  const count = useSelector(store => store.count);
  const dispatch = useDispatch();

  const addNum = () => {
    dispatch(addNumber(5));
    // dispatch({ type:"counter/add", payload: 5 })
  };

  return (
    <div>
      <h1>count:{count}</h1>
      <button onClick={addNum}>add</button>
    </div>
  );
};
export default App;
```

### Redux DevTools

- [redux-devtools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
- [Use redux-devtools extension package](https://github.com/reduxjs/redux-devtools/tree/main/extension#13-use-redux-devtoolsextension-package-from-npm)
- 브라우저 extension 을 통해 Redux 의 동작을 분석하고 예측하여 디버깅 할 수 있다.
- 코드에서 DevTools 설정을 할 때 `@redux-devtools/extension` 라이브러리를 사용하면 편리하다.
