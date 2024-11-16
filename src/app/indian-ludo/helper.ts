import { indianLudoObject } from "@/types/indian-ludo";

const getNextCell = (position:{x:number, y:number}, home:indianLudoObject|null, roll:number):{x:number, y:number} => {
    console.log(home, position, roll);

    // roll=3

    const {x,y} = position;
    const result = {x, y};

    for(let i=0; i<roll; i++){
        // console.log("rolled", i)
        // outside loop
        if(result.x==0 && result.y!=0){
            result.y--;
        }else if(result.y==0 && result.x!=4){
            result.x++;
        }else if(result.x==4 && result.y!=4){
            result.y++;
        }else if(result.y==4 && result.x!=0){
            result.x--;
        }

        // inside loop
        else{
    
        }
    }
    // console.log(result);
    return result;
};

export { getNextCell };
