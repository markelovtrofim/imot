import React from 'react';
import {ControlBlock} from "../components";
import Filter from "../components/Filter";
import {BlockBox} from "../components/BlockBox";
import Call from "./Call";

const Calls = () => {
  return (
    <div>
      <ControlBlock/>
      <Filter pageName="Звонок"/>
      <BlockBox padding="24px 0 0 0">
        <div>
          {['0', '1', '2', '3', '4', '5'].map(call => (
              <Call call={call}/>
            )
          )}
        </div>
      </BlockBox>
    </div>
  )
}

export default Calls;