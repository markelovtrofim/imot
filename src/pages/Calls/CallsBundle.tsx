import React from 'react';
import Call from "./Call";
import {CallsType} from "../../store/calls/calls.types";

const CallsBundle = React.memo((props: any) => {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  return (
    <div>
      {props.calls.map((call: CallsType) => {
        return <Call call={call.info} expanded={expanded} setExpanded={setExpanded}/>
      })}
    </div>
  );
});

export default CallsBundle;
