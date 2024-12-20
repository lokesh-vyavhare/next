import { indianLudoObject, indianLudoPlayer } from "@/types/indian-ludo";

const getNextCell = (
  position: { x: number; y: number },
  home: indianLudoObject | null,
  roll: number
): { x: number; y: number } => {
  // roll=3

  const { x, y } = position;
  const result = { x, y };

  for (let i = 0; i < roll; i++) {
    if (result.x == 2 && result.y == 2) return { x: -1, y: -1 };
    // entry to inner ring

    const check1 = checkValidForInnerRingEntry(result, home?.position || null);
    if (!check1) continue;

    // outside loop
    const check2 = checkValidForOuterRing(result);
    if (!check2) continue;
    
    // goal
    const check3 = checkValidForGoal(result, home?.position || null);
    if (!check3) continue;
    // inside loop

    const check4 = checkValidForInnerRing(result);
    if (!check4) continue;

  }
  return result;
};

const checkValidForInnerRingEntry = (
  result: { x: number; y: number },
  position: { x: number; y: number } | null
): boolean => {
  let isValidaForNext = true;

  if (!position) return true;

  if (result.x == 3 && result.y == 0 && position.x == 2 && position.y == 0) {
    result.y++;
    isValidaForNext = false;
  } else if (
    result.x == 1 &&
    result.y == 4 &&
    position.x == 2 &&
    position.y == 4
  ) {
    result.y--;
    isValidaForNext = false;
  } else if (
    result.x == 4 &&
    result.y == 3 &&
    position.x == 4 &&
    position.y == 2
  ) {
    result.x--;
    isValidaForNext = false;
  } else if (
    result.x == 0 &&
    result.y == 1 &&
    position.x == 0 &&
    position.y == 2
  ) {
    result.x++;
    isValidaForNext = false;
  }
  return isValidaForNext;
};
const checkValidForGoal = (
  result: { x: number; y: number },
  position: { x: number; y: number } | null
): boolean => {
  let isValidaForNext = true;

  if (!position) return true;
  if (result.x == 2 && result.y == 1 && position.x == 2 && position.y == 0) {
    result.y++;
    isValidaForNext = false;
  } else if (
    result.x == 2 &&
    result.y == 3 &&
    position.x == 2 &&
    position.y == 4
  ) {
    result.y--;
    isValidaForNext = false;
  } else if (
    result.x == 3 &&
    result.y == 2 &&
    position.x == 4 &&
    position.y == 2
  ) {
    result.x--;
    isValidaForNext = false;
  } else if (
    result.x == 1 &&
    result.y == 2 &&
    position.x == 0 &&
    position.y == 2
  ) {
    result.x++;
    isValidaForNext = false;
  }
  return isValidaForNext;
};
const checkValidForOuterRing = (result: { x: number; y: number }): boolean => {
  let isValidaForNext = true;

  if (result.x == 0 && result.y != 4) {
    result.y++;
    isValidaForNext = false;
  } else if (result.y == 0 && result.x != 0) {
    result.x--;
    isValidaForNext = false;
  } else if (result.x == 4 && result.y != 0) {
    result.y--;
    isValidaForNext = false;
  } else if (result.y == 4 && result.x != 4) {
    result.x++;
    isValidaForNext = false;
  }
  return isValidaForNext;
};
const checkValidForInnerRing = (result: { x: number; y: number }): boolean => {
  let isValidaForNext = true;

  if (result.x == 1 && result.y != 1) {
    result.y--;
    isValidaForNext = false;
} else if (result.y == 1 && result.x != 3) {
    result.x++;
    isValidaForNext = false;
} else if (result.x == 3 && result.y != 3) {
    result.y++;
    isValidaForNext = false;
} else if (result.y == 3 && result.x != 1) {
    result.x--;
    isValidaForNext = false;
  }
  return isValidaForNext;
};

const handleCellMove = (
  cell: indianLudoObject,
  player: indianLudoPlayer,
  players: indianLudoPlayer[],
  removedPlayer: number[],
  ludo: indianLudoObject[][]
): boolean => {

  let isKill = false;
  
  if (!cell.isHome) {
    cell.players.push({ count: 1, player: player.id });
    cell.players = cell.players.filter((val) => val.player == player.id);

    players.forEach((player_r) => {
      if (removedPlayer.includes(player_r.id)) {
        isKill = true;

        let findIndex = -1;

        if (player_r.home) {
          ludo[player_r.home.x][player_r.home.y].players.forEach((val, ind) => {
            if (val.player == player_r.id) {
              val.count++;
              findIndex = ind;
            }
          });

          if (findIndex == -1) {
            ludo[player_r.home.x][player_r.home.y]?.players.push({
              player: player_r.id,
              count: 1,
            });
          }
        }
      }
    });
  } else {
    let notExists = true;

    cell.players.forEach((player_d) => {
      if (player_d.player == player.id) {
        player_d.count++;
        notExists = false;
      }
    });

    if (notExists) {
      cell.players.push({ count: 1, player: player.id });
    }
  }

  return isKill;
};

const safeJsonParse = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key); // Fetch item from localStorage
    if (!item) return null; // Return null if item doesn't exist
    return JSON.parse(item) as T; // Parse the JSON and cast to type T
  } catch (error) {
    console.error(`Error parsing JSON from localStorage key "${key}":`, error);
    return null;
  }
};

export { getNextCell, safeJsonParse, handleCellMove };
