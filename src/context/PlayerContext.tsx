
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
  progress: number;
  duration: number;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleLoop: () => void;
  handleProgress: (p: { played: number }) => void;
  handleDuration: (d: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [loop, setLoop] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
    setDuration(0);
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

  const handleProgress = (p: { played: number }) => {
    setProgress(p.played);
  };

  const handleDuration = (d: number) => {
    setDuration(d);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        loop,
        progress,
        duration,
        playSong,
        togglePlay,
        setVolume: setVolumeState,
        toggleLoop,
        handleProgress,
        handleDuration,
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
