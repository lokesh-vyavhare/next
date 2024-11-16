"use client";

import { indianLudoObject, indianLudoPlayer } from "@/types/indian-ludo";
import { useEffect, useState } from "react";
import style from "../../styles/indian-ludo/style.module.css";
import {getNextCell} from './helper'

const default_array: indianLudoObject[][] = [];
const players_array: indianLudoPlayer[] = [];

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

export default function IndianLudo() {
  const [ludo, setLudo] = useState(default_array);
  const [players, setPlayers] = useState(players_array);
  const [turn, setTurn] = useState(0);
  const [isRolled, setIsRolled] = useState(false);
  const [roll, setRoll] = useState(0);
  // const 

  const no = 4;

  // click after roll is diced: to move pawn
  const pawnClick = (indianLudoObject:indianLudoObject, playerpawns:{player:indianLudoPlayer, count:number})=> {
    
    const {position} = indianLudoObject;
    const {player} = playerpawns;
    const result = getNextCell(position, player.home, roll);

    setLudo(prev=>{
      prev.forEach((row)=>{

        row.forEach((cell)=>{
          // reducing player for original position
          if(position.x == cell.position.x && position.y == cell.position.y){

            let iscountZero = false;
            cell.players.forEach((player_d)=>{
              if(player.id == player_d.player.id){
                player_d.count--;

                if(!player_d.count){
                  iscountZero = true;
                }
              }

            })
            if(iscountZero) cell.players = cell.players.filter((val)=>val.player.id != player.id);
          }

          // adding player in new position
          if(result.x == cell.position.x && result.y == cell.position.y){
            let notExists = true;

            cell.players.forEach((player_d)=>{
              if(player_d.player.id == player.id){
                player_d.count++;
                notExists = false;
              }
            })

            if(notExists){
              cell.players.push({count:1, player})
            }
          }
        })
      })

      return prev;
    });
    setIsRolled(false);
    setRoll(0)
    setTurn(prev=>{
      if(prev==3){
        return 0
      }else return ++prev;
    })
  }

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
          prev[homePos.x][homePos.y].players = [{player, count:4}]; 
          return prev;
        });
      }
    }
    setPlayers(() => [...array]);

    console.log("mount");

    // getNextCell({x:2, });
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

                  {/* player goti */}

                  {cell.players.map((playerpawns) => (
                    <button
                      key={`player-goti-${playerpawns.player.name}`}
                      className={`${style.playerpawns} ${
                        playerpawns.player.id == players[turn].id && roll
                          ? style.playerpawnsOnTurn
                          : ""
                      }`}
                      data-player-color={playerpawns.player.color}
                      onClick={() => {
                        pawnClick(cell, playerpawns);
                      }}
                      disabled={!isRolled || turn != playerpawns.player.id}
                    >
                      { playerpawns.count}
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
