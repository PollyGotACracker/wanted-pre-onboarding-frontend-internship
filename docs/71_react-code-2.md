# React Code 2

## Context 나 custom hook 의 함수는 동등성 보장한 상태로 return 할 것

- Context `Provider` 의 모든 value 는 `children` 에서 접근할 수 있다.
- 컴포넌트의 `useEffect` 에서 Context 의 함수를 호출하고, 의존성에 넣을 경우 문제가 발생한다. Context `Provider` 가 리렌더링 되면 정의되어 있는 함수도 새롭게 생성된다. 즉 `useEffect` 가 원하는 대로 동작하지 않을 위험성이 있다.
- 따라서 작성한 함수를 `useCallback` 으로 memoization 하여 동등성을 보장해주어야 한다. 이때 함수 내에서 호출되는 다른 모듈을 `useCallback` deps 에 작성한다.

## 의존성을 명확히 드러낼 것

- `useEffect` 내에서 외부함수를 호출하고, 그 함수가 외부변수에 의존할 경우 그 외부변수를 인자로 받도록 한다.
- `useEffect` 의 의존성에 외부함수와 외부변수를 모두 넣어 변경되어야 하는 값을 명확히 드러나게 한다.
- 이때 호출되는 외부함수는 `useCallback` 으로 감싸야 한다.

## Try, Catch, Finally 속성을 이해하고 사용할 것

- 무조건 마지막에 수행되어야 할 코드는 finally 문에 옮긴다. 만약 try 문 중간에 삽입된다면 예외 발생 시 이후 코드가 동작하지 않을 위험이 있다.  
  e.g. `isLoading` 에 `false` 할당은 finally 문에 넣는다.
- 별도의 코드 블록으로 감싸지 않으면서 변수에 값을 할당하지 않고 바로 return 하는 경우, `return`, `return await` 은 똑같이 Promise 형태이다.  
  그리고 `await` 은 이벤트 루프에서 새로운 microstack 을 생성하기 때문에 제거하는 것이 성능상 이점이 있다.
- 그러나...
  1. `await` ... `then` 을 이용한 thenable 값인 경우
  2. `return await` 회피의 성능상 이점을 원하지 않을 경우
  3. 함수를 스택 추적에 표시하여 디버깅을 용이하게 하려는 경우  
     에는 `return await` 을 사용한다.

## 코드 결합도는 최대한 느슨하게 할 것

- Class 의 상속은 가장 강한 형태의 결합이다. 코드가 상호 결합된다는 것은 한 쪽이 다른 쪽에 영향을 미치게 된다는 의미다. 따라서 상속은 신중하게 사용해야 한다.
- 상속이 반드시 필요하지 않다면 `constructor` 와 해당 Class 의 인스턴스를 통한 의존성 주입을 사용한다.

```ts
export class Service implements ServiceType {
  private httpClient;
  constructor(httpClient) {
    this.httpClient = httpClient;
  }
}
```

## Class 내부에서만 사용하는 상수는 Class 안으로 넣을 것

- 모듈화를 응집도 측면에서 고려한다.
- Class 는 내부에 데이터를 저장할 수 있으므로, 특정 Class 내부에서만 사용되는 값은 안으로 넣는다.
- 외부로 노출될 필요가 없다면 `private`, 수정되지 않는 상수라면 `readonly` 를 붙여 literal 처리한다(`const` 로 인식).  
  e.g. `private readonly baseURL = "..."`

## CSS-in-JS 와 ClassName 을 이용한 스타일링 혼용 금지

- CSS-in-JS 에 ClassName 을 사용해 스타일링하면 유지보수에 어렵다.

  1. CSS-in-JS 를 이용해 스타일링된 태그들은 해당 definition 으로 이동해 바로 스타일을 확인 가능하지만, className 으로 선언한 경우 어려워진다.
  2. className 을 이용한 스타일링의 nesting depth 가 깊어지면 스타일 확인이 어렵다.
  3. 1 depth 라도 className 을 이용한 스타일 선언부가 길어지면 해당 스타일을 찾기 어렵다.

## CSS-in-JS 에 type(tag) selector 사용 지양

- 태그로 스타일을 주면 동일 태그의 다른 요소들에도 영향을 미칠 여지가 있으므로 유지보수에 악영향을 준다.
- `>` 선택자를 사용할지라도 추후 div 로 감싸거나, 요소가 더 추가되거나, 해당 태그를 가진 요소를 스타일링할 때 문제가 생길 수 있다.

## 값의 의미를 명확하게 알려줄 것

- 조건문의 조건이 어떤 의미를 갖는지 잘 표현해주어야 다른 사람이 읽기 편한 코드가 된다.
- 복잡한 조건은 변수 또는 함수로 만들고 이름을 통해서 의미를 설명한다.

## 모듈에서 너무 많은 값을 return 하지 않을 것

- 모듈이 너무 많은 정보를 갖는 것은 추상화가 제대로 되지 않은 것이다. 각 모듈은 최대한 적게 기능하도록 한다.
- 추상화: 문제 해결을 위해 필요한 핵심 내용을 남기고 관련 없는 내용을 제거함으로써 문제를 단순화시키는 과정

## 동등성 제대로 보장할 것

- 함수에 `useCallback` 을 사용하고 인자로 받은 callback 함수를 그 의존성에 넣었다면, 해당 함수를 호출하면서 전달하는 callback 함수에도 `useCallback` 을 사용해야 한다.

## 의존성을 잘 넣어줄 것

- `useEffect` 에서 변경되어야 하는 모든 함수와 변수를 의존성으로 넣어라.

## 컴포넌트는 pure component 일 것

- 컴포넌트는 `(props, state) => JSX` 여야 하며 side effect 가 없어야 한다.
- memoizaiton, 최적화, state, Server side rendering 은 컴포넌트가 순수하다는 가정 하에 이루어진다.
- U"I 의 변경은 `useEffect` 에서 실행한다.

## id selector 사용을 지양할 것

- id selector 는 컴포넌트의 독립성, 재사용성 측면에서 맞지 않다.
- id 는 document 내에서 하나만 있어야 하므로 컴포넌트를 조합하면 중복될 위험이 있다.
- label-input 을 연결할 때 id 대신 `<label><input /></label>` 형태로 사용할 수 있다.

## state 와 ref 을 구별하여 사용할 것

### useState

- 특정 상태 관리
- 값이 변경되면 리렌더링도 하고 싶을 때(UI 에 연관된 상태)

### useRef

- 특정 상태 관리
- 하지만 UI 와 연관이 없어 값이 바뀌더라도 리렌더링 하지 않아도 될 때
