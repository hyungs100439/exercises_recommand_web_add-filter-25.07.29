# Exercise Recommendation Web App

Flask + React 기반의 맞춤 운동 추천 웹 애플리케이션입니다.  
사용자는 운동 목적, 환경, 부위, 소음 수준을 선택해 맞춤형 운동을 추천받을 수 있으며,  
추천 전에는 전체 운동 목록을 필터/정렬 기능으로 탐색할 수 있습니다.

---

## 주요 기능

- 운동 목적 / 환경 / 부위 / 소음 조건에 따라 운동 추천
- 추천 전에는 **전체 운동 목록을 볼 수 있고**, 추천 후에는 맞춤 추천 목록만 표시
- 필터 기능:
  - 소음 수준 (적음/보통/큼)
  - 칼로리 정렬 (높은 순 / 낮은 순)
- React 프론트엔드 + Flask 백엔드 통합 실행

---

## 폴더 구조

```
my_exercise_web/
  app.py                # Flask 서버 실행 진입점
  requirements.txt      # Flask 의존성 목록
  exercise-web/         # React 프론트엔드
    src/                # React 소스코드
    package.json
```

---

## 실행 방법

### 1. 저장소 클론

```bash
git clone https://github.com/yourname/my_exercise_web.git
cd my_exercise_web
```

---

### 2. Python (Flask) 환경 설정

Python 3.10 이상 권장

```bash
# 가상환경 (선택)
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# Flask 의존성 설치
pip install -r requirements.txt
```

---

### 3. React (프론트엔드) 환경 설정

```bash
cd exercise-web
npm install
```

---

### 4. React 빌드

```bash
npm run build
cd ..
```

---

### 5. Flask 서버 실행

```bash
python app.py
```

브라우저에서 [http://127.0.0.1:5000](http://127.0.0.1:5000) 접속

---

## 개발 모드 (React + Flask 분리 실행)

프론트엔드만 별도로 실행하고 싶다면:

```bash
cd exercise-web
npm start
```

React 개발 서버는 http://localhost:3000  
Flask API 서버는 http://localhost:5000

---

## 기술 스택

- Frontend: React (JavaScript)
- Backend: Flask (Python)

---

## 주의

- `node_modules`와 `build` 폴더는 GitHub에 포함하지 않았습니다.
- 저장소를 내려받은 뒤 반드시 `npm install`, `npm run build`를 실행하세요.
