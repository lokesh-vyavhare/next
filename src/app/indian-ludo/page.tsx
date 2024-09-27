"use client";

import { indianLudoObject, indianLudoPlayer } from "@/types/indian-ludo";
import { useEffect, useState } from "react";
import style from "../../styles/indian-ludo/style.module.css";

const default_array: indianLudoObject[][] = [];
const players_array: indianLudoPlayer[] = [];

for (let i = 0; i < 5; i++) {
  const row: indianLudoObject[] = [];

  for (let j = 0; j < 5; j++) {
    const cell: indianLudoObject = {
      homeOf: null,
      id: i * 5 + j,
      players: [],
      isHome: false,
      isDestination: false,
      position: { x: j, y: i },
    };

    if (((i == 0 || i == 4) && j == 2) || (i == 2 && (j == 0 || j == 4))) {
      cell.isHome = true;
    }
    if (i == 2 && j == 2) {
      cell.isDestination = true;
    }

    row.push(cell);
  }
  default_array.push(row);
}

export default function IndianLudo() {
  const [ludo, setLudo] = useState(default_array);
  const [players, setPlayers] = useState(players_array);

  const no = 4;

  useEffect(() => {
    const array: indianLudoPlayer[] = [];

    for (let i = 0; i < no; i++) {
      let homePos = { x: -1, y: -1 },
        color = "";
      if (i == 0) {
        homePos = { x: 0, y: 2 };
        color = "red";
      } else if (i == 1) {
        homePos = { x: 2, y: 4 };
        color = "yellow";
      } else if (i == 2) {
        homePos = { x: 4, y: 2 };
        color = "blue";
      } else if (i == 3) {
        homePos = { x: 2, y: 0 };
        color = "green";
      }

      const player: indianLudoPlayer = {
        name: `Player-${i + 1}`,
        home: ludo[homePos.x][homePos.y] || null,
        id: i,
        positions: [],
        color,
      };

      array.push(player);
      if (homePos.x >= 0 && homePos.y >= 0) {
        setLudo((prev) => {
          prev[homePos.x][homePos.y].homeOf = player;
          return prev;
        });
      }
    }
    setPlayers(() => [...array]);
  }, []);

  return (
    <section>
      {/* grid */}
      <table className={style.table}>
        <tbody>
          {ludo.map((row) => (
            <tr key={`row-${row[0].id}`}>
              {row.map((cell) => (
                <td key={`cell-${cell.id}`}>
                  {/* home */}
                  {cell.isHome ? (
                    <div
                      className={style.home}
                      data-home-color={cell.homeOf?.color}
                    >
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    ""
                  )}

                  {/* destination */}
                  {cell.isDestination ? (
                    <div className={style.destination}>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    ""
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* player board */}
      <div className={style.playerBoard}>
        {players.map((player) => (
          <div key={`player-key-${player.id}`}>
            <p>{player.name}</p>
            <p
              className={style.playerColor}
              data-player-color={player.color}
            ></p>
          </div>
        ))}
      </div>
    </section>
  );
}
