import { h, Component } from 'preact';
import style from './style';
import firebase from '../../components/firebase';
// import memobind from 'memobind';

export default class Input extends Component {

	closeModal = () => {
		document.querySelector('div[class^="overlay"]').removeChild(document.querySelector('.modal-content'));
	}

	handleSubmit = (event) => {
		event.preventDefault();

		const item = this.state.entry;
		// const newValue = {
		// 	id: item.id,
		// 	text: this.state.newText,
		// 	sort: item.sort
		// };
		const nameRef = firebase.database().ref(`/${this.props.charName}/notes/${item.id}/`);
		nameRef.child('text').set(this.state.newText)
			.then(this.closeModal);

		// document.querySelector('div[class^="overlay"]').removeChild(document.querySelector('.modal-content'));
	}

	handleTextChange = (event) => {
		const value = event.target.value.replace(/[\r\n\v]+/g, '');
		event.target.value = value;
		
		this.setState({ newText: event.target.value });
	};

	constructor(props) {
		super(props);
		this.state = {
			entry: this.props.entry,
			newText: this.props.entry.text
		};

		this.closeModal = this.closeModal.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
	}

	componentDidMount() {
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
		
	}

	// Note: `user` comes from the URL, courtesy of our router
	render() {
		return (
			<div class="modal-content">
				<span>This is your original line:</span>
				<p class={style['old-text']}>{this.state.entry.text}</p>
				<p>What would you like to change it to?</p>
				<form autocomplete="off" class={style['nb-form']} onSubmit={this.handleSubmit}>
					<textarea
						class={style['nb-form__input']}
						onChange={this.handleTextChange}
						value={this.state.newText}
						
					/>
					<button type="submit" class="button--confirm" disabled={'' === this.state.newText}>Submit</button>
					<button type="button" class="button--cancel" onClick={this.closeModal}>Cancel</button>
				</form>
			</div>
		);
	}
}
