import React from 'react';
import Call from "./Call";
import {CallsType} from "../../store/calls/calls.types";

const CallsBundle = React.memo((props: any) => {
  return (
    <div>
      {props.calls.map((call: CallsType) => {
        return <Call name={call.id} call={call.info} callAudio={call.audio} bundleIndex={props.index}/>
      })}
    </div>
  );
});

export default CallsBundle;
