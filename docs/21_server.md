# Server

## 1. 온 프레미스(On-Premise)

- 기본적, 전통적인 방식
- 서버 운영 측에서 물리적 제반 시설 등을 직접 구축
- 직접 물리적인 서버를 구축하고 관리
- 하드웨어 구입, 서버실을 구성하고 설계
- 지속적 모니터링(전력, 온도 유지, 화재, 천재지변 대응 등)
- 보안이 중시되는 경우 선택

## 2. 클라우드 컴퓨팅(Cloud Computing)

- 90% 이상 사용되는 방식
- 인터넷을 이용한 클라우드 서비스 사용
- cloud service provider 를 원하는 사양을 원하는 시간만큼 대여해서 사용
- 물리적 관리에 대한 필요성이 없어지고 더 안정적인 환경을 제공받을 수 있음
- 비용 측면에서 효율적이며, 컴퓨터 사양, 갯수, 자동화 등 서비스 확장에 유리

  ### 클라우드 컴퓨팅의 구분

  - 제공하는 서비스의 수준에 따라 3개의 계층으로 구분된다.

  #### 2.1. IaaS(Infrastructure as a Service)

  - 인프라 구축에 필요한 컴퓨터를 대여해주는 것
  - 대여받은 컴퓨터의 대부분의 리소스에 접근하여 서비스 구성 및 관리 가능
  - 가장 많은 제어권을 갖지만 사용자가 많은 부분을 구성 및 관리해주어야 한다
  - e.g. AWS 의 EC2 (Elastic Cloud Computing)

  #### 2.2. PaaS(Platform as a Service)

  - IaaS 에 더불어 소프트웨어를 개발하고 운영하는 데 필요한 구성요소를 플랫폼화해서 제공해주는 서비스
  - 소프트웨어 운영에 대한 관리를 PaaS에 위임 가능
  - 특정 플랫폼에 종속적이며, 접근을 허용하지 않는 부분은 제어 불가능, IaaS 에 비해 높은 비용 지불
  - e.g. AWS Elastic BeanStalk, Heroku, Github Pages

  _---위는 서비스 프로바이더, 아래는 서비스 소비자가 사용---_

  #### 2.3. SaaS(Software as a Service)

  - 클라우드 서비스에 더불어, 고객이 이를 사용할 수 있는 소프트웨어가 함께 제공
  - 애플리케이션 설치 불필요, 서비스를 활용하기 위한 소프트웨어 제공
  - e.g. DropBox, iCloud, Netflix, Google Apps, Slack

> - Serverless(Function as a Service)
>   - 함수 등록 외의 관리 필요성이 없어 마치 서버가 없는 것과 같은 서비스
>   - 함수 코드를 Service Cloud Provider 에 올리면, 요청이 올 때 응답을 준다
>   - e.g. AWS Lambda
