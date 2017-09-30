import { h, Component } from 'preact';

export default class Login extends Component  {

	handleChange = (event) => {
		this.setState({
			charName: event.target.value
		});
	}

	handleSubmit = (event) => {
		event.preventDefault();
		let url = location.pathname;
		if (location.pathname === '/') {
			url = /notes/;
		}
		this.props.setCharName(this.state.charName, url);
	}

	constructor(props) {
		super(props);
		this.state = {
			charName: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	render() {
		return (
			<form class="modal-content" onSubmit={this.handleSubmit}>
				<p>What is your character's name?</p>
				<input
					type="text"
					onChange={this.handleChange}
					value={this.state.charName}
				/>
			</form>
		);
	}
}