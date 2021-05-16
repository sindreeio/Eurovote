import React from "react";
import { BrowserRouter, Route, Switch} from "react-router-dom";
import LandingPage from './landingPage/landingPage.js';
import Login from './authentication/login';
import Register from './authentication/register';
import VotingPage from './voting/VotingPage';
import ResultPage from './host/resultPage.js'
import App from '../App';
import HostPage from "./host/hostPage.js";

function Router(){
    return(
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <LandingPage/>
                </Route>
                <Route exact path="/login">
                    <Login/>
                </Route>
                <Route exact path="/registrer">
                    <Register/>
                </Route>
                <Route exact path="/host">
                    <HostPage/>
                </Route>
                <Route exact path="/vote/">
                    <VotingPage/>
                </Route>
                <Route exact path="/app">
                    <App/>
                </Route>
                <Route exact path="/results">
                    <ResultPage/>
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default Router;