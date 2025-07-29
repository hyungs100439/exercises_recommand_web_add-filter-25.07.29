
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder="exercise-web/build", static_url_path="")
CORS(app)

# 운동 추천 데이터
exercise_db = {
    "다이어트": {
        "실내": {
            "전신": [
                ("버피", "https://youtu.be/qLBImHhCXSw", 80, "큼"),
                ("점핑잭", "https://youtu.be/c4DAnQ6DtF8", 50, "큼"),
                ("플랭크", "https://youtu.be/pSHjTRCQxIw", 35, "적음"),
            ],
            "하체": [
                ("스쿼트", "https://youtu.be/aclHkVaku9U", 40, "적음"),
                ("런지", "https://youtu.be/QOVaHwm-Q6U", 45, "보통")
            ],
        },
        "야외": {
            "전신": [
                ("조깅", "https://youtu.be/-Z2B6dffQfA", 70, "보통"),
                ("줄넘기", "https://youtu.be/1J6bZ8F5yPo", 90, "큼")
            ],
            "하체": [
                ("계단 오르기", "https://youtu.be/epUvG4qgyRQ", 85, "보통"),
            ],
        }
    },
    "건강": {
        "실내": {
            "상체": [
                ("푸쉬업", "https://youtu.be/_l3ySVKYVJ8", 35, "보통"),
                ("밴드 스트레칭", "https://youtu.be/Z3p28IZ9A8g", 20, "적음"),
            ],
            "하체": [
                ("스쿼트", "https://youtu.be/aclHkVaku9U", 40, "적음"),
            ],
        },
        "야외": {
            "전신": [
                ("걷기", "https://youtu.be/eNWlB36B1W0", 40, "적음"),
            ],
        }
    },
    "자기관리": {
        "실내": {
            "전신": [
                ("요가", "https://youtu.be/v7AYKMP6rOE", 25, "적음"),
                ("필라테스", "https://youtu.be/lCg_gh_fppI", 30, "적음"),
            ]
        },
        "야외": {
            "전신": [
                ("가벼운 산책", "https://youtu.be/eNWlB36B1W0", 30, "적음"),
            ]
        }
    }
}

@app.route("/api/all_exercises", methods=["GET"])
def all_exercises():
    all_list = []
    for goal in exercise_db:
        for env in exercise_db[goal]:
            for body in exercise_db[goal][env]:
                for ex in exercise_db[goal][env][body]:
                    all_list.append(ex)
    return jsonify({"exercises": all_list})

@app.route("/")
def serve():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/api/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    goal = data["goal"]
    env = data["env"]
    body = data["body"]
    noise_pref = data["noise"]

    # (기존 로직 그대로)
    exercises = exercise_db.get(goal, {}).get(env, {}).get(body, [])
    noise_order = {"적음": 0, "보통": 1, "큼": 2}

    if noise_pref != "제한없음":
        max_level = noise_order.get(noise_pref, 2)
        exercises = [ex for ex in exercises if noise_order.get(ex[3], 3) <= max_level]

    # if env == "실내":
    #     exercises = sorted(exercises, key=lambda x: (noise_order.get(x[3], 3), -x[2]))
    # else:
    #     exercises = sorted(exercises, key=lambda x: x[2], reverse=True)

    return jsonify({
        "goal": goal,
        "env": env,
        "body": body,
        "exercises": exercises
    })

    # return render_template("index.html")



if __name__ == "__main__":
    app.run(debug=True)
