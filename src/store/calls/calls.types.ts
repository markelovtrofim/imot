export type CallInitialStateType = {
  total: number | null,
  found: number | null,
  skip: number,
  limit: number,
  sort: string,
  callIds: null,
  callsIncomplete: CallIncompleteType[] | [],
  selectedCalls: SelectedCallType[],
  currentCall: CallType | null | false,
  expandedId: string,

  callPageSearchParams: string,
  popupVisible: boolean,
  popupPosition: {
    top: number,
    left: number,
  },
  allUserDicts: any,
}

export type SelectedCallType = {
  callId: string
}

// get all calls
export type ResponseBaseCallsDataType = {
  total: number,
  found: number,
  skip: number,
  limit: number,
  call_ids: string[]
};

export type DictionaryPopupType = {
  popupVisible: boolean,
  popupPosition: {
    top: number,
    left: number,
  }
};

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

export type CallIncompleteType = {
  id: string | null,
  info: CallInfoType | null,
  expanded: boolean
}

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

export type CallsActionDataType = {
  action: string,
  engine: string,
  keep_fragments: boolean,
  call_ids?: string[],
  search_filter_hash?: string,
  columns?: string[]
}