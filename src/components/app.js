import { h, Component } from 'preact';
import { Router, route } from 'preact-router';

import Nav from './nav';
import Home from '../routes/home';
import Notes from '../routes/notes';
import Places from '../routes/places';
import People from '../routes/people';
import Things from '../routes/things';
import Config from '../routes/config';

import Modal from './modal';
import Login from './login';

export default class App extends Component {

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	setCharName = (name, path) => {
		console.log(path);
		this.setState({
			charName: name,
			// rendered: false,
		});

		document.cookie = `nbCharName=${this.state.charName}`;
		route(path);
	};

	constructor(props) {
		super(props);
		this.state = {
			charName: ''
		};

		this.setCharName = this.setCharName.bind(this);
	}

	componentDidMount() {
		const cookieValue = document.cookie.replace(
			/(?:(?:^|.*;\s*)nbCharName\s*=\s*([^;]*).*$)|^.*$/,
			'$1'
		);
		console.log('component updated', cookieValue);
		if (cookieValue !== '') {
			this.setCharName(cookieValue, window.location.pathname);
		}
		else {
			route('/');
		}
	}

	renderApp = () => {
		{if (document.getElementById('app') === null) {
			return <div id="app">
				<Nav charName={this.state.charName} />
				<Router onChange={this.handleRoute}>
					<Home path="/" setCharName={this.setCharName} />
					<Notes path="/notes" charName={this.state.charName} />
					<Things path="/places" type="places" charName={this.state.charName} />
					<Things path="/people" type="people" charName={this.state.charName} />
					<Things path="/things" type="things" charName={this.state.charName} />
					<Config path="/config" charName={this.state.charName} />
				</Router>
			</div>
		}}
	};

	renderLogin = () => (
		<Modal>
			<Login setCharName={this.setCharName} />
		</Modal>
	);

	render() {
		if (this.state.charName === '') {
			return this.renderLogin();
		}
		return this.renderApp();
	}
}
