
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Song {
  url: string;
  title: string;
  artist: string;
}

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  loop: boolean;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleLoop: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [loop, setLoop] = useState<boolean>(false);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const setVolumeState = (newVolume: number) => {
    setVolume(newVolume);
  };

  const toggleLoop = () => {
    setLoop(!loop);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        loop,
        playSong,
        togglePlay,
        setVolume: setVolumeState,
        toggleLoop,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
