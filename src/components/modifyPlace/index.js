import { h, Component } from 'preact';
import style from './style';
import firebase from '../../components/firebase';

import Cta from '../cta';

export default class Input extends Component {

	closeModal = () => {
		document.querySelector('div[class^="overlay"]').removeChild(document.querySelector('.modal-content'));
	}

	handleSubmit = (event) => {
		event.preventDefault();
		if (this.props.place === undefined) {
			const newPlace = {
				name: this.state.name,
				location: this.state.location,
				description: this.state.description,
				pointsOfInterest: this.state.pointsOfInterest
			};
			// double check how to add new entry to firebase db
			const placeRef = firebase.database().ref(`/${this.props.charName}/notes/${newPlace.name}`);

		}

		// const item = this.state.entry;
		// const nameRef = firebase.database().ref(`/${this.props.charName}/notes/${item.id}/`);
		// nameRef.child('text').set(this.state.newText)
		// 	.then(this.closeModal);
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
			location: this.state.location,
			description: this.state.description,
			pointsOfInterest: this.state.pointsOfInterest
		};

		this.closeModal = this.closeModal.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
	}

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
					<Cta buttonText="Submit" buttonType="submit" class="confirm" />
					<Cta buttonText="Cancel" buttonType="button" clickHandler={this.closeModal} />
				</form>
			</div>
		);
	}
}
