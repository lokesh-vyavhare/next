'use client';

import { indianLudoObject, indianLudoPlayer } from "@/types/indian-ludo";
import { useEffect, useState } from "react";
import style from '../../styles/indian-ludo/style.module.css'

const default_array : indianLudoObject[][] = [];
const players_array : indianLudoPlayer[] = []

for(let i=0; i<5; i++){
    const row : indianLudoObject[] = [];

    for(let j=0; j<5; j++){

        const cell : indianLudoObject = {
            homeOf:null,
            id: (i*5) + j,
            players:[],
            isHome:false,
            isDestination:false,
            position:{x:j, y:i}
        }

        if(((i==0 || i == 4) && j==2) || (i==2 && (j==0 || j==4))){
            cell.isHome = true;
        }
        if(i==2 && j==2){
            cell.isDestination = true;
        }

        row.push(cell);
    }
    default_array.push(row);
}

export default function IndianLudo () {
    const [ludo, setLudo] = useState(default_array);
    const [players, setPlayers] = useState(players_array);

    const no = 4;

    
    

    useEffect(() => {

      const array: indianLudoPlayer[] = [];

      
      for (let i = 0; i < no; i++) {

        const homePos = i==0?{x:0, y:2}:i==1?{x:2, y:4}:i==2?{x:4, y:2}:i==3?{x:2, y:0}:{x:-1, y:-1};
        const color = i==0?'red':i==1?'yellow':i==2?'blue':i==3?'green':'';
        
        const player: indianLudoPlayer = {
          name: `Player-${i+1}`,
          home: ludo[homePos.x][homePos.y] || null,
          id: i,
          positions: [],
          color
        };

        array.push(player);
        if(homePos.x>=0 && homePos.y>=0){
          setLudo((prev)=>{
            prev[homePos.x][homePos.y].homeOf = player;
            return prev;
          })
        }

      }
      setPlayers(() => [...array]);
    }, []);


    return (
      <section>
        <table className={style.table}>
          <tbody>
            {ludo.map((row, index) => (
              <tr key={`row-${index}`}>
                {row.map((cell, index2) => (
                  <td key={`cell-${index}-${index2}-${cell.id}`}>

                    {/* home */}
                    {cell.isHome ? (
                      <div className={style.home} data-home-color={cell.homeOf?.color}>
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
        <div className={style.playerBoard}>
          {
            players.map((player, playerIndex)=>
              <div key={`player-key-${playerIndex}`}>
                <p>{player.name}</p>
                <p className={style.playerColor} data-player-color={player.color}></p>
              </div>
            )
          }
        </div>
      </section>
    );
}