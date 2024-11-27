"use client";

import { indianLudoObject, indianLudoPlayer } from "@/types/indian-ludo";
import { useEffect, useState } from "react";
import style from "../../styles/indian-ludo/style.module.css";
import {getNextCell, handleCellMove, safeJsonParse} from './helper'

const default_array: indianLudoObject[][] = [];
const playerDefaultArray: indianLudoPlayer[] = [];

// setting default grid
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

// setting default player array
for (let i = 0; i < 4; i++) {
  let homePos = { x: -1, y: -1 },
    color = "";
  if (i == 0) {
    homePos = { x: 4, y: 2 };
    color = "red";
  } else if (i == 1) {
    homePos = { x: 2, y: 4 };
    color = "yellow";
  } else if (i == 2) {
    homePos = { x: 0, y: 2 };
    color = "blue";
  } else if (i == 3) {
    homePos = { x: 2, y: 0 };
    color = "green";
  }

  const player: indianLudoPlayer = {
    name: `Player-${i + 1}`,
    home: homePos || null,
    id: i,
    positions: [],
    color,
  };

  playerDefaultArray.push(player);
  if (homePos.x >= 0 && homePos.y >= 0) {
      default_array[homePos.x][homePos.y].homeOf = player.id;
      default_array[homePos.x][homePos.y].players = [{ player: player.id, count: 4 }];
  }
}
export default function IndianLudo() {
  const [ludo, setLudo] = useState(default_array);
  const [players, setPlayers] = useState(playerDefaultArray);
  const [turn, setTurn] = useState(0);
  const [isRolled, setIsRolled] = useState(false);
  const [roll, setRoll] = useState(0);


  // click after roll is diced: to move pawn
  const pawnClick = (indianLudoObject:indianLudoObject, id:number)=> {
    
    // get data
    const {position} = indianLudoObject;
    const player = players[id];

    // result cell after move
    let result;

    if ((typeof player.home?.x) == 'number' && typeof(player.home?.y) == 'number')
      result = getNextCell(
        position,
        ludo[player.home?.x][player.home?.y],
        roll
      );

    if(!result) return;
    if(result.x<0 && result.y<0) return;

    let isMoveValid = true, isKill=false;
    const wonPlayers:number[]=[];

    setLudo((prev) => {

      const cell = prev[result.y][result.x];

      if (result.x == cell.position.x && result.y == cell.position.y) {

        const removedPlayer:number[] = [];

        if (!cell.isHome || !cell.isDestination) {
          cell.players.forEach((player_d) => {
            if (player_d.player == player.id) {
              isMoveValid = false;
            }else{
              removedPlayer.push(player_d.player);
            }

          });
        }

        isKill = !!(removedPlayer.length);


        if (!isMoveValid) return prev;

        isKill = handleCellMove(cell, player, players, removedPlayer, ludo);
      }


      const oldCell = prev[position.y][position.x];
      let iscountZero = false;
      oldCell.players.forEach((player_d) => {
        if (player.id == player_d.player) {
          player_d.count--;

          if (!player_d.count) {
            iscountZero = true;
          }
        }
      });
      if (iscountZero)
        oldCell.players = oldCell.players.filter((val) => val.player != player.id);

      if(result.x ==2 && result.y==2){
        prev[2][2].players.forEach((val)=>{
          if(val.count == 4){
            wonPlayers.push(val.player);
          }
        })
      }


      if (
        !(roll == 4 || roll == 8 || isKill || (result.x == 2 && result.y == 2)) ||
        wonPlayers.includes(player.id)
      ) {
        handToNextPerson(wonPlayers);
      }
      setRoll(0);
      return prev;
    });


    
  }

  const handleLocalSave = () => {
    localStorage.setItem("player-current-state", JSON.stringify(players));
    localStorage.setItem("ludo-current-state", JSON.stringify(ludo));
    localStorage.setItem("ludo-current-turn", JSON.stringify(turn));
  }

  const handleReset = () => {
    setLudo(default_array);
    setPlayers(playerDefaultArray);
    setTurn(0);
  }

  const handleRetreive = () => {
    const ludoState = safeJsonParse<indianLudoObject[][]>("ludo-current-state");
    if (ludoState?.length) setLudo(ludoState);

    const playerState = safeJsonParse<indianLudoPlayer[]>(
      "player-current-state"
    );
    if (playerState?.length) setPlayers(playerState);

    const turnState = safeJsonParse<number>("player-current-turn");
    if (turnState) setTurn(turnState);
  };

  const handToNextPerson = (wonPlayers:number[]) => {
    setIsRolled(false);
    setTurn((prev) => {
      if(wonPlayers.length == 3) return -1;
      if (prev == 3) {
        prev = 0;
      } else {
        prev++;
      }
      while(wonPlayers.includes(prev)){
        if(prev==3){
          prev=0;
        }else{
          prev++;
        }
      }
      return prev;
    });
  };

  const handleRoll = () => {
    setIsRolled(true);
    const num = Math.ceil(Math.random()*100);
    let rolledNum = 1;

    if (num > 96) {
      rolledNum = 8;
    } else if (num > 89) {
      rolledNum = 4;
    } else if (num > 54) {
      rolledNum = 3;
    } else if (num > 27) {
      rolledNum = 2;
    } else if (num > 0) {
      rolledNum = 1;
    }

    setRoll(rolledNum);
  }

  // setting first data
  useEffect(() => {
    const ludoState = safeJsonParse<indianLudoObject[][]>("ludo-current-state");
    if (ludoState?.length) setLudo(ludoState);
    
    const playerState = safeJsonParse<indianLudoPlayer[]>("player-current-state");
    if (playerState?.length) setPlayers(playerState);

    const turnState = safeJsonParse<number>("player-current-turn");
    if (turnState) setTurn(turnState);

  }, []);


  return (
    <section>
      <div className={style.playboard}>
        {/* grid */}
        <div className={style.table}>
          {ludo.map((row) => (
            <div key={`row-${row[0].id}`}>
              {row.map((cell) => (
                <div key={`cell-${cell.id}`}>
                  {/* home */}
                  {cell.isHome ? (
                    <div
                      className={style.home}
                      data-home-color={
                        cell.homeOf ? players[cell.homeOf].color : ""
                      }
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

                  {/* player goti */}

                  {cell.players.map((playerpawns) => (
                    <button
                      key={`player-goti-${players[playerpawns.player].name}`}
                      className={`${style.playerpawns} ${
                        players[playerpawns.player].id == players[turn].id &&
                        roll
                          ? style.playerpawnsOnTurn
                          : ""
                      }`}
                      data-player-color={players[playerpawns.player].color}
                      onClick={() => {
                        pawnClick(cell, playerpawns.player);
                      }}
                      disabled={
                        !isRolled || turn != players[playerpawns.player].id
                      }
                    >
                      {playerpawns.count}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* dice */}
        <div className={style.diceBox}>
          {players.length > 0 ? (
            <div>
              <div>
                {roll ? (
                  <p style={{ color: players[turn].color }}>
                    {roll ? roll : "-"}
                  </p>
                ) : (
                  <div>
                    <button
                      onClick={handleRoll}
                      disabled={roll ? true : false}
                      style={{
                        backgroundColor: players[turn].color,
                        color: "black",
                      }}
                    >
                      Roll
                    </button>

                    <button onClick={handleLocalSave}>Save</button>
                    <button onClick={handleReset}>Reset</button>
                    <button onClick={handleRetreive}>Retreive</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* player board */}
      <div className={style.playerBoard}>
        {players.map((player) => (
          <div key={`player-key-${player.id}`}>
            <p>{player.name}</p>
            <p
              className={style.playerColor}
              data-player-color={player.color}
            ></p>
            <p>{player.id + 1}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
