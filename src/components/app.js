import { h, Component } from 'preact';
import { Router } from 'preact-router';

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

	componentDidMount() {
		const script = document.createElement('script');
		script.src = 'https://www.gstatic.com/firebasejs/4.3.0/firebase.js';
		document.body.appendChild(script);

		const config = {
			apiKey: 'AIzaSyDJkXbi8-lcf0Vbi26G9IxIDS6MGjXXft0',
			authDomain: 'notebook-a0d26.firebaseapp.com',
			databaseURL: 'https://notebook-a0d26.firebaseio.com',
			projectId: 'notebook-a0d26',
			storageBucket: '',
			messagingSenderId: '924537163366'
		};
		//firebase should be defined in the above script tag
		firebase.initializeApp(config);
	}

	render() {
		return (
			<div id="app">
				<Nav />
				<Router onChange={this.handleRoute}>
					<Input path="/" />
					<Test path="/test/" />
					<Input path="/input" />
				</Router>
				
			</div>
		);
	}
}
