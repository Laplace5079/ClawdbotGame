export type PropType = 'crate' | 'barrel' | 'debris' | 'torch';

export interface DungeonProp {
  type: PropType;
  offset: [number, number, number];
  rotation: number;
  scale: number;
}

export interface DungeonCell {
  x: number;
  z: number;
  type: 'room' | 'corridor' | 'wall' | 'empty';
  props: DungeonProp[];
}

export function generateDungeon(width: number, height: number): DungeonCell[] {
  const dungeon: DungeonCell[] = [];
  const grid: string[][] = Array(width).fill(0).map(() => Array(height).fill('empty'));

  // Helper to carve a room
  const carveRoom = (rx: number, rz: number, rw: number, rh: number) => {
    for (let x = rx; x < rx + rw; x++) {
      for (let z = rz; z < rz + rh; z++) {
        if (x >= 0 && x < width && z >= 0 && z < height) {
          grid[x][z] = 'room';
        }
      }
    }
  };

  // 1. Randomly place some rooms
  const numRooms = 8;
  const rooms: {x: number, z: number, w: number, h: number}[] = [];
  for (let i = 0; i < numRooms; i++) {
    const w = Math.floor(Math.random() * 4) + 4;
    const h = Math.floor(Math.random() * 4) + 4;
    const x = Math.floor(Math.random() * (width - w));
    const z = Math.floor(Math.random() * (height - h));
    carveRoom(x, z, w, h);
    rooms.push({x, z, w, h});
  }

  // 2. Connect rooms with corridors (Simple L-shaped)
  for (let i = 0; i < rooms.length - 1; i++) {
    let startX = Math.floor(rooms[i].x + rooms[i].w / 2);
    let startZ = Math.floor(rooms[i].z + rooms[i].h / 2);
    let endX = Math.floor(rooms[i+1].x + rooms[i+1].w / 2);
    let endZ = Math.floor(rooms[i+1].z + rooms[i+1].h / 2);

    // Horizontal then vertical
    for (let x = Math.min(startX, endX); x <= Math.max(startX, endX); x++) {
      if (grid[x][startZ] === 'empty') grid[x][startZ] = 'corridor';
    }
    for (let z = Math.min(startZ, endZ); z <= Math.max(startZ, endZ); z++) {
      if (grid[endX][z] === 'empty') grid[endX][z] = 'corridor';
    }
  }

  // 3. Convert grid to DungeonCell array and add props
  for (let x = 0; x < width; x++) {
    for (let z = 0; z < height; z++) {
      if (grid[x][z] !== 'empty') {
        const props: DungeonProp[] = [];
        
        // Randomly add props to rooms
        if (grid[x][z] === 'room' && Math.random() > 0.85) {
          const type = (['crate', 'barrel', 'debris'][Math.floor(Math.random() * 3)]) as PropType;
          props.push({
            type,
            offset: [(Math.random() - 0.5) * 0.8, 0, (Math.random() - 0.5) * 0.8],
            rotation: Math.random() * Math.PI * 2,
            scale: 0.8 + Math.random() * 0.4
          });
        }

        // Add torches sparingly
        if (Math.random() > 0.95) {
            props.push({
                type: 'torch',
                offset: [0, 1.2, 0],
                rotation: 0,
                scale: 1
            });
        }

        dungeon.push({
          x: x - width / 2,
          z: z - height / 2,
          type: grid[x][z] as any,
          props
        });
      }
    }
  }

  return dungeon;
}
