export type CallTagType = {
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
};

export type CallInfoType = {
  id: string,
  callTime: string,
  callTimeReadable: string,
  clientPhone: string,
  operatorPhone: string,
  userId: string,
  uniqueId: string,
  conversationId: string,
  duration: number,
  allowedActions: string[],
  tags: CallTagType[]
};

export type CallType = {
  id: string | null,
  info: CallInfoType | null,
  stt: CallSttType | null,
  audio: CallAudioType | null
};

// Stt
export type CallSttType = {
  all_engines: string[],
  engine: string,
  fragments: CallSttFragmentType[]
};

export type CallSttFragmentType = {
  id: string,
  direction: string,
  text: string,
  begin: number,
  end: number,
  words: CallSttWordType[]
}

export type CallSttWordType = {
  begin: number,
  end: number,
  word: string,
  conf: number
}

// Audio
export type CallAudioType = string;


export type CallActionDataType = {
  action: string,
  engine: string,
  keep_fragments: boolean
}