# 실행 컨텍스트

- 소스 코드를 실행하는데 필요한 환경을 제공하고, 코드의 실행결과를 실제로 관리하는 영역
- 실행 컨텍스트를 통해 스코프, this, 호이스팅, 클로저 등의 동작과 코드 실행 순서가 관리된다.
- 실행 컨텍스트와 렉시컬 환경은 별개의 객체로, 실행 컨텍스트에서 렉시컬 환경을 참조한다. 렉시컬 환경은 실행 컨텍스트가 종료되더라도 어디선가 참조되고 있다면 사라지지 않는다.

## 실행 컨텍스트의 종류

- Global Execution Context:
  - JS 코드가 최초 실행될 때 생성
  - 전역에서 별도의 모듈로 분리되지 않은 함수나 값들 관리
- Function Execution Context:
  - 각 함수가 호출될 때마다 별도로 생성
- Eval Execution Context, Module Execution Context

## 콜스택(실행 컨텍스트 스택)

- 스택에 실행 컨텍스트를 순차적으로 추가 및 제거하며 코드 실행 순서를 관리한다.  
  스택 구조이므로 먼저 추가된 컨텍스트는 나중에 제거된다.
- 현재 무슨 코드가 실행되야 하는지 파악하고, 개별 코드 실행이 종료되면  
  다시 어느 코드로 돌아가서 동작을 이어가야 하는지 관리한다.
- 실행 컨텍스트는 종류별로 세부적 구성요소와 동작이 다르다. 하지만 모든 실행 컨텍스트는 아래의 과정을 거친다.

1. 평가

- 선언부를 파악하는 과정
- 실행 컨텍스트를 생성하고 변수나 함수 등의 선언문을 파악하여  
   현재 스코프 내에서 사용할 수 있는 변수, 함수의 식별자를 실행 컨텍스트에 등록하는 과정이다.
  \*\* 호이스팅: 식별자가 코드블록 가장 위로 끌어올려짐을 표현하는 용어

2. 실행

- 선언문을 제외한 소스코드를 실행하는 과정
- 소스코드 실행에 필요한 정보, 즉 변수나 함수의 참조를 실행 컨텍스트에서 찾는다.  
  실행과정에서 일어나는 변수 값의 변경 등은 다시 실행 컨텍스트에 등록된다.

## 실행 컨텍스트의 구조

- 모든 실행 컨텍스트는 객체 구조로 내부적으로 여러 프로퍼티들을 가지고 있다.  
  각 프로퍼티들은 고유한 정보를 표현한다.
- LexicalEnvironment 객체: 스코프 관리, 변수와 함수의 정의와 값을 저장
  - 영역:
    - EnviornmentRecord: 식별자 등록 및 관리
    - OuterLexicalEnvironmentReference: 상위 스코프 참조, 이를 통해 상위 영역에 있는 식별자 접근 가능
  - 평가 과정에서의 동작:
    1. 식별자 생성
    2. this binding
    3. 참조할 외부환경 결정
  - 실행 과정에서의 동작:
    - 평가 과정에서 생성된 정보들을 기반으로 값들을 변경

### 전역 실행 컨텍스트 평가 과정

1. 자바스크립트 코드가 실행되면 먼저 전역 객체가 생성된다.  
   전역 객체는 자바스크립트에 포함된 빌트인 객체, 함수를 포함한다. 이는 자바스크립트 실행환경(node, browser)에 따라 일부 달라진다.  
   e.g. 전역객체: node - global, browser - window
2. 그 다음 전역 코드가 평가되며 GlobalExecutionContext 가 생성되고, 그 내부에 GlobalLexicalEnvironment 가 생성된다.  
    GlobalLexicalEnvironment 의 프로퍼티:

   - ObjectEnvironmentRecord:
     - `let`, `const` 외의 영역인 `var`, 전역 함수, 빌트인 프로퍼티 등을 관리
     - BindingObject 프로퍼티에서 전역객체를 참조한다.
     - `var` 로 선언한 변수, 전역에 선언된 함수는 BindingObject 를 통해 전역객체의 프로퍼티로 등록된다.
     - `var` 로 선언한 전역변수는 `undefined` 로 초기화되며, 전역함수는 `<function object>` 이다.
   - Declarative Environment Record:
     - `let`, `const` 로 선언한 변수 관리
     - 초기화 되지 않았을 경우 `<uninitialized>` 이다.
     - 선언과 초기화가 분리되어 실행되므로 `var` 로 선언한 변수와 달리 초기화 전까지는 접근할 수 없다(TDZ).

3. this 값에 대한 참조는 GlobalThisValue 프로퍼티에 저장된다. 전역 코드의 this 는 전역 객체를 가리키므로 GlobalThisValue 의 값은 global 이다.
4. 마지막으로 전역 실행 컨텍스트는 최상위 스코프이므로, 외부 환경에 대한 참조값은 `null` 이 된다.

### 함수 실행 컨텍스트 평가 과정

1. 전역 실행 컨텍스트를 통해 코드 실행 중, 일반 전역함수 `foo` 가 호출된다. 함수가 호출되면 함수 실행 컨텍스트를 생성하고 스택에 push 한다.  
   함수 실행 컨텍스트에도 LexicalEnvironment 가 생성된다. 그 내부에는 FunctionEnvironmentRecord 가 생성된다. 이 안에 매개변수와 함수 내부의 지역변수가 저장된다.
2. 함수의 this 참조값은 *함수가 호출*되는 상황에 따라 결정된다. 호출된 함수 `foo` 의 this 값은 전역객체이다.
3. 함수의 외부 환경에 대한 참조를 결정한다. 함수의 정의는 *함수를 평가*할 때 결정된다. 따라서 평가 시점에 실행 중인 실행 컨텍스트가 함수의 OuterLexicalEnvironmentReference 가 된다.  
   `foo` 함수는 전역 실행 컨텍스트에서 평가되었으므로, 함수의 외부 참조값은 전역 실행 컨텍스트의 LexicalEnvironment 이다. 따라서 FunctionExecutionContext 안에서 GlobalLexicalEnvironment 에 정의된 값들에 접근 및 사용할 수 있다.

> 함수의 실행 컨텍스트는 함수 호출 시점에 생성되지만, *함수의 외부 환경에 대한 참조*는 어디서 호출되었는지가 아닌 *어디서 정의되었는지*에 따라 결정된다.

- 자바스크립트 엔진이 함수 정의를 평가하여 함수 객체를 생성할 때,  
  실행 중인 실행 컨텍스트의 렉시컬 환경을 함수 객체의 내부 슬롯 `[[Environment]]` 에 저장한다.
  그리고 함수의 OuterEnvironmentRecord Reference에 할당되는 값은 함수 객체의 내부슬롯 `[[Environment]]` 에 저장된 렉시컬 환경에 대한 참조이다.
- 실행 컨텍스트와 렉시컬 환경이 별개이므로 Closure 개념이 성립된다. 실행 컨텍스트는 해당 컨텍스트 안의 모든 코드를 실행하고 나면 콜스택에서 제거되지만, 렉시컬 환경도 제거되는 것은 아니다.  
  렉시컬 환경은 실행 컨텍스트에 의해 참조될 뿐, 독립적인 객체이다. 참조 카운트가 0 이 됐을 때 Garbage Collection 대상이 되어 메모리에서 소멸된다.  
  따라서 외부 함수의 실행 컨텍스트 내에서 정의된 내부함수가 외부함수의 렉시컬 환경을 계속 참조하고 있다면 외부함수의 렉시컬 환경은 소멸되지 않는다.

```js
const global = {
  // 전역 객체
  console: {
    log() {},
  },
  x: undefined, // var로 선언한 전역변수 x, undefined로 초기화
  foo: {
    [[Environment]]: GlobalExecutionContext.GlobalLexicalEnvironment,
  }, // 전역함수 foo
};

const GlobalExecutionContext = {
  GlobalLexicalEnvironment: {
    GlobalEnvironmentRecord: {
      ObjectEnvironmentRecord: {
        BindingObject: global,
      },
      DeclarativeEnvironmentRecord: {
        a: '<uninitialized>', // const로 선언한 전역변수 a, 초기화 되지 않음
      },
    },
  },
};

const FooFunctionExecutionContext = {
  LexicalEnvironment: {
    FunctonEnvironmentRecord: {
      b: '<uninitialized>',
      bar: '<function object>',
      ThisValue: global,
    },
    OuterEnvironmentReference: global.foo[[Environment]],
    // 함수 객체의 [[Environment]] 값 참조
  },
};
```

### 함수 실행 컨텍스트 실행 과정

- 평가 과정에서 수행한 식별자 정의, this binding, 외부 환경 참조 결정 과정이 모두 완료되면 실행 과정에서 실제 값들이 할당된다.

1. `foo` 함수 실행 과정에서 내부함수 `bar` 함수가 호출되어 `bar` 함수의 실행 컨텍스트가 생성된다. 마찬가지로 평가와 실행 과정을 거친다. `bar` 함수에서 `console.log()` 를 호출하면 `console` 객체의 `log` 메서드를 찾아야 한다.
2. 자바스크립트에서는 실행 컨텍스트 안에서 원하는 식별자를 찾을 수 없으면 OuterEnvironmentReference 에 접근해서 원하는 식별자가 있는지 검색한다. `bar` Context 의 외부 참조는 `foo` Context 의 LexicalEnvironment 이므로 해당 객체에 접근해서 탐색하는 과정을 수행한다.  
   `foo` Context 에 원하는 값이 없다면 원하는 값을 찾을 때까지 계속해서 참조를 거슬러 올라간다. `foo` 의 참조는 GlobalLexicalEnvironemnt이므로 해당 객체에 접근한다.
3. GlobalLexicalEnvironment 내부에서 BindingObject 를 통해 global 의 `console` 객체를 찾으면 `log` 메서드를 실행한다.

- 이러한 원리를 통해 자바스크립트의 스코프가 형성된다. 만약 외부 환경에 대한 참조가 `null` 이 될 때까지 원하는 값을 찾지 못한다면 `ReferenceError: {indetifier} is not defined` 오류가 발생한다.

## 주의

```js
function print() {
  console.log('this', this);
}

const obj = {
  a: 'aaaa',
  print: print,
};

obj.print(); // this 는 전역객체가 아닌 obj 이다.
```
