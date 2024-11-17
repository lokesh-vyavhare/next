import { indianLudoObject } from "@/types/indian-ludo";

const getNextCell = (position:{x:number, y:number}, home:indianLudoObject|null, roll:number):{x:number, y:number} => {

    // roll=3

    const {x,y} = position;
    const result = {x, y};

    for(let i=0; i<roll; i++){
        if(result.x==2 && result.y==2) return ({x:-1, y:-1})
        // entry to inner ring
        if(result.x==3 && result.y==0 && home?.position.x == 2 && home.position.y == 0){
            result.y++;
        }else if(result.x==1 && result.y==4 && home?.position.x == 2 && home.position.y == 4){
            result.y--;
        }else if(result.x==4 && result.y==3 && home?.position.x == 4 && home.position.y == 2){
            result.x--;
        }else if(result.x==0 && result.y==1  && home?.position.x == 0 && home.position.y == 2){
            result.x++;
        }
        
        // outside loop
        else if(result.x==0 && result.y!=4){
            result.y++;
        }else if(result.y==0 && result.x!=0){
            result.x--;
        }else if(result.x==4 && result.y!=0){
            result.y--;
        }else if(result.y==4 && result.x!=4){
            result.x++;
        }
        
        // goal
        else if(result.x==2 && result.y==1 && home?.position.x == 2 && home.position.y == 0){
            result.y++;
        }else if(result.x==2 && result.y==3 && home?.position.x == 2 && home.position.y == 4){
            result.y--;
        }else if(result.x==3 && result.y==2 && home?.position.x == 4 && home.position.y == 2){
            result.x--;
        }else if(result.x==1 && result.y==2  && home?.position.x == 0 && home.position.y == 2){
            result.x++;
        }
        
        // inside loop
        else if(result.x==1 && result.y!=1){
            result.y--;
        }else if(result.y==1 && result.x!=3){
            result.x++;
        }else if(result.x==3 && result.y!=3){
            result.y++;
        }else if(result.y==3 && result.x!=1){
            result.x--;
        }

    }
    return result;
};

export { getNextCell };
