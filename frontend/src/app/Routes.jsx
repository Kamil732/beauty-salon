import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import Home from '../containers/Home'

class Routes extends Component {
    render() {
        return (
            <div className="content-wrap">
                <Switch>
                    <Route exact path="/" component={Home} />
                </Switch>
            </div>
        )
    }
}

export default Routes
