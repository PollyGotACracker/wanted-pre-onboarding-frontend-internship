# Redux Middleware

- Middleware 란 프레임워크의 요청과 응답 사이에 추가할 수 있는 코드이다. 각 미들웨어 모듈은 독립적이며 여러 미들웨어를 추가해 서로 연결할 수 있다.
- express, koa 와 같은 서버 프레임워크는 기본적인 핵심 기능에 미들웨어를 추가하는 방식으로 설계하도록 한다. 이때 미들웨어는 request - response 사이에서 동작한다.
- Redux Middleware 는 Dispatcher 와 Store 사이에서, 즉 Action 이 Dispatch 되어 Reducer 에 전달되는 과정에서 동작한다.

## Redux Middleware 없이 설계

- [lunit.gitbook.io: Middleware](https://lunit.gitbook.io/redux-in-korean/advanced/middleware)

1. Dispatch 된 Action 을 logging
2. Action 이 Reducer로 전달되어 처리된 후, state 를 logging

### 1. Monkeypatching Dispatch

- 라이브러리나 프레임워크단의 코드 동작을 직접 수정해서 사용하는 것
- 여기서 `store.dispatch` 메서드를 monkeypatching 하면 매번 `conosole.log()` 를 작성하거나 특정 함수를 import 하지 않아도 된다.

```js
const originDispatch = store.dispatch;

store.dispatch = function dispatchAndLog(action) {
  console.log('dispatching', action);
  const result = originDispatch(action);
  console.log('next state', store.getState());
  return result;
};
```

- 그러나 이 방법은 여러 기능을 추가할 경우 코드가 복잡해지게 된다.
- 여기서 logging 이후에 `try`-`catch` 구문을 사용해 예외 발생 시 error log 를 출력하는 crash report 기능을 추가할 것이다.

```js
function patchStoreToAddLogging(store) {
  const next = store.dispatch;

  store.dispatch = function dispatchAndLog(action) {
    console.log('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    return result;
  };
}

function patchStoreToAddCrashReporting(store) {
  const next = store.dispatch;

  store.dispatch = function dispatchAndReportErrors(action) {
    try {
      return next(action);
    } catch (err) {
      console.error('에러 발생', err);
      throw err;
    }
  };
}

// enhance
patchStoreToAddLogging(store);
patchStoreToAddCrashReporting(store);
```

- `store.dispatch` 실행 이전에 logging 과 crash report 코드를 실행한다.
- `next(action)` 은 원래의 `store.dispatch` 이다.
- 함수 내에서 `store.dispatch` 메서드를 직접 수정하여 side effect 가 발생한다.
- patching 하는 함수들을 각각 특정 위치에서 모두 실행해야 한다.

### 2. Hiding Monkeypatching

- 각 patching 함수는 wrapping 된 Dispatch 함수를 return 한다. 미들웨어가 Store 객체에서 `next()` Dispatch 함수를 가져오지 않고 매개변수로 받도록 하는 것이다.
- 마지막에 monkeypatching 을 적용하는 함수는 각 미들웨어에서 return 된 Dispatch 함수를 `store.dispatch` 에 patching 한다.

```js
function logger(store) {
  const next = store.dispatch;

  return function dispatchAndLog(action) {
    console.log('dispatching', action);
    const result = next(action);
    console.log('next state', store.getState());
    return result;
  };
}

function crashReporter(store) {
  const next = store.dispatch;

  return function dispatchAndReportErrors(action) {
    try {
      return next(action);
    } catch (err) {
      console.error('에러 발생', err);
      throw err;
    }
  };
}
```

```js
function applyMiddlewareByMonkeypatching(store, middlewares) {
  copiesOfMiddlewares = [...middlewares];
  copiesOfMiddlewares.reverse();
  copiesOfMiddlewares.forEach(
    middleware => (store.dispatch = middleware(store))
  );
}

applyMiddlewareByMonkeypatching(store, [logger, crashReporter]);
```

- `reverse()`: 미들웨어는 순차적으로 실행된다. 그리고 마지막 미들웨어가 원래의 `store.dispatch` 를 호출해야 한다(그 후 Reducer 로 값 전달). 따라서 dispatch 함수를 patching 하는 과정은 가장 마지막 미들웨어(`crashReporter`) 부터 이루어져야 한다. 그러므로 미들웨어의 실제 실행 순서를 지키기 위해서는 역순으로 정렬시킨 후 patching 한다.
- `forEach()`: 각 미들웨어 함수를 실행하고 `store.dispatch` 메서드를 그 return 값으로 변경한다.
- 그러나 monkeypatching 을 수행하는 로직을 별도의 함수로 분리하여 감췄을 뿐, 내부적으로는 monkeypatching 을 통해 메서드를 직접 변경하고 있으므로 문제점이 개선되지 않는다.
  - `store.dispatch` 가 지속적으로 변하기 때문에 버그가 발생하기 쉽다.
  - 라이브러리의 코드의 동작을 직접 수정하여 기존의 `store.dispatch` 를 덮어씌웠으므로 추후 기존 Dispatch 메서드가 필요할 경우 대응하기 어렵다.

### 3. Remove Monkeypatching

- monkeypatching 대신 미들웨어에서 patching 된 함수를 return 하면 다음 미들웨어의 인자로 전달하는 방식(의존성 주입)
- 함수형 프로그래밍 기법인 currying 을 사용해 인자를 부분적으로 넣는다.
- 기존 방식:
  - 미들웨어 함수에 `store` 만 인자로 전달
  - 미들웨어에서 원하는 동작을 수행한 뒤 `store.dispatch` 호출
- 새로운 방식:

  - 미들웨어에 `store`, `next`를 인자로 전달
  - 미들웨어에서 원하는 동작을 수행한 뒤 `next` 함수 호출
  - `next` 는 미들웨어가 동작을 수행한 뒤 호출할 함수를 의미한다.

```js
function logger(store) {
  return function wrapDispatchToAddLogging(next) {
    return function dispatchAndLog(action) {
      console.log('dispatching', action);
      const result = next(action);
      console.log('next state', store.getState());
      return result;
    };
  };
}

function crashReporter(store) {
  return function wrapDispatchToCrashReporting(next) {
    return function dispatchAndReportErrors(action) {
      try {
        return next(action);
      } catch (err) {
        console.error('에러 발생', err);
        throw err;
      }
    };
  };
}
```

```js
// apply middleware
function applyMiddleware(store, middlewares) {
  copiesOfMiddlewares = [...middlewares];
  copiesOfMiddlewares.reverse();

  let dispatch = store.dispatch;

  copiesOfMiddlewares.forEach(middleware => {
    dispatchEnhancer = middleware(store);
    dispatch = dispatchEnhancer(dispatch);
  });

  return { ...store, dispatch };
}

applyMiddleware(store, [logger, crashReporter]);
```

- `applyMiddleware` 함수에서 `dispatch` 변수를 선언하고, 초기값으로 `store.dispatch` 를 할당한다. 이로써 `store.dispatch` 를 직접 변경하지 않게 되었다.
- `dispatchEnhancer` 변수에 각 미들웨어 함수가 return 한 함수가 할당되고, 그 함수가 `dispatchEnhancer(dispatch)` 로 실행되며 return 값은 `dispatch` 변수에 재할당된다(currying).

## Middleware 사용 목적

- 횡단 관심사 처리:

  - 위의 예시처럼 미들웨어를 통해 Redux 의 중간 과정에서 logging, crash report 등을 모두 처리하게 된다면 훨씬 깔끔하고 좋은 설계의 애플리케이션을 만들 수 있다.

- 관심사의 분리 실현:

  - Reducer 는 순수함수여야 하므로 API 호출 등 side effect 는 컴포넌트에서 별도로 수행 후 그 결과를 통해 Action 생성 및 Dispatch 가 이루어진다. 따라서 Redux Store 의 state 를 다루기 위한 관심사가 컴포넌트와 Redux 로 분리되어 작성된다.  
    => 미들웨어를 사용하면 Reducer 함수를 순수함수로 유지하면서 side effect 를 Redux 안에서 수행할 수 있다.
  - 컴포넌트에서 다루는 관심사에 UI 의 데이터 표시뿐만 아니라 상태값 변경까지 포함된다는 점 등으로 인해 관심사의 분리가 제대로 되지 않는다.  
    => 미들웨어를 사용하면 모듈의 응집도를 높이고, 모듈 간의 결합도를 낮출 수 있다.

## Implement Middleware

```js
// arrow function style
const logger = store => next => action => {
  console.group(action.type);
  console.log('dispatching', action);
  next(action);
  console.log('next state', store.getState());
  console.groupEnd();
};
```

1. `store`를 인자로 받아 `next` 를 인자로 받는 또다른 함수를 return
2. `next`를 인자로 받아 `action` 을 인자로 받는 또다른 함수를 return
3. `action` 을 인자로 받아 원하는 동작을 수행한 후, `next` 에 `action` 을 인자로 호출하여 다음 미들웨어로 전달하는 함수를 return

- Redux 에서 Reducer 에 전달되는 Action 은 반드시 객체여야 하지만, 미들웨어가 받는 Action 이 반드시 객체일 필요는 없다.
- 미들웨어에서 `next` 를 호출하지 않으면 해당 Action 은 다음 미들웨어로 전달되지 않는다. 이를 이용해, 특정 미들웨어에서 Action 이 Reducer 로 전달되지 않게 취소할 수 있다.
- 미들웨어는 `store` 객체를 인자로 받기 때문에 이에 접근할 수 있다. 만약 미들웨어에서 `store.dispatch` 를 직접 호출했을 경우 해당 Action 을 가장 처음 미들웨어부터 다시 실행한다(Redux 의 실제 `applyMiddleware` 함수에 이 로직이 구현되어 있다).
- Redux-Thunk 는 install 하지 않아도 직접 만들어 사용할 수 있을 만큼 간단하다.

```js
const thunk = store => next => action => {
  if (typeof action === 'function') {
    action(store.dispatch, store.getState);
  } else {
    next(action);
  }
};

// use thunk
const fetchSomeData = (dispatch, getState) => {
  client.get('todos').then(todos => {
    dispatch({ type: 'todos/loadTodos', payload: todos });
  });
};

function Component() {
  useEffect(() => dispatch(fetchSomeData), [fetchSomeData]);
}
```
