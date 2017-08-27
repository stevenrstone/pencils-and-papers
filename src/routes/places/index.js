import { h, Component } from 'preact';
import style from './style';
import firebase from '../../components/firebase';
import memobind from 'memobind';

import Modal from '../../components/modal/index';
import Cta from '../../components/cta';
import ModifyPlace from '../../components/modifyPlace';

export default class Input extends Component {
	handleSubmit = (event) => {
		event.preventDefault();
		if (this.state.text !== '') {
			let newStateArray = this.state.places.slice();
			newStateArray.push({
				id: '',
				name: this.state.name,
				location: this.state.location,
				description: this.state.description,
				pointsOfInterest: this.state.pointsOfInterest
			});

			const placesRef = firebase.database().ref(`${this.state.charName}/places/`);
			const item = {
				name: this.state.name,
				location: this.state.location,
				description: this.state.description,
				pointsOfInterest: this.state.pointsOfInterest
			};
			placesRef.push(item);

			this.setState({ places: newStateArray });
			this.setState({ text: '' });
			event.target.querySelector('[class^="nb-form__input"]').value = '';
		}
	}

	handleAddingPlace = () => {
		this.setState({ modalChild: <ModifyPlace place={undefined} charName={this.state.charName} /> });
	}

	handleTextChange = (event) => {
		this.setState({ text: event.target.value });
	};

	editPlace = (place) => {
		this.setState({ modalChild: <ModifyPlace place={place} charName={this.state.charName} /> });
	}

	removeItem = (itemId) => {
		const itemRef = firebase.database().ref(`/${this.state.charName}/places/${itemId}`);
		itemRef.remove();
	}

	constructor(props) {
		super(props);
		this.state = {
			places: [],
			text: '',
			charName: this.props.charName,
			modalChild: null
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
		this.removeItem = this.removeItem.bind(this);
	}

	componentDidMount() {
		const placesRef = firebase.database().ref(`${this.state.charName}/places/`);
		placesRef.on('value', (snapshot) => {
			let items = snapshot.val();
			let newState = [];
			for (let item in items) {
				if (Object.prototype.hasOwnProperty.call(items, item)) {
					newState.push({
						id: item,
						text: items[item].text,
						sort: items[item].sort
					});
				}
			}
			this.setState({
				places: newState
			});
		});
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
		
	}

	render() {
		return (
			<div class="places">
				<Modal>
					{this.state.modalChild}
				</Modal>
				<ul>
					 {this.state.places.map((entry) => (
						<li data-index={entry.sort}>
							{entry.text}
						</li>))}
				</ul>
				{/* <form autocomplete="off" class={style['nb-form']} onSubmit={this.handleSubmit}>
					<input
						class={style['nb-form__input']}
						onKeyUp={this.handleTextChange}
						placeholder="New note"
						type="text"
					/>
					<button type="submit" class="hidden-submit" disabled={'' === this.state.text}>Submit</button>
				</form> */}
				{/* <button type="button" onClick={this.handleAddingPlace} class={style['new-place-button']}>
					Add New Place
				</button> */}
				<Cta class={`confirm ${style['new-place']}`} buttonText="Add New Place" clickHandler={this.handleAddingPlace} />
			</div>
		);
	}
}
