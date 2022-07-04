import React, {FC, useState, useEffect} from 'react';
import {makeStyles} from "@mui/styles";
import ReactAudioPlayer from "react-audio-player";
import Speed from "./Buttons/Speed";

const useStyles = makeStyles(({
  audioPlayer: {
    width: '100%',
    marginBottom: '16px',
  }
}));

type AudioPlayerPropsType = {
  onListen: (e: any) => void,
  callAudio: string | undefined | null,
  audioPlayerRef: any
}

const AudioPlayer: FC<AudioPlayerPropsType> = ({callAudio, onListen, audioPlayerRef}) => {
  const classes = useStyles();

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      setIsPlaying(false);
    }
  })

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

  return (
    <div tabIndex={1} style={{display: 'flex', backgroundColor: '#F8FAFC'}}>
      <ReactAudioPlayer
        ref={audioPlayerRef}
        className={classes.audioPlayer}
        controls={true}
        src={callAudio ? callAudio : ''}
        listenInterval={1}
        // autoPlay={true}
        onListen={onListen}
        onSeeked={onListen}
      />
      {/*<Speed audioPlayerRef={audioPlayerRef}/>*/}
    </div>
  );
};

export default AudioPlayer;


{/*<audio*/}
{/*  ref={audioPlayerRef}*/}
{/*  className={classes.audioPlayer}*/}
{/*  src={callAudio ? callAudio : ''}*/}
{/*  preload="metadata"*/}
{/*  controls={true}*/}
{/*/>*/}