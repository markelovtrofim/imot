import React from 'react';
import Search from "../../components/Search";
import {BlockBox, СontrolBlock} from "../../components";
import Call from "./Call";

const Calls = () => {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  return (
    <div>
      <СontrolBlock/>
      <Search pageName="Звонок"/>
      <BlockBox padding="24px 0 0 0">
        <div>
          {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'].map(call => (
              <Call call={call} expanded={expanded} setExpanded={setExpanded}/>
            )
          )}
        </div>
      </BlockBox>
    </div>
  )
}

export default Calls;