# Dependency

## 의존성 역전 원칙 (DIP; Dependency Inversion Principle)

- IoC;Inversion of Control
- 유연성이 극대화된 시스템을 만들기 위한 원칙
- 소스 코드 의존성이 추상에 의존하며 구체에는 의존하지 않는다: 변경될 가능성이 높은 구체적 요소, 외부 요소에 직접적으로 의존하는 코드를 최소화한다.

  - 의존성: 특정 모듈이 동작하기 위해 다른 모듈을 필요로 하는 것
  - 추상: 구체적인 구현 방법이 포함되지 않은 형태
  - 구체: 실질적으로 해당 동작을 위해 수행해야 하는 일련의 과정으로 변경될 여지가 많음

- 백엔드와 통신할 때, API를 사용하여 엔드포인트로 호출만 하면 응답이 오는 것도 추상적 동작이다.

## localStorage 를 사용한 Token 관리 추상화

- localStorage 는 브라우저에서 제공하는 API 로 변경 가능성이 있기 때문에 의존성을 최소화하는 것이 좋다.

1. Token 관리 작업 정리:

- 저장, 삭제, 저장된 토큰 가져오기

2. 작업을 코드 형태로 추상화:

```
TokenRepository Interface
    save(token: string): void
    get(): string
    remove(): void
```

- Interface: 두 가지 다른 요소들이 서로 소통하는 지점으로 일종의 가이드라인
- 3 가지 메서드와 input, output 만을 정의하고 구체적 구현사항은 명시하지 않았다(추상화). Interface 에 정의한 내용만 지켜진다면 구현 방법과는 상관없이 Interface 사용에 문제가 없다.
- 코드가 구체적으로 어떻게 동작하는지 이해하지 않더라도, 사용자는 Interface 만 안다면 목적을 달성할 수 있다.

3. 구현:

- [예제 코드](https://github.com/walking-sunset/SRP-DIP-OCP/tree/complete)

```js
// LocalTokenRepository.js

class LocalTokenRepository {
  // localStorage 에 저장될 key 이름
  #TOKEN_KEY = 'ACCESS_TOKEN';

  save(token) {
    localStorage.setItem(this.#TOKEN_KEY, token);
  }

  get() {
    return localStorage.getItem(this.#TOKEN_KEY);
  }

  remove() {
    localStorage.removeItem(this.#TOKEN_KEY);
  }
}
```

```js
// index.js
// 최상위에서 인스턴스화하여 관리
const tokenRepository = new LocalTokenRepository();
```

```js
// 다른 모듈에서 호출
fetch("todos", {
	headers:{
		Authorization:tokenRepository.get();
	}
}
```

- localStorage 는 TokenRepository Class 에 의해 관리됨으로써 통제할 수 있는 요소가 되었다. 그리고 TokenRepository Class 는 Interface 에서 정의된 사항을 모두 구현할 책임이 있다: 해당 Class 는 Interface 에 의존한다.
- 외부 요소가 변경될 경우 Interface 에 맞춰 다시 구현한다.

4. 실행 흐름과 의존성 방향 비교

- 실행 흐름:

  ```
  fetch => tokenRepository Interface(추상) => tokenRepository Class(구체) => localStorage
  ```

- 의존성 방향:

  ```
  fetch => tokenRepository Interface(추상) <= tokenRepository Class(구체) => localStorage
  ```

- 위와 같이 의존성이 설정되어 있기 때문에 Interface 가 변경되지 않는 한 tokenRepository 를 사용하는 코드는 변경될 필요가 없다.
- 만약 localStorage 가 sessionStorage 로 변경되거나, getItem 이 takeItem 으로 변경되더라도 Interface 자체는 변경되지 않으므로 관련 코드만 수정하면 된다.
- _추상에 대한 의존성을 중간에 추가하게 되면 특정 시점에서 코드의 실행 흐름(제어)과 의존성의 방향이 반대로 뒤집히게 된다._ 이를 의존성 역전 원칙이라고 부른다.

## 의존성 주입 (Dependency Injection)

- 개방-폐쇄 원칙(OCP;Open-Closed Principle)
- 자주 변경되는 값을 인자로 받아 사용함으로써 변화에 유연하게 대응
- 특정 모듈에 필요한 의존성을 내부에서 가지고 있는 것이 아닌, 해당 모듈을 사용하는 입장에서 주입해주는 형태로 설계
- 해당 모듈에서 직접적으로 의존성을 가지지 않으므로 모듈 내부 코드를 건드리지 않고 모듈 외부의 일부 코드만 수정하여 동작을 변경할 수 있게 된다.
- 필요한 값 또는 다른 모듈을 주입함으로써 모듈과 연관된 동작을 쉽게 변경하여 다양하게 사용할 수 있다:
  - Class 의 constructor(인스턴스 생성)
  - 함수의 parameter
  - :pushpin: React 에서 Context API 사용:  
    index.js 에서 Class 모듈들의 인스턴스 생성 후, App 컴포넌트를 감싸는 Context `Provider` 가 해당 인스턴스를 인자로 받음  
    이렇게 하면 index.js 에서 bootstrapping 과정이 이루어지므로 모듈의 연관 관계를 파악하기 쉽고, 유지보수 및 테스트 코드 작성이 수월해짐
- 프로그램 유연성, 테스트 용이성, mocking 등을 쉽게 활용할 수 있게 된다.
  - mocking: 외부 서비스에 의존하는 부분을 가짜로 대체하여 독립적으로 실행 가능한 단위 테스트를 작성하기 위해 사용되는 테스트 기법

## 컴포넌트의 `children`

- :pushpin: 다른 컴포넌트를 nesting 하면 자식 컴포넌트인 것과 달리, `children` 은 자식 컴포넌트가 아니라 props 이다.
- 부모 컴포넌트에서 리렌더링이 일어날 때 자식 컴포넌트는 자신의 변경 여부와 상관없이 무조건 리렌더링 되는 반면, props 인 `children` 의 경우 값이 변경되지 않는다면 리렌더링이 발생하지 않는다.
- 따라서 Context API 에서 `children` 을 사용할 때 합성 컴포넌트에서의 리렌더링과 props drilling 을 줄일 수 있다.
