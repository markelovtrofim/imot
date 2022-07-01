import React, {useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {useAppSelector} from "../../hooks/redux";

const CallPage = () => {

  const history = useHistory();
  const searchParams = useAppSelector(state => state.calls.callPageSearchParams);

  useEffect(() => {
    debugger
    if (searchParams) {
      debugger
      console.log(history.location.search);
      history.location.search = searchParams;
    }
  }, [history]);

  return (
    <div>
      <h1>
        Call Page
      </h1>
    </div>
  );
};

export default CallPage;