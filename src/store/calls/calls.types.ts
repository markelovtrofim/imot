export type TagType = {
  name: string,
  value: string,
  tagType: string,
  visible: boolean,
  color: string,
  fragment: string,
  fBegin: number,
  fEnd: number,
  matchData: string,
  direction: string
}

export type CallsInfoType = {
  id: string,
  callTime: string,
  callTimeReadable: string,
  clientPhone: string,
  operatorPhone: string,
  userId: string,
  uniqueId: string,
  conversationId: string,
  duration: number,
  tags: TagType[]
};


export type CallsType = {
  id: string | null,
  info: CallsInfoType | null,
  stt: CallsSttType | null,
  audio: CallsAudioType | null
};


// for the future
export type CallsSttType = any;

// for the future
export type CallsAudioType = any;
