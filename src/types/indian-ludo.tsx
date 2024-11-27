type indianLudoPlayer = {
  name: string;
  id: number;
  home: { x: number; y: number } | null;
  positions: { x: number; y: number }[];
  color: string;
};

type indianLudoObject = {
    id:number,
    players:{player:number, count:number}[],
    position:{x:number, y:number},
    isHome:boolean,
    isDestination:boolean,
    homeOf: number | null
};

export type { indianLudoObject, indianLudoPlayer };