# Closure

- 자신이 생성될 때의 환경을 기억하고, 그를 사용하는 함수
- 함수를 일급 객체로 사용하는 모든 언어에서 사용한다.
- 클로저는 즉시실행함수로 자주 사용된다.

## 활용

1. 상태 기억: 외부함수의 변수(자유변수) 값은 내부함수에서 참조할 수 있다.

```js
const cachefactorialize = (function () {
  const cache = {};

  return function factorialize(num) {
    if (num < 0) throw new Erorr('0보다 큰 숫자를 입력해주세요');
    if (cache[num]) return cache[num];
    cache[num] = num === 0 ? 1 : num * factorialize(num - 1);

    return cache[num];
  };
})();
```

2. 상태 은닉: getter 메서드를 정의하지 않는 한, 외부함수의 변수(자유변수) 값은 함수 밖에서 참조할 수 없다.

```js
function addFunc(initNum) {
  const toAdd = initNum;

  return function (num) {
    return num + toAdd;
  };
}
// toAdd 는 외부에서 참조 불가능하다.
const add5 = makeAddNumFunc(5); // (num) { return num + toAdd }
const result = add5(10); // 15
```

3. 상태 공유: 외부함수 호출 시 인자를 전달하고, getter 및 setter 메서드를 구현하면 인스턴스화한 모든 변수에서 공유된다.

```js
const makeMember = (function makeGroup(leaderName) {
  return function (name) {
    return {
      name: name,
      getLeaderName: () => leaderName,
      setLeaderName: name => {
        leaderName = name;
      },
    };
  };
})('Jane');

const Polly = makeMember('Polly');
const Cracker = makeMember('Cracker');
Polly.getLeaderName(); // Jane
Cracker.getLeaderName(); // Jane

Cracker.setLeaderName('John');
Polly.getLeaderName(); // John
```

## 일급 객체

- 익명의 literal 로 생성할 수 있다(runtime 생성이 가능하다).
- 값으로 사용 가능하다.

  1. 변수나 데이터(자료구조)에 담을 수 있다.
  2. 함수의 파라미터로 전달할 수 있다.
  3. 함수의 return 값으로 사용할 수 있다.

## 클로저와 Class 비교

1.  멤버변수 생성:  
    매개변수를 받아 멤버변수로 선언
2.  인스턴스 생성:  
    return 하는 함수를 변수에 할당하면 Class 인스턴스 생성과 유사
3.  정보 은닉

## 클로저와 Currying

- currying 은 클로저의 원리를 이용한 기법으로, 외부함수 호출 시 전달받은 인자를 외부함수의 변수에 할당해 값을 고정시킨다. 추후 내부함수를 여러 번 호출할 때, 인자를 다르게 전달하면서도 외부함수 변수 값을 사용할 수 있게 된다.

## `[[Environment]]`

- 자바스크립트에서 함수 생성은 함수 형태의 객체를 만드는 것이다. 자바스크립트 엔진은 함수 객체를 생성할 때 함수 객체의 `[[Environment]]` 내부 슬롯에 현재 실행 중인 실행 컨텍스트의 LexicalEnvironment 를 할당한다.
- 함수가 호출되어 실행 컨텍스트가 생성될 때, 스코프 체인을 결정짓는 OuterEnvironmentRecordReference 에 `[[Environment]]` 가 참조하고 있는 객체를 할당한다.
- 내부 슬롯, 내부 메서드: ECMAscript 명세에서 자바스크립트 구동 엔진이 구현해야 하는 동작을 추상화시켜서 설명하는 pseudo code

## React 에서의 클로저

- `useState` 와 `useEffect` 등 함수 컴포넌트에서 사용하는 모든 hook 들은 클로저를 기반으로 동작한다.
- React 의 hook 을 사용할 때 아래의 규칙을 지켜야 하는 이유도 hook 이 클로저의 특성을 갖기 때문이다. 컴포넌트가 렌더링 될 때마다 항상 동일한 순서의 hook 호출을 보장한다고 설명한다.

1. 최상위(at the Top Level)에서만 hook 을 호출할 것
2. 반복문, 조건문 혹은 중첩된 함수 내에서 hook 을 호출하지 말 것

```js
/*
useState(initialValue)
    state: saved state || initialValue
    setState: (value) => void
    saved state = value; render();
*/
/*
useEffect(effect, deps)
    isFirstCall => effect();
    isDepsNotProvided => effect();
    hasDepsChanged => effect();
*/

export const { useState, useEffect } = (function makeMyHooks() {
  // 여러 hook 사용 시 각 state 나 deps 값을 담는 배열
  const hooks = [];
  let hookIndex = 0;

  // useState, useEffect 함수 작성

  return { useState, useEffect };
})();
```

```js
function useState(initialValue) {
  if (hooks[hookIndex] === undefined) {
    hooks[hookIndex] = initialValue;
    // 함수로 값을 초기화할 경우 그 실행 결과를 담는다
    if (typeof initialValue === 'function') {
      hooks[hookIndex] = initialValue();
    }
  }

  const state = hooks[hookIndex];

  const setState = (function () {
    // 최초 호출 시 hookIndex 값을 저장하여 고정
    const currentIndex = hookIndex;

    return function (value) {
      hooks[currentIndex] = value;
      // 화면 리렌더링되기 전에 index 초기화를 해야
      // index 0 부터 차례로 state 저장 가능
      hookIndex = 0;
      render();
    };
  })();

  hookIndex++;
  return [state, setState];
}
```

```js
function useEffect(effect, deps) {
  const prevDeps = hooks[hookIndex];

  const isFirstCall = () => prevDeps === undefined;
  const isDepsNotProvided = () => deps === undefined;
  // re-rendering 은 여기서 true 일 때 발생한다.
  const hasDepsChanged = () =>
    deps.some((dep, index) => dep !== prevDeps[index]);

  // OR 연산은 앞 조건이 true 라면 뒤의 조건은 고려되지 않는다.
  // 함수의 지연 평가: 함수의 결과가 필요할 때까지 계산을 늦춘다.
  // 조건을 함수가 아닌 변수로 만들 경우,
  // deps 가 undefined 가 될 수 있으므로 deps?.some 해야 한다.
  if (isFirstCall() || isDepsNotProvided() || hasDepsChanged()) {
    // callback 함수 실행
    effect();
  }

  hooks[hookIndex] = deps;
  hookIndex++;
}
```
