import { h, Component } from 'preact';
import style from './style';
import firebase from '../../components/firebase';

import Cta from '../cta';

export default class Input extends Component {

	closeModal = () => {
		document.querySelector('div[class^="overlay"]').removeChild(document.querySelector('div[class^="overlay"] .modal-content'));
	}

	handleSubmit = (event) => {
		event.preventDefault();
		if (this.props.thing === undefined) {
			const newPerson = {
				name: this.state.name,
				stats: this.state.stats,
				description: this.state.description,
				notes: this.state.notes
			};
			// double check how to add new entry to firebase db
			const thingRef = firebase.database().ref(`/${this.props.charName}/things/`);
			thingRef.push(newPerson)
				.then(this.closeModal);

		}
	}

	handleTextChange = (event) => {
		const value = event.target.value.replace(/[\r\n\v]+/g, '');
		event.target.value = value;
		
		this.setState({ [event.target.name]: event.target.value });
	};

	constructor(props) {
		super(props);
		this.state = {
			name: this.state.name,
			stats: this.state.stats,
			description: this.state.description,
			notes: this.state.notes
		};

		this.closeModal = this.closeModal.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
	}

	render() {
		return (
			<div class="modal-content">
				<form onSubmit={this.handleSubmit}>
					<input class={style['nb-form__input']} type="text" name="name" placeholder="What's it called?" onKeyUp={this.handleTextChange} />
					<input class={style['nb-form__input']} type="text" name="stats" placeholder="What does it do?" onKeyUp={this.handleTextChange} />
					<input class={style['nb-form__input']} type="text" name="description" placeholder="What does it look like?" onKeyUp={this.handleTextChange} />
					<input class={style['nb-form__input']} type="text" name="notes" placeholder="Anything else of interest?" onKeyUp={this.handleTextChange} />
					<Cta buttonText="Submit" buttonType="submit" class="confirm" />
					<Cta buttonText="Cancel" buttonType="button" clickHandler={this.closeModal} />
				</form>
			</div>
		);
	}
}
