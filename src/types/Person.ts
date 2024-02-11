import { Card } from "./card";

export type Character = {
  photo: string,
  moveQueue: number | null,
  name: string,
  type: string
}

export type Person = {
  id: string;
  name: string;
  avatar: string;
  character: Character;
  money: number;
  cards: Card[];
  builds: Card[];
}
