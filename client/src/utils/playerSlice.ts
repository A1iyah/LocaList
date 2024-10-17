import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlayerState {
  currentSongs: any[];
  currentIndex: number;
  isActive: boolean;
  isPlaying: boolean;
  activeSong: any;
  genreListId: string;
  shuffle: boolean;
  appTime: number;
  playbackTime: number;
}

export const initialState: PlayerState = {
  currentSongs: [],
  currentIndex: 0,
  activeSong: {},
  isPlaying: false,
  isActive: false,
  genreListId: "",
  shuffle: false,
  appTime: 0,
  playbackTime: 0,
};

function getRandomIndex(excludeIndex: any, arrayLength: any) {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * arrayLength);
  } while (randomIndex === excludeIndex);
  return randomIndex;
}

const playerSlice = createSlice({
  name: "player",
  initialState,

  reducers: {
    setActiveSong: (
      state,
      action: PayloadAction<{ song: any; data: any; i: number }>
    ) => {
      state.activeSong = action.payload.song;

      if (action.payload.data?.tracks?.hits) {
        state.currentSongs = action.payload.data.tracks.hits;
      } else if (action.payload.data?.properties) {
        state.currentSongs = action.payload.data.tracks;
      } else {
        state.currentSongs = action.payload.data;
      }

      state.currentIndex = action.payload.i;
      state.isActive = true;
      state.isPlaying = true;
    },

    nextSong: (state) => {
      if (state.shuffle) {
        state.currentIndex = getRandomIndex(
          state.currentIndex,
          state.currentSongs.length
        );
      } else {
        state.currentIndex =
          (state.currentIndex + 1) % state.currentSongs.length;
      }

      state.activeSong = state.currentSongs[state.currentIndex];
      state.isActive = true;
    },

    prevSong: (state) => {
      if (state.shuffle) {
        state.currentIndex = getRandomIndex(
          state.currentIndex,
          state.currentSongs.length
        );
      } else {
        state.currentIndex =
          (state.currentIndex - 1 + state.currentSongs.length) %
          state.currentSongs.length;
      }

      state.activeSong = state.currentSongs[state.currentIndex];
      state.isActive = true;
    },

    playPause: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
      if (state.isPlaying) {
        state.isActive = true;
      }
    },

    selectGenreListId: (state, action: PayloadAction<string>) => {
      state.genreListId = action.payload;
    },

    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },

    shuffleNextSong: (state) => {
      const shuffledIndex = Math.floor(
        Math.random() * state.currentSongs.length
      );

      state.currentIndex = shuffledIndex;
      state.activeSong = state.currentSongs[state.currentIndex];
      state.isActive = true;
    },

    setPlaybackTime: (state, action: PayloadAction<number>) => {
      state.playbackTime = action.payload;
    },

    togglePlayPause: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },

    setPlaylistContext: (
      state,
      action: PayloadAction<{ song: any; playlist: any[]; index: number }>
    ) => {
      state.activeSong = action.payload.song;
      state.currentSongs = action.payload.playlist;
      state.currentIndex = action.payload.index;
      state.isPlaying = true;
    },
  },
});

export const {
  setActiveSong,
  nextSong,
  prevSong,
  playPause,
  selectGenreListId,
  toggleShuffle,
  shuffleNextSong,
  setPlaybackTime,
  togglePlayPause,
  setPlaylistContext,
} = playerSlice.actions;

export default playerSlice.reducer;
