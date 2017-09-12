import { h, Component } from 'preact';
import style from './style';
import firebase from '../../components/firebase';
import memobind from 'memobind';


import List from '../../components/list';
import Item from '../../components/listItem';
import Modal from '../../components/modal';
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

	setSelectedPlace = (place) => {
		this.setState({ selectedPlace: [place] });
	}

	constructor(props) {
		super(props);
		this.state = {
			places: [],
			text: '',
			charName: this.props.charName,
			modalChild: null,
			selectedPlace: []
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
		this.removeItem = this.removeItem.bind(this);
	}

	componentDidMount() {
		const placesRef = firebase.database().ref(`${this.state.charName}/places/`).orderByChild('name');
		placesRef.on('child_added', (snapshot) => {
			let items = snapshot.val();
			const currentState = this.state.places;
			let newState = currentState;
			newState.push(items);
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
				<List>
					 {this.state.places.map((entry) => (
						<Item onClick={memobind(this, 'setSelectedPlace', entry)} class="clickable">
							{entry.name}
						</Item>))}
				</List>
				
				{this.state.selectedPlace.map((sPlace) => (
					<div class={'modal-content ' + style['place-details']}>
						<h2>{sPlace.name}</h2>
						<h4>Location:</h4>
						<p>{sPlace.location}</p>
						<h4>Description:</h4>
						<p>{sPlace.description}</p>
						<h4>Points of Interest:</h4>
						<p>{sPlace.pointsOfInterest}</p>
					</div>
				))}
				<Cta class={`confirm ${style['new-place']}`} buttonText="Add New Place" clickHandler={this.handleAddingPlace} />
			</div>
		);
	}
}
