import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotsIndex from "./components/Spots/SpotsIndex";
import SpotDetails from "./components/Spots/SpotDetails";
import SpotCreate from "./components/Spots/SpotCreate";
import SpotsUserIndex from "./components/Spots/SpotsUserIndex";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <div className="main-content">
        {isLoaded && (
          <Switch>
            <Route path="/" exact>
              <SpotsIndex />
            </Route>
            <Route path="/new-spot" exact>
              <SpotCreate />
            </Route>
            <Route path="/spots/current" exact>
              <SpotsUserIndex />
            </Route>
            <Route path="/spots/:spotId" exact>
              <SpotDetails />
            </Route>
          </Switch>
        )}
      </div>
    </>
  );
}

export default App;
