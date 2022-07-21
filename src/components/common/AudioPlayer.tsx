import React, { FC, useState, useEffect } from 'react';
import { makeStyles } from "@mui/styles";
import ReactAudioPlayer from "react-audio-player";
import ReactPlayer from 'react-player'
import Speed from "./Buttons/Speed";

const useStyles = makeStyles(({
  audioPlayer: {
    width: '100% !important',
    height: '56px !important',
    marginBottom: '16px',
  },
  playerLineBlock: {
    display: 'flex',
    alignItems: 'center',
  },
  playerRateBlock: {
    marginLeft: '10px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  rateValue: {
    width: '30px',
    marginLeft: '5px',
    fontSize: '13px',
  },
  rateValueTitle: {
    position: 'absolute',
    top: '10px',
    fontSize: '10px',
  },
}));

type AudioPlayerPropsType = {
  onListen: (e: any) => void,
  callAudio: string | undefined | null,
  audioPlayerRef: any
}

const AudioPlayer: FC<AudioPlayerPropsType> = ({ callAudio, onListen, audioPlayerRef }) => {
  const classes = useStyles();

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRateValue, setPlaybackRateValue] = useState<any>(localStorage.getItem("userPlayerRateValue"));

  useEffect(() => {
    return () => {
      setIsPlaying(false);
    }
  }, [])

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    debugger
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayerRef.current.audioEl.current.play();
    } else {
      audioPlayerRef.current.audioEl.current.pause();
    }
  }

  const changeRange = () => {
    audioPlayerRef.current.audioEl.current.currentTime = 2;
  }

  const changePlayerRate = (event: any) => {
    setPlaybackRateValue(event.target.value);
    localStorage.setItem("userPlayerRateValue", event.target.value);
  }

  return (
    <div tabIndex={1} className={classes.playerLineBlock} style={{ display: 'flex', backgroundColor: '#F8FAFC' }}>
      {/* <ReactAudioPlayer
        ref={audioPlayerRef}
        className={classes.audioPlayer}
        controls={true}
        src={callAudio ? callAudio : ''}
        listenInterval={1}
        // autoPlay={true}
        onListen={onListen}
        onSeeked={onListen}
        preload="auto"
      /> */}
      <ReactPlayer
        ref={audioPlayerRef}
        className={classes.audioPlayer}
        controls={true}
        url={callAudio ? callAudio : ''}
        listenInterval={1}
        onListen={onListen}
        onSeeked={onListen}
        preload="auto"
        playbackRate={1}
      />
      <div className={classes.playerRateBlock}>
        <span className={classes.rateValueTitle}>Скорость аудио</span>
        <input
          type="range"
          value={playbackRateValue}
          onChange={changePlayerRate}
          step={0.25}
          min={0.25}
          max={2}
        />
        <p className={classes.rateValue}>{playbackRateValue}</p>
      </div>
      {/* <Speed audioPlayerRef={audioPlayerRef}/> */}
    </div>
  );
};

export default AudioPlayer;


{/*<audio*/ }
{/*  ref={audioPlayerRef}*/ }
{/*  className={classes.audioPlayer}*/ }
{/*  src={callAudio ? callAudio : ''}*/ }
{/*  preload="metadata"*/ }
{/*  controls={true}*/ }
{/*/>*/ }