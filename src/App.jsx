import { useState, useEffect } from "react";
import { seats } from "./seatData";

const ORIGINAL_WIDTH = 1980;
const DISPLAY_WIDTH = 900;
const SCALE = DISPLAY_WIDTH / ORIGINAL_WIDTH;

// 두 번째 배치도
// 실제 이미지 원본 크기에 맞게 수정하면 됨
const SECOND_ORIGINAL_WIDTH = 820;
const SECOND_DISPLAY_WIDTH = 400//900;
const SECOND_SCALE =
  SECOND_DISPLAY_WIDTH / SECOND_ORIGINAL_WIDTH;

const GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1iyU0ca1DnqYdwTKUFRMD5VXusyJPu3HmvmjIXJNzwro/edit?usp=sharing";

const REGULATION_URL =
  "https://drive.google.com/drive/folders/189pAfLVi_WTLBqZNeeNsnbyxtjIE9zpH?usp=sharing";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz1_dnBlUlRA48ZVz47OcXuBB7Y3MO4vFYwYvRL4coPwpOtR9TFMx8r6RM_tShQMNmK/exec";

function App() {
  const [seatUsers, setSeatUsers] = useState({});

  // 입력창 상태
  const [editingSeat, setEditingSeat] = useState(null);
  const [userName, setUserName] = useState("");
  const [professor, setProfessor] = useState("");

  useEffect(() => {
    loadSeats();
  }, []);

  // Google Sheets에서 좌석 정보 불러오기
  async function loadSeats() {
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const data = await response.json();

      const obj = {};

      data.forEach((seat) => {
        obj[seat.id] = {
          user_name: seat.user_name || "",
          professor: seat.professor || "",
        };
      });

      setSeatUsers(obj);
    } catch (error) {
      console.error("Google Sheets 불러오기 오류:", error);
    }
  }

  // 좌석 클릭
  const handleSeatClick = (id) => {
    const current = seatUsers[id] || {};

    setEditingSeat(id);
    setUserName(current.user_name || "");
    setProfessor(current.professor || "");
  };

  // 저장
  const handleSave = () => {
  const savedUserName = userName.trim();
  const savedProfessor = professor.trim();
  const savedSeatId = editingSeat;

  // 둘 다 비어 있으면 빈 좌석으로 저장
  setSeatUsers((prev) => ({
    ...prev,
    [savedSeatId]: {
      user_name: savedUserName,
      professor: savedProfessor,
    },
  }));

  // 입력창 바로 닫기
  setEditingSeat(null);
  setUserName("");
  setProfessor("");

  // Google Sheets 저장
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      id: savedSeatId,
      user_name: savedUserName,
      professor: savedProfessor,
    }),
  }).catch((error) => {
    console.error("Google Sheets 저장 오류:", error);
  });
};

  // 입력창 취소
  const handleCancel = () => {
    setEditingSeat(null);
    setUserName("");
    setProfessor("");
  };

  return (
    <>
      {/* =========================
          첫 번째 배치도
          좌석 1 ~ 41
      ========================= */}
      <div
        style={{
          position: "relative",
          width: DISPLAY_WIDTH,
          display: "inline-block",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 15,
            top: 10,
            fontSize: "18px",
            fontWeight: "bold",
            color: "#000",
            zIndex: 2000,
          }}
        >
          TE1108호
        </div>
        <img
          src="/floor.png"
          alt=""
          style={{
            width: "100%",
            display: "block",
          }}
        />

        {/* 1 ~ 41번 좌석 */}
        {seats
          .filter((seat) => seat.id <= 41)
          .map((seat) => (
            <div
              key={seat.id}
              style={{
                position: "absolute",
                left: seat.x * SCALE,
                top: seat.y * SCALE,
                width: 20,
                height: 20,
                zIndex: 100,
              }}
            >
              {/* 좌석 번호 버튼 */}
              <button
                onClick={() => handleSeatClick(seat.id)}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,

                  width: 20,
                  height: 20,
                  borderRadius: "50%",

                  background:
                  seatUsers[seat.id]?.user_name || seatUsers[seat.id]?.professor
                    ? "#ef4444"
                    : "#16a34a",

                  color: "#fff",
                  border: "2px solid white",

                  fontSize: "10px",
                  fontWeight: "bold",

                  cursor: "pointer",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  padding: 0,

                  transform: "translate(-50%, -50%)",
                }}
              >
                {seat.id}
              </button>

              {/* 사용자 이름 + 교수님 이름 */}
              {(seatUsers[seat.id]?.user_name || seatUsers[seat.id]?.professor) && (
              <span
                style={{
                  position: "absolute",

                  left: 0,
                  top: 10,

                  fontSize: "9px",
                  fontWeight: "bold",
                  color: "#000000",

                  whiteSpace: "nowrap",
                  textAlign: "center",

                  transform: "translateX(-50%)",

                  lineHeight: "11px",

                  pointerEvents: "none",

                  background: "rgba(255, 255, 255, 0.7)",
                  padding: "1px 2px",
                  borderRadius: "2px",
                }}
              >
                {seatUsers[seat.id]?.user_name}
                {seatUsers[seat.id]?.user_name && seatUsers[seat.id]?.professor && <br />}
                {seatUsers[seat.id]?.professor && `(${seatUsers[seat.id]?.professor})`}
              </span>
            )}
            </div>
          ))}

        {/* =========================
            안내 링크
            첫 번째 배치도 안쪽
        ========================= */}
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,

            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 6,

            zIndex: 1000,
          }}
        >
          <a
            href={GOOGLE_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#dc2626",
              fontSize: "13px",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            - [필수] TE관 좌석이용 현황 작성하기 (구글시트)
          </a>

          <a
            href={REGULATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#dc2626",
              fontSize: "13px",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            - [필수] TE관 운영 규정 (학과규정)
          </a>
        </div>
      </div>

      {/* =========================
          두 번째 배치도
          좌석 42 ~ 65
      ========================= */}
      <div
        style={{
          position: "relative",
          width: SECOND_DISPLAY_WIDTH,
          display: "inline-block",
          marginTop: 10,
        }}
      >

        <div
          style={{
            position: "absolute",
            left: 15,
            top: 10,
            fontSize: "18px",
            fontWeight: "bold",
            color: "#000",
            zIndex: 2000,
          }}
        >
          TE1105호
        </div>
        <img
          src="/floor2.png"
          alt=""
          style={{
            width: "100%",
            display: "block",
          }}
        />

        {/* 42 ~ 65번 좌석 */}
        {seats
          .filter((seat) => seat.id >= 42)
          .map((seat) => (
            <div
              key={seat.id}
              style={{
                position: "absolute",
                left: seat.x * SECOND_SCALE,
                top: seat.y * SECOND_SCALE,
                width: 20,
                height: 20,
                zIndex: 100,
              }}
            >
              {/* 좌석 번호 버튼 */}
              <button
                onClick={() => handleSeatClick(seat.id)}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,

                  width: 20,
                  height: 20,
                  borderRadius: "50%",

                  background: seatUsers[seat.id]?.user_name
                    ? "#ef4444"
                    : "#16a34a",

                  color: "#fff",
                  border: "2px solid white",

                  fontSize: "10px",
                  fontWeight: "bold",

                  cursor: "pointer",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  padding: 0,

                  transform: "translate(-50%, -50%)",
                }}
              >
                {seat.id}
              </button>

              {/* 사용자 이름 + 교수님 이름 */}
              {seatUsers[seat.id]?.user_name && (
                <span
                  style={{
                    position: "absolute",

                    left: 0,
                    top: 10,

                    fontSize: "9px",
                    fontWeight: "bold",
                    color: "#000000",

                    whiteSpace: "nowrap",
                    textAlign: "center",

                    transform: "translateX(-50%)",

                    lineHeight: "11px",

                    pointerEvents: "none",

                    background: "rgba(255, 255, 255, 0.7)",
                    padding: "1px 2px",
                    borderRadius: "2px",
                  }}
                >
                  {seatUsers[seat.id].user_name}
                  {seatUsers[seat.id].user_name && seatUsers[seat.id].professor && <br />}
                  {seatUsers[seat.id].professor && `(${seatUsers[seat.id].professor})`}
                </span>
              )}
            </div>
          ))}
      </div>

      {/* =========================
          입력창
      ========================= */}
      {editingSeat !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,

            background: "rgba(0, 0, 0, 0.35)",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            zIndex: 3000,
          }}
        >
          <div
            style={{
              width: 320,
              background: "white",
              borderRadius: 10,
              padding: 20,

              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              좌석 {editingSeat}번 정보
            </h3>

            {/* 사용자 이름 */}
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              사용자 이름
            </label>

            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="사용자 이름을 입력하세요"
              autoFocus
              style={{
                width: "100%",
                boxSizing: "border-box",

                padding: "9px 10px",
                marginBottom: 15,

                border: "1px solid #ccc",
                borderRadius: 5,

                fontSize: 14,
              }}
            />

            {/* 담당 교수님 */}
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              담당 교수님
            </label>

            <input
              type="text"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              placeholder="담당 교수님 이름을 입력하세요"
              style={{
                width: "100%",
                boxSizing: "border-box",

                padding: "9px 10px",
                marginBottom: 20,

                border: "1px solid #ccc",
                borderRadius: 5,

                fontSize: 14,
              }}
            />

            {/* 버튼 */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <button
                onClick={handleCancel}
                style={{
                  padding: "8px 15px",
                  border: "1px solid #ccc",
                  background: "white",
                  borderRadius: 5,
                  cursor: "pointer",
                }}
              >
                취소
              </button>

              <button
                onClick={handleSave}
                style={{
                  padding: "8px 15px",
                  border: "none",
                  background: "#2563eb",
                  color: "white",
                  borderRadius: 5,
                  cursor: "pointer",
                }}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;