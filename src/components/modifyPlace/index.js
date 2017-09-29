import { h, Component } from 'preact';
import style from './style';
import firebase from '../../components/firebase';

import Cta from '../cta';

export default class Input extends Component {

	closeModal = () => {
		this.props.closeModal();
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
			const placesRef = firebase.database().ref(`/${this.props.charName}/places/`);
			placesRef.push(newPlace)
				.then(this.closeModal);

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
				<form onSubmit={this.handleSubmit}>
					<input class={style['nb-form__input']} type="text" name="name" placeholder="What's it called?" onKeyUp={this.handleTextChange} />
					<input class={style['nb-form__input']} type="text" name="location" placeholder="Where is it?" onKeyUp={this.handleTextChange} />
					<input class={style['nb-form__input']} type="text" name="description" placeholder="What's it like?" onKeyUp={this.handleTextChange} />
					<input class={style['nb-form__input']} type="text" name="pointsOfInterest" placeholder="What's there?" onKeyUp={this.handleTextChange} />
					<Cta buttonText="Submit" buttonType="submit" class="confirm" />
					<Cta buttonText="Cancel" buttonType="button" clickHandler={this.closeModal} />
				</form>
			</div>
		);
	}
}
