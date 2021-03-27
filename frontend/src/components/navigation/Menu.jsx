import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

class Menu extends Component {
    render() {
        return (
            <>
                <NavLink to="/contact" className="nav__link">
                    Kontakt
                </NavLink>
                <NavLink to="/my-meetings" className="nav__link">
                    Moje wizyty
                </NavLink>
            </>
        )
    }
}

export default Menu
