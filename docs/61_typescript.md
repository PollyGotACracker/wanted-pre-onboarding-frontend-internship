# TypeScript

- 자바스크립트에 타입 기능을 추가한 슈퍼셋
- 안정성, 표현력: 강타입(정적타입) 언어, 컴파일 언어
- 범용성: 자바스크립트를 사용할 수 있는 곳에는 어디든지 활용할 수 있음
- 모든 변수를 선언하는 시점에서 해당 변수의 타입을 반드시 지정
- 지정된 타입을 벗어나는 값은 해당 변수에 할당 불가
- Java, C 와 같은 전통적인 컴파일 언어들은 기계어로 컴파일 되는 반면, 타입스크립트는 최종적으로 자바스크립트로 컴파일

## 특징

### 1. 안정성

- 코드를 작성하는 과정에서 엄격한 규칙을 지켜야 한다(제약 발생).
- 개발자가 실수하거나, 권장되지 않은 방식으로 코드를 작성할 확률을 줄여 안정성이 높아진다.
- 타입 관련 문제가 있을 경우 '컴파일 단계'에서 에러를 확인 가능하다.  
  따라서 최종적으로 컴파일되고 애플리케이션에서 실행되는 자바스크립트 코드에 타입 문제가 없음을 확신할 수 있게 된다.

### 2. 표현력

- 타입이라는 추가적인 개념을 통해 읽는 사람에게 정보 전달이 가능하다.
- 타입은 추상과 구체를 구분짓고, 추상만으로 코드를 읽고 이해하여 상호 소통하도록 할 수 있다.  
  여기서 추상이란 '해당 코드가 무엇을 한다', 구체는 '어떻게 동작을 수행한다' 를 표현하는 정보이다.
- 코드를 사용하는 입장에서 구체의 가치는 상대적으로 낮거나, 알 필요 없는 것이다.
- 타입시스템은 구체적 동작이 아닌 추상에 맞춰 코드를 작성함으로써 다양한 스타일의 코드 작성 기법을 활용할 수 있게 한다.

## 타입

- 타입이 명확한 상황에서는 타입을 명시적으로 지정하지 않아도 자동 추론한다.

### 기본적인 타입

- `string`, `number`, `boolean`
- `any`: 어떤 타입이라도 할당 가능, 제한적으로 사용할 것:
  - 라이브러리, 프레임워크 등 제어할 수 없는 상황을 극복하기 위해
  - 확실히 안전함을 보장할 수 있지만 타입 지정이 까다로울 때
- 배열:
  - `number[]` 또는 `Array<number>`(Generic 사용)
- 튜플:
  - length 와 각 element 타입이 고정된 배열 `[number, number]`
- 객체:
  - `{ x: number, y: number }`
- Optional: `?`
  - `{ x: number, y?: number }`  
    -> x + (y || 0)
    -> default parameter`{ x: number = 0 }` 와 같음
- Type Alias: 데이터 타입을 변수처럼 선언해 저장해둔 뒤 활용

```ts
type Point = {
  x: number;
  y: number;
};

const startPoint: Point = { x: 1, y: 1 };
const endPoint: Point = { x: 10, y: 15 };
```

- Interface: 객체의 타입을 지정

```ts
interface Point {
  x: number;
  y: number;
}
const startPoint: Point = { x: 1, y: 1 };
const endPoint: Point = { x: 10, y: 15 };
```

### Type vs Interface

- 기능상의 차이는 우리가 실제 사용하는 케이스에서는 거의 없다. Type 의 특성을 사용할 필요가 없다면 Interface 를 써라.
- 멘토 님의 작성법:
  - 기존 프로젝트의 경우 정의된 컨벤션을 따른다.
  - Interface 는 Object 의 추상을 표현하고 싶을 때:
    1. Class 에서 이 Interface 를 구현하고 싶을 때
    2. 해당 Object 의 변수와 동작을 표현하고 싶을 때
  - 그 외의 경우 Type  
     e.g. React Props, React State, 변수만 있는 Object

### Advanced Type

- Literal Type:

  - 범용적인 `string`, `number` 타입이 아닌 정확한 형태의 값을 타입으로 지정
  - `const` 를 사용할 경우 자동 추론되어 자주 쓰이지 않는다.

```js
const polly: 'parrot' = 'parrot';
```

- `as const`:

  - 객체나 배열을 상수로 선언하는 키워드(`readonly`)
  - 값을 변경하는 메서드 사용 또는 재할당이 불가능
  - styled-components 등을 사용해 디자인 토큰 정의 시, 토큰 값을 확인할 때 유용함

```ts
// arr.push(4) => X
const arr = [1, 2, 3] as const;

// 각 속성의 값을 툴팁으로 표시
const obj = { x: 1, y: 2 } as const;
```

- Union: `|`
  - `===` 타입의 OR 연산자

```ts
let age: string | number = 1;
age = '1';

type People = {
  name: sting;
  age: number;
  gender: 'male' | 'female';
  hobby: string;
};
```

- Generic:
  - 타입을 인자처럼 활용

```ts
function map<T>(array:T[], callback:(...args:any[]) => any;) {
	const result = [];

	for(const element of array){
		result.push(callback(element));
	};

	return result;
}
// 각각 number, string 배열 사용 가능
map<number>([1,2,3,4], x => x + 1);
map<string>(["hello", "world"], x => x.toUpperCase());
```

- `keyof`:
  - 객체 타입에서 key 만 추출하여 Union 으로 사용

```ts
type People = {
  name: sting;
  age: number;
  gender: 'male' | 'female';
  hobby: string;
};

// name | age | gender | hobby
type KeyOfPeople = keyof People;
```

- `typeof`:

  - 객체 타입에서 type 만 추출
  - 단, 모든 속성의 값이 literal 일 경우 가능

```ts
const polly = {
  name: 'polly',
  age: 100,
  gender: 'female',
  hobby: 'biting',
};

/*
{
    name: string;
    age: number;
    gender: string;
    hobby: string;
}
*/
type Parrot = typeof polly;
// "name" | "age" | "gender" | "hobby"
```

- narrowing:
  - 타입의 범위를 좁혀나가기
  - 조건에 맞는 타입일 때 코드 실행

```ts
const toUpper = (arg: string | number) => {
  if (typeof arg === 'string') {
    arg.toUpperCase();
  }
};
```
