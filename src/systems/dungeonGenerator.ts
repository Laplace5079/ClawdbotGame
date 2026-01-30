export interface DungeonCell {
  x: number;
  z: number;
  type: 'room' | 'corridor' | 'empty';
}

export function generateDungeon(width: number, height: number): DungeonCell[] {
  const dungeon: DungeonCell[] = [];
  
  // Very simple grid-based generator: a central room and a few branches
  for (let x = -width; x <= width; x++) {
    for (let z = -height; z <= height; z++) {
      // Create a 5x5 center room
      if (Math.abs(x) <= 2 && Math.abs(z) <= 2) {
        dungeon.push({ x, z, type: 'room' });
      } 
      // Create some "corridors"
      else if (x === 0 && Math.abs(z) <= height) {
        dungeon.push({ x, z, type: 'corridor' });
      }
      else if (z === 0 && Math.abs(x) <= width) {
        dungeon.push({ x, z, type: 'corridor' });
      }
    }
  }
  
  return dungeon;
}
