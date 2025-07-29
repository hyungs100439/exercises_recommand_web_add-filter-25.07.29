import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [goal, setGoal] = useState("다이어트");
  const [env, setEnv] = useState("실내");
  const [body, setBody] = useState("전신");
  const [noise, setNoise] = useState("제한없음");
  const [results, setResults] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasRecommended, setHasRecommended] = useState(false);

  // 필터/정렬 관련 상태
  const [noiseFilters, setNoiseFilters] = useState([]);
  const [sortByCalorie, setSortByCalorie] = useState(false);
  const [calorieOrder, setCalorieOrder] = useState("desc");
  const [showNoiseOptions, setShowNoiseOptions] = useState(false);
  const [showCalorieOptions, setShowCalorieOptions] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // 페이지 로드시 전체 운동 목록 불러오기
  useEffect(() => {
    fetch("/api/all_exercises")
      .then(res => res.json())
      .then(data => setAllExercises(data.exercises))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, env, body, noise }),
    });
    const data = await response.json();
    setResults(data.exercises);
    setHasRecommended(true);
    setLoading(false);
    setNoiseFilters([]);
    setSortByCalorie(false);
  };

  const noiseOrder = { "적음": 0, "보통": 1, "큼": 2 };

  // 추천 여부에 따라 기본 데이터 결정
  const baseData = hasRecommended ? results : allExercises;
  let filteredResults = [...baseData];

  // 소음 필터 적용
  if (noiseFilters.length > 0) {
    filteredResults = filteredResults.filter(item => noiseFilters.includes(item[3]));
  }

  // 정렬 (소음 → 칼로리)
  if (sortByCalorie && filteredResults.length > 0) {
    filteredResults.sort((a, b) => {
      const nDiff = noiseOrder[a[3]] - noiseOrder[b[3]];
      if (nDiff !== 0) return nDiff;
      return calorieOrder === "desc" ? b[2] - a[2] : a[2] - b[2];
    });
  }

  const toggleNoiseFilter = (level) => {
    setNoiseFilters(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">맞춤 운동 추천</h1>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">운동 목적</label>
            <select className="form-select" value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option>다이어트</option>
              <option>건강</option>
              <option>자기관리</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">운동 환경</label>
            <select className="form-select" value={env} onChange={(e) => setEnv(e.target.value)}>
              <option>실내</option>
              <option>야외</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">운동 부위</label>
            <select className="form-select" value={body} onChange={(e) => setBody(e.target.value)}>
              <option>전신</option>
              <option>상체</option>
              <option>하체</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">소음 수준(제한)</label>
            <select className="form-select" value={noise} onChange={(e) => setNoise(e.target.value)}>
              <option>제한없음</option>
              <option>적음</option>
              <option>보통</option>
              <option>큼</option>
            </select>
          </div>
        </div>
        <button className="btn btn-success mt-4 w-100">추천받기</button>
      </form>

      <h2 className="text-center mb-4">
        {hasRecommended ? "추천 결과" : "전체 운동 목록"}
      </h2>

      {loading && <div className="text-center"><div className="spinner-border" /></div>}

      {!loading && filteredResults.length === 0 && (
        <p className="text-center text-muted">운동 목록이 없습니다.</p>
      )}

      {!loading && filteredResults.length > 0 && (
        <>
          {/* 필터/정렬 전체 패널 */}
          <div className="card p-3 shadow-sm mb-3">
            <div
              className="fw-bold text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              필터 / 정렬 {showFilterPanel ? "▾" : "▸"}
            </div>

            {showFilterPanel && (
              <div className="mt-3">
                <p className="text-muted small">항목을 클릭해 세부 옵션을 열어보세요</p>

                {/* 소음 카테고리 */}
                <div className="mb-2">
                  <div
                    className="fw-bold text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowNoiseOptions(!showNoiseOptions)}
                  >
                    소음 {showNoiseOptions ? "▾" : "▸"}
                  </div>
                  {showNoiseOptions && (
                    <div className="mt-2 ms-3 d-flex flex-wrap gap-3">
                      {["적음", "보통", "큼"].map(level => (
                        <div key={level} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`noise-${level}`}
                            checked={noiseFilters.includes(level)}
                            onChange={() => toggleNoiseFilter(level)}
                          />
                          <label htmlFor={`noise-${level}`} className="form-check-label">
                            {level}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 칼로리 카테고리 */}
                <div className="mb-2">
                  <div
                    className="fw-bold text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowCalorieOptions(!showCalorieOptions)}
                  >
                    칼로리 {showCalorieOptions ? "▾" : "▸"}
                  </div>
                  {showCalorieOptions && (
                    <div className="mt-2 ms-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="calorieOrder"
                          id="calorie-desc"
                          value="desc"
                          checked={sortByCalorie && calorieOrder === "desc"}
                          onChange={() => {
                            setSortByCalorie(true);
                            setCalorieOrder("desc");
                          }}
                        />
                        <label htmlFor="calorie-desc" className="form-check-label">
                          높은 순
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="calorieOrder"
                          id="calorie-asc"
                          value="asc"
                          checked={sortByCalorie && calorieOrder === "asc"}
                          onChange={() => {
                            setSortByCalorie(true);
                            setCalorieOrder("asc");
                          }}
                        />
                        <label htmlFor="calorie-asc" className="form-check-label">
                          낮은 순
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="calorieOrder"
                          id="calorie-none"
                          checked={!sortByCalorie}
                          onChange={() => setSortByCalorie(false)}
                        />
                        <label htmlFor="calorie-none" className="form-check-label">
                          정렬 안 함
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 결과 카드 */}
          <div className="row justify-content-center">
            {filteredResults.map((r, idx) => (
              <div key={idx} className="col-md-5 col-lg-4 mb-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5>{r[0]}</h5>
                    <p>칼로리: {r[2]} kcal / 소음: {r[3]}</p>
                    <a href={r[1]} target="_blank" rel="noreferrer" className="btn btn-outline-success btn-sm">
                      영상 보기
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
