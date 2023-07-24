# React Code 3

## 가변변수 사용 지양하기

- 가변변수는 값이 변경될 여지가 있기 때문에 예측하기 어렵다.
- 반드시 가변성이 필요한 상황이 아닐 경우 불변하게 사용하는 것이 변수가 나타내고자 하는 의미가 명확해지고, 버그가 발생할 가능성이 적어진다.
- 따라서 `let` 키워드로 변수 선언은 최대한 지양한다.

```js
/*
(async () => {
  let data;
  data = AFunc();
  if (!data) data = await BFunc();
})();
*/

(async () => {
  const data = AFunc() || (await BFunc());
})();
```

## 찾는 값이 없음에 대한 상태

- 굳이 boolean 을 return 하는 것보다 `null` 또는 `undefined` 를 return 하는 것이 의미상 맞다.

## 관심사 분리

- 컴포넌트, 함수, 특히 `useEffect` 내부에서...
- 각 로직들을 모듈화하고 컴포넌트에서 모듈을 import 하여 바로 처리할 수 있도록 한다.
- 모듈화가 불필요하거나 어려울 경우 각 로직을 컴포넌트 파일 내에서 함수로 분리한다.

### 모듈화, 함수화의 목적

1. 중복을 제거하기 위해서
2. 코드가 너무 복잡해서, 의미가 잘 드러나지 않아서

## HashTable을 이용한 조건에 맞는 함수 가져오기

- Hash Table: key:value 형태의 자료구조로 JS 의 Object(객체) 나 Map 이 해당
- 아래의 eventHandler 는 `event.key` 의 값인 `ArrowUp`, `ArrowDown` 을 객체의 key 로 저장한 후, 이벤트 발생 시 `event.key` 에 해당하는 메서드를 실행한다.

```ts
const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
  const arrowFunc: { [key: typeof e.key]: () => void } = {
    ArrowUp: () => {},
    ArrowDown: () => {},
  };

  e.preventDefault();
  arrowFunc[e.key];
};
```

## 싱글톤 패턴

- singleton: 특정 객체 인스턴스를 단 하나만 만드는 기법
- 아래 코드는 `getCacheStorage` 함수에서 `cacheStorage` 가 `undefined` 가 아닐 때만 `cacheStorage` 를 단 한번 생성한다. 그리고 return 되는 getter 및 setter 메서드에서 `getCacheStorage` 를 호출하고 있다.

```ts
export const cache = (() => {
  const EXPIRATION_TIME = 60 * 60 * 1000; // 60 * 60 * 1000 = 1hour
  const SEARCH_KEY = 'searchCache';

  let cacheStorage: Cache | undefined;

  async function getCacheStorage() {
    if (cacheStorage === undefined) {
      cacheStorage = await caches.open(SEARCH_KEY);
    }

    return cacheStorage;
  }

  return {
    async set(url: string, data: unknown) {
      const cacheStorage = await getCacheStorage();
      const response = new Response(
        JSON.stringify({ data, expirationTime: Date.now() + EXPIRATION_TIME })
      );

      await cacheStorage.put(url, response);
    },
    async get(url: string) {
      const cacheStorage = await getCacheStorage();
      const cacheResponse = await cacheStorage.match(url);

      return cacheResponse;
    },
  };
})();
```

## useRef vs useState

- [react.dev: Differences between refs and state](https://react.dev/learn/referencing-values-with-refs#differences-between-refs-and-state)
- Local Variable: 렌더링 때마다 초기화되므로 React 에서 UI 상태 기억에 사용하기 어렵다.
- `useRef`, `useState`: 렌더링이 새롭게 되더라도 이전 렌더링에서의 값을 기억해둘 수 있다.
- 단, state 와 달리 refs 는 값이 변경되더라도 UI 는 변경되지 않는다.
- React 에서 DOM 직접 조작은 최대한 지양하는 것이 좋지만, focus 동작 같은 경우 refs 를 사용한다.
