
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
  playedSeconds: number;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleLoop: () => void;
  handleProgress: (state: { played: number, playedSeconds: number, loaded: number, loadedSeconds: number }) => void;
  handleDuration: (d: number) => void;
  handleEnded: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [loop, setLoop] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playedSeconds, setPlayedSeconds] = useState<number>(0);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
    setDuration(0);
    setPlayedSeconds(0);
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

  const handleProgress = (state: { played: number, playedSeconds: number, loaded: number, loadedSeconds: number }) => {
    setProgress(state.played);
    setPlayedSeconds(state.playedSeconds);
  };

  const handleDuration = (d: number) => {
    setDuration(d);
  };

  const handleEnded = () => {
    setIsPlaying(false);
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
        playedSeconds,
        playSong,
        togglePlay,
        setVolume: setVolumeState,
        toggleLoop,
        handleProgress,
        handleDuration,
        handleEnded,
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
