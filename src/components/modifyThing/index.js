import { h, Component } from 'preact';
import style from './style';
import firebase from '../../components/firebase';

import Cta from '../cta';

export default class Input extends Component {
	closeModal = () => {
		this.props.closeModal();
	};

	handleSubmit = event => {
		event.preventDefault();
		const thingRef = firebase.database().ref(`/${this.props.charName}/things/`);
		if (this.props.thing === undefined) {
			const newPerson = {
				name: this.state.name,
				stats: this.state.stats,
				description: this.state.description,
				notes: this.state.notes
			};

			thingRef.push(newPerson).then(this.closeModal);
		}
		else {
			// console.log(thingRef.orderByChild('name').equalTo(this.props.thing.name));
			thingRef
				.orderByChild('name')
				.equalTo(this.props.thing.name)
				.on('value', snapshot => {
					if (snapshot.val() === null) {
						return;
					}
					const key = Object.keys(snapshot.val())[0];
					console.log(key);
					const keyRef = firebase
						.database()
						.ref(`/${this.props.charName}/things/${key}`);
					keyRef
						.set({
							name: this.state.name,
							stats: this.state.stats,
							description: this.state.description,
							notes: this.state.notes
						})
						.then(this.closeModal);

					this.closeModal();
				});
		}
		this.props.callback();
	};

	handleTextChange = event => {
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

		if (this.props.thing !== undefined) {
			this.setState({
				name: this.props.thing.name,
				stats: this.props.thing.stats,
				description: this.props.thing.description,
				notes: this.props.thing.notes
			});
		}
	}

	render() {
		return (
			<div class="modal-content">
				<form onSubmit={this.handleSubmit}>
					<input
						class={style['nb-form__input']}
						type="text"
						name="name"
						placeholder="What's it called?"
						onKeyUp={this.handleTextChange}
						value={this.state.name}
					/>
					<input
						class={style['nb-form__input']}
						type="text"
						name="stats"
						placeholder="What does it do?"
						onKeyUp={this.handleTextChange}
						value={this.state.stats}
					/>
					<input
						class={style['nb-form__input']}
						type="text"
						name="description"
						placeholder="What does it look like?"
						onKeyUp={this.handleTextChange}
						value={this.state.description}
					/>
					<input
						class={style['nb-form__input']}
						type="text"
						name="notes"
						placeholder="Anything else of interest?"
						onKeyUp={this.handleTextChange}
						value={this.state.notes}
					/>
					<Cta buttonText="Submit" buttonType="submit" class="confirm" />
					<Cta
						buttonText="Cancel"
						buttonType="button"
						clickHandler={this.closeModal}
					/>
				</form>
			</div>
		);
	}
}
