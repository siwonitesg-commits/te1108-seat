import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { seats } from "./seatData";

const ORIGINAL_WIDTH = 1980;
const DISPLAY_WIDTH = 900;
const SCALE = DISPLAY_WIDTH / ORIGINAL_WIDTH;

function App() {
  const [seatUsers, setSeatUsers] = useState({});

useEffect(() => {
  loadSeats();
}, []);

async function loadSeats() {
  const { data } = await supabase
    .from("seats")
    .select("*");

  const obj = {};

  data.forEach((seat) => {
    obj[seat.id] = seat.user_name;
  });

  setSeatUsers(obj);
}


  const handleSeatClick = async (id) => {
  const current = seatUsers[id] || "";
  const name = prompt("사용자 이름", current);

  if (name === null) return;

  await supabase
    .from("seats")
    .update({
      user_name: name,
    })
    .eq("id", id);

  setSeatUsers({
    ...seatUsers,
    [id]: name,
  });
};

  return (
    <div
      style={{
        position: "relative",
        width: DISPLAY_WIDTH,
        display: "inline-block",
      }}
    >
      <img
        src="/floor.png"
        alt=""
        style={{
          width: "100%",
          display: "block",
        }}
      />

      {seats.map((seat) => (
        <button
          key={seat.id}
          onClick={() => handleSeatClick(seat.id)}
          title={seatUsers[seat.id] || "빈 자리"}
          style={{
            position: "absolute",
            left: seat.x * SCALE,
            top: seat.y * SCALE,
            transform: "translate(-50%, -50%)",

            width: 20,
            height: 20,
            borderRadius: "50%",

            background: seatUsers[seat.id] ? "#ef4444" : "#16a34a",

            color: "#fff",
            border: "2px solid white",

            fontSize: "10px",
            fontWeight: "bold",

            cursor: "pointer",
            zIndex: 100,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          {seat.id}
        </button>
      ))}
    </div>
  );
}

export default App;