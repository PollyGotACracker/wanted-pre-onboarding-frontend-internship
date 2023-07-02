# AWS (Amazon Web Service)

- 전 세계에서 가장 많이 사용되고 있는 클라우드 컴퓨팅 서비스 (2위 Azure)
- 단순 컴퓨팅 자원 제공 뿐만 아니라 편리하게 관리할 수 있는 서비스, 서버리스 서비스 등 수많은 서비스를 확장성, 높은 보안 수준과 함께 제공

## AWS S3 (Simple Storage Service)

- [AWS S3: 정적 웹사이트 호스팅 문서](https://docs.aws.amazon.com/ko_kr/AmazonS3/latest/userguide/WebsiteHosting.html)
- 객체(파일)를 저장하고 인터넷 상으로 접근할 수 있게 하는 서비스
- 서비스에 필요한 이미지, 파일 등을 저장하는 데 주로 쓰이며, 정적 웹사이트 호스팅으로도 사용 가능  
  (동적으로 변하지 않는 데이터. 파일 내용을 변경하면 다시 build 해야 한다. 블로그 등)
- CRA 를 이용한 React 프로젝트의 build 파일을 브라우저에서 접근하여 실행하면 Client Side Rendering 을 통해 동작

> `npm run build` 한 후, `npx serve -s build` 시 나오는 network 주소로 build 파일의 배포 화면을 볼 수 있다.

### 1. 버킷 생성

1. 검색창에 S3 를 입력 후 들어간다.
2. 버킷(저장소) 이름을 작성한다. 버킷 이름은 전 세계에서 unique 해야 한다.
3. 리전은 가장 가까운 지역의 컴퓨터를 선택한다.
4. 그 외 다른 설정은 일단 건드리지 않고 버킷을 생성한다.
5. 버킷에 build 폴더 내 파일들을 업로드하고 닫기 버튼을 클릭한다.

### 2. 권한 설정

1. index.html 을 눌렀을 때 보이는 '객체 URL' 링크를 클릭하면 AccessDenied XML 을 띄울 것이다.  
   버킷 생성 시 퍼블릭 액세스를 막았기 때문이다.
2. 다시 버킷 객체 화면으로 되돌아가서 권한 탭을 클릭한 후, '퍼블릭 액세스 차단(버킷 설정)' 항목의 편집 버튼을 클릭한다.
3. '모든 퍼블릭 액세스 차단' 을 체크 해제 한 뒤 저장한다. '모든 퍼블릭 액세스 차단' 이 비활성화 된 것을 확인할 수 있다.
4. 같은 페이지에서 '버킷 정책' 항목의 '편집' 버튼을 클릭한다. 그리고 아래의 JSON 코드를 붙여넣는다.

#### 2.1. CRA 배포용 S3 Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::<bucket-name>/*"
    }
  ]
}
```

- "Version": 해당 버전의 문법을 사용 (최신 2012-10-17)
- "Statement": 배열 내 여러 정책 설정
  - "Sid": statement id. 배열 내에서 unique 식별자로 알기 쉽게 작성
  - "Effect": 접근 권한 허용 여부
  - "Principal": 허용할 대상 지정  
    '\*' 은 모든 대상에게 허용한다.
  - "Action": 어떤 행위를?
  - "Resource": 어떤 3S Bucket, 어떤 파일을?  
    현재 버킷의 ARN 뒤에 '/\*' 을 붙여 모든 파일에 대해 허용한다.
    (ARN;Amazon Resouce Name: AWS 에서 해당 버킷의 식별자)

5. 버킷의 '속성' 탭에 들어가서 '정적 웹 사이트 호스팅' 항목의 편집 버튼을 클릭한다.
   정적 웹사이트 호스팅을 활성화로 바꾼다.
6. 호스팅 유형은 정적 웹사이트 호스팅으로 두고, '인덱스 문서명'을 index.html, '오류 문서' 는 index.html 또는 별도로 만든 404 파일을 지정한 후 저장한다.
7. '정적 웹 사이트 호스팅' 항목을 다시 보면 '버킷 웹 사이트 엔드포인트' 에 URL 주소가 생성된 것을 볼 수 있다.

- 하지만 파일을 수정할 때마다 다시 빌드 후 배포하는 과정을 거쳐야 한다. 따라서 이를 자동화하는 것이 좋다.

### 3. [AWS CLI: Command Line Interface](https://aws.amazon.com/ko/cli/)

- AWS 동작들을 명령어로 자동화하는 툴

1. 운영체제에 맞는 설치 프로그램을 다운로드하여 실행한다.
2. 설치가 완료되면 VSCode 터미널에 아래 명령어를 입력하여 설치가 정상적으로 되었는지 확인한다.

```
aws --version
```

- 'aws'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는 배치 파일이 아닙니다. 가 뜰 경우 VSCode 를 다시 실행한다.
- 그럼에도 문제가 지속되면 AWSCLIV2 가 환경 변수에 추가되었는지 확인한다.

  1. 제어판의 '시스템 환경 변수 편집'
  2. '환경 변수' 버튼 클릭
  3. '시스템 변수' 목록에서 'Path' 를 선택한 후 '편집' 버튼 클릭
  4. '새로 만들기' 를 클릭해서 `C:\Program Files\Amazon\AWSCLIV2\` 입력

#### 3.1. 보안자격증명

- 액세스 키, 비밀 액세스 키 생성 및 설정

1. 루트가 아닌 IAM 계정으로 로그인해야 한다. 우측 상단의 내 닉네임을 클릭하고 '계정' 메뉴로 들어간다.
2. '결제 정보에 대한 IAM 사용자 및 역할 액세스정보' 항목에서 IAM 액세스 활성화 를 체크한 후 저장한다.
3. 검색 창에 IAM 을 입력 후 들어가면, 왼쪽 메뉴에 '사용자' 를 클릭하고 '사용자 추가' 버튼을 클릭한다.
4. 사용자 이름은 Administrator 등 원하는 이름, 'AWS Management Console에 대한 사용자 액세스 권한 제공' 에 체크  
   4.1. 'IAM 사용자를 생성하고 싶음' 체크  
   4.2. 사용자 지정 암호 입력  
   4.3. 'Users must create a new password at next sign-in - Recommended' 체크 해제. 다음 버튼 클릭  
   4.4. 그룹에 사용자 추가 탭에서 '그룹 생성' 버튼 클릭  
   4.5. 그룹 이름은 'Administrators', 아래 목록에서 'AdministratorAccess' 를 찾아 체크 후 '사용자 그룹 생성' 버튼 클릭  
   4.6. 생성된 그룹을 체크하고 다음 버튼 클릭  
   4.7. 추가할 태그가 있다면 추가하고 '사용자 생성' 버튼 클릭  
   4.8. 생성이 완료되면 csv 파일을 다운로드 하거나 이메일 전송 버튼을 클릭  
   4.9. 로그인 URL 에서 계정 ID 12자리 숫자를 확인
5. IAM 계정으로 로그인 후, AWS 콘솔에서 우측 상단의 사용자 이름을 클릭하고 '보안 자격 증명' 메뉴로 들어간다.
6. '액세스 키' 항목에서 '액세스 키 만들기' 버튼을 클릭한다.
7. '액세스 키 모범 사례 및 대안' 페이지에서 사용 사례를 'Command Line Interface(CLI)' 로 선택
8. '위의 권장 사항을 이해했으며 액세스 키 생성을 계속하려고 합니다.' 체크 후 다음 버튼 클릭
9. 추가할 태그가 있다면 추가 후 '액세스 키 만들기' 버튼 클릭
10. 페이지를 벗어나면 비밀 액세스 키를 다시 볼 수 없으므로 csv 파일로 다운로드 하거나 별도로 메모해둔다.

> - !! Secret Access Key의 / 또는 % 등 특수문자가 포함되어 있을 때 키를 재생성 할 것 !!
> - GitHub Actions 에서 deploy 시 SignatureDoesNotMatch 오류가 발생하는 원인이 된다.

- 터미널에서 액세스 키를 설정한다.
- `--profile` 옵션: 별명을 지정할 수 있다. 옵션이 없다면 default 로 설정되므로 필요한 경우에만 지정하도록 한다.

```
aws configure [--profile <alias>]
```

- `AWS Access Key ID [None]`, `AWS Secret Access Key [None]` 에 각각 액세스 키와 비밀 액세스 키를 입력한다.
- `Default region name [None]` 은 가까운 지역, 서울이므로 ap-northeast-2 을 입력한다.
- `Default output format [None]` 은 생략한다.
- 이제 아래 명령어로 프로필을 확인할 수 있다.

```
aws configure list-profiles
```

- 아래 명령어로 버킷 안의 객체에 접근할 수 있는지 확인할 수 있다.

```
aws s3 ls s3://<bucket-name> [--profile <alias>]
```

#### 3.2. 자동화 명령어

- 이제 이전 파일을 삭제하고 새로운 build 파일을 올릴 수 있다.
- package.json 의 scripts 에 `"deploy"` 단축어로 아래 스크립트를 작성한다.

```
npm run build && aws s3 sync build/ s3://<bucket-name> --delete [--profile <alias>]
```

- `npm run deploy` 를 실행하여 페이지가 업데이트 되는지 확인한다.

> - 서버사이드 렌더링(SSR)
>   - Next.js, Remix
>   - 동적인 웹사이트 개발에 사용
>   - 서버 측에서 html 내용을 바꿔 응답
>   - 정적 웹사이트는 서버에서 주는 파일 내용이 변하지 않는다.
