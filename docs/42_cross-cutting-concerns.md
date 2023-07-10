# Cross-cutting Concerns (횡단 관심사)

- 애플리케이션 내 여러 핵심 비지니스 로직들에 걸쳐서 실행되어야 하는 동작들
- 핵심 비지니스 로직과 횡단 관심사를 분리함으로써 애플리케이션 유지보수를 용이하게 한다.
- 횡단 관심사의 예시:

  - 인증 & 인가
  - 로깅
  - 트랜잭션 처리
  - 에러 처리

> - 401 Unauthorized: 인증 X
>   - 클라이언트가 인증되지 않았거나, 인증 정보가 부족하여 요청이 거부됨
> - 403 Forbidden: 인가 X
>   - 요청은 전달되었으나 권한이 없어 접근이 거부됨

## 처리 순서

1. 관심사 정의
   - 어떤 동작들이 필요한지 작성
2. interface 추상화
   - 각 로직의 params, return 을 정의
   - 코드 작성자와 사용자 간의 약속
   - interface 는 변경될 가능성이 거의 없다.

## HTTP 통신에서 횡단 관심사 처리

- 인증 및 인가는 가장 대표적인 횡단 관심사로 여러 비즈니스 로직에 걸쳐서 이루어지는 동작이다.
- HTTP 는 stateless 하기 때문에 매 요청을 개별적으로 처리한다. 따라서 HTTP 통신을 주고받을 때 내가 누구인지 증명하고, 권한을 획득하기 위해서는 클라이언트에서 인증 정보를 매 통신마다 전송해주어야 한다.

- [예제 코드](https://github.com/walking-sunset/SRP-DIP-OCP/tree/complete)

```js
// HttpClient Interface
// fetch(endPoint, options): Promise<Response>
export class HttpClient {
  // private 변수 선언
  #baseURL;
  #tokenRepository;

  constructor(baseURL, tokenRepository) {
    this.#baseURL = baseURL;
    this.#tokenRepository = tokenRepository;
  }

  fetch(endPoint, options) {
    return window.fetch(`${this.#baseURL}${endPoint}`, {
      ...options, // 추가 옵션 spread
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + this.#tokenRepository.get(), // 받은 token 모듈 사용
        ...options?.headers,
      },
    });
  }
}
```

```jsx
// index.js
// 최상위에서 인스턴스화하여 관리
// 환경변수로 정의한 baseURL, localTokenRepository 인스턴스 전달
const root = ReactDOM.createRoot(document.getElementById('root'));
const localTokenRepository = new LocalTokenRepository();
const httpClient = new HttpClient(
  process.env.REACT_APP_BASE_URL,
  localTokenRepository
);

root.render(
  <AuthProvider authService={authService}>
    <App />
  </AuthProvider>
);
```

```js
// AuthContext Interface
// signin(email, password):Promise<undefined>
// signup(email, password):Promise<undefined>
// logout():undefined
export function AuthProvider({ children, authService }) {
  // authService 인자로 해당 모듈의 인스턴스를 받는다.
  // bind() 를 사용해 this 를 고정한다.
  const signin = authService.signin.bind(authService);
  const signup = authService.signup.bind(authService);
  const logout = authService.logout.bind(authService);

  // 컴포넌트 내에서 메서드 사용
  return (
    <AuthContext.Provider value={{ signin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### fucntion 과 class 비교

- function: stateless
  - 함수 안의 값은 함수가 호출될 때마다 초기화된다.
  - 상태 관리가 필요하다면 closure 를 사용해야 한다.
- class: stateful
  - 생성자 함수 `constructor` 안에서 값을 기억하고, 메서드를 호출하여 사용할 수 있다.

\*\* 단, token 값은 변경될 가능성이 있으므로 class 내부에 정의하지 않고 매 요청마다 token 을 전달하는 것이 좋다.
