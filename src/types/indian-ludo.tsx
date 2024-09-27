type indianLudoPlayer = {
  name: string;
  id: number;
  home: indianLudoObject | null,
  positions: indianLudoObject[],
  color:string
};

type indianLudoObject = {
    id:number,
    players:indianLudoPlayer[] | null,
    position:{x:number, y:number},
    isHome:boolean,
    isDestination:boolean,
    homeOf: indianLudoPlayer | null
};

export type { indianLudoObject, indianLudoPlayer };