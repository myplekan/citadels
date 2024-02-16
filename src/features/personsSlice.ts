import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../src/store/store';
import personsData from '../person.json';
import { Card } from '../types/card';
import { Character, Person } from '../types/Person';

const initialState: Person[] = personsData.persons

const personsSlice = createSlice({
  name: 'persons',
  initialState,
  reducers: {
    createPerson: (state, action: PayloadAction<Person>) => {
      return [...state, action.payload]
    },
    setCards: (state, action: PayloadAction<{cards: Card[], id: string}>) => {
      state[+action.payload.id].cards = action.payload.cards;
    },
    addCard: (state, action: PayloadAction<{ id: string; card: Card; }>) => {
      const { id, card } = action.payload;

      state[+id].cards = [...state[+id].cards, card];
    },
    addCharacter: (state, action: PayloadAction<{ id: string; role: Character}>) => {
      state[+action.payload.id].character = action.payload.role;
    },
    addBuilds: (state, action: PayloadAction<{ id: string; card: Card; }>) => {
      state[+action.payload.id].builds = [...state[+action.payload.id].builds, action.payload.card];
    },
    removeCards: (state, action: PayloadAction<{ id: string; card: Card; }>) => {
      state[+action.payload.id].cards = state[+action.payload.id].cards.filter(card => card.id !== action.payload.card.id)
    },
    removeBuild: (state, action: PayloadAction<{ id: string; card: Card; }>) => {
      state[+action.payload.id].builds = state[+action.payload.id].builds.filter(build => build.id !== action.payload.card.id)
    },
    addCoin: (state, action: PayloadAction<{ id: string, coin: number}>) => {
      state[+action.payload.id].money = state[+action.payload.id].money + action.payload.coin;
    },
    removeCoin: (state, action: PayloadAction<{ id: string, coin: number}>) => {
      state[+action.payload.id].money = state[+action.payload.id].money - action.payload.coin;
    },
    reset: (state, action: PayloadAction<{ id: string }>) => {
      state[+action.payload.id].money = 0;
      state[+action.payload.id].builds = [];
      state[+action.payload.id].cards = [];
      state[+action.payload.id].character = { photo: '', moveQueue: null, name: '', type: '' };
    }
  }
})

export default personsSlice.reducer;
export const { actions } = personsSlice;
