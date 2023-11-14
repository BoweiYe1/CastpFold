// the whole frame, including everything
import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom';

import Banner from './commons/Banner'
import LandingPage from './LandingPage'
import InfoPage from './InfoPage'
import CalculationPage from './CalculationPage'
import NoMatchPage from './NoMatchPage'
import SearchPage from './SearchPage'

import './style.css';
import 'antd/dist/antd.css';
import { RootPath } from '../Settings';



class Main extends Component {


    render = () => {
        return (
            <div>
                <Banner />
                {" "}
                <Switch>
                    {/* route control: show different page according to url */}

                    <Route exact path={RootPath+""} component={LandingPage} />
                    <Route path={RootPath+"search"} component={SearchPage} />
                    <Route path={RootPath+"about"} component={InfoPage} />
                    <Route path={RootPath+"news"} component={InfoPage} />
                    <Route path={RootPath+"compute"} component={CalculationPage} />
                    <Route render={()=><NoMatchPage url={window.location.pathname}/>} />
                    
                    
                    {/*
                    <Route path="/404" component={NoMatchPage} />
                    <Route render={() => <Redirect to="/404" />} />
                    <Route component={NoMatchPage} />
                    */}        
                </Switch>
            </div>
        )
    }
}


export default Main;