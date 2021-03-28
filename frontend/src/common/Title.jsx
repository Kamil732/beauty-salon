import { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'

class Title extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
    }

    render() {
        const titleEl = document.getElementsByTagName("title")[0]
        const fullTitle = `Quizzer - ${this.props.title}`

        return ReactDOM.createPortal(fullTitle, titleEl)
    }
}

export default Title