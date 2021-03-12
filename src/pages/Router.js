import React from "react";
import { BrowserRouter, Route, Switch} from "react-router-dom";
import LandingPage from './landingPage/landingPage.js';
import Login from './authentication/login';
import Register from './authentication/register';
import Countrylist from '../pages/voting/CountryList';
import App from '../App';

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
                <Route exact path="/vote/:username/:adminId">
                    <Countrylist/>
                </Route>
                <Route exact path="/app">
                    <App/>
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default Router;