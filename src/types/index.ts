export interface MigrationPoint {
  coordinates: [number, number]; // [lng, lat]
  month: number; // 0-11
}

export interface Bird {
  id: string;
  name: string;
  scientificName: string;
  color: string;
  route: MigrationPoint[];
}

export interface BirdVisibility {
  [birdId: string]: boolean;
}
