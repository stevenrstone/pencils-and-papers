import { h, Component } from 'preact';
import { Router, route } from 'preact-router';

import Nav from './nav';
import Home from '../routes/home';
// import Profile from '../routes/profile';
import Test from '../routes/test';
import Input from '../routes/input';
// import Home from 'async!./home';
// import Profile from 'async!./profile';

export default class App extends Component {

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	setCharName = (name, path) => {
		this.setState({
			charName: name
		});

		document.cookie = `nbCharName=${this.state.charName}`;

		if (path !== '/') {
			route(path);
		}
		else {
			route('/input/');
		}
	}

	constructor(props) {
		super(props);
		this.state = {
			charName: ''
		};

		this.setCharName = this.setCharName.bind(this);
	}

	componentDidMount() {
		const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)nbCharName\s*=\s*([^;]*).*$)|^.*$/,'$1');

		console.log(cookieValue);
		if (cookieValue !== '') {
			this.setCharName(cookieValue, window.location.pathname);
		}
		else {
			console.log('routing home');
			route('/');
		}
	}

	render() {
		return (
			<div id="app">
				<Nav charName={this.state.charName} />
				<Router onChange={this.handleRoute}>
					<Home path="/" setCharName={this.setCharName} />
					<Test path="/test/" />
					<Input path="/input" setCharName={this.setCharName} charName={this.state.charName} />
				</Router>
				
			</div>
		);
	}
}
