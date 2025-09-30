
export interface BloodSugarRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  level: number;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  dob: string;
  weight: string;
  height: string;
  photo: string; // Base64 encoded string
}
