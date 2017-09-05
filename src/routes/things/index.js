import { h, Component } from 'preact';
import style from './style';
import firebase from '../../components/firebase';
import memobind from 'memobind';

import Modal from '../../components/modal/index';
import Cta from '../../components/cta';
import ModifyThing from '../../components/modifyThing';

export default class Input extends Component {
	handleSubmit = (event) => {
		event.preventDefault();
		if (this.state.text !== '') {
			let newStateArray = this.state.things.slice();
			newStateArray.push({
				id: '',
				name: this.state.name,
				stats: this.state.stats,
				description: this.state.description,
				notes: this.state.notes
			});

			const thingsRef = firebase.database().ref(`${this.state.charName}/things/`);
			const item = {
				name: this.state.name,
				stats: this.state.stats,
				description: this.state.description,
				notes: this.state.notes
			};
			thingsRef.push(item);

			this.setState({ things: newStateArray });
			this.setState({ text: '' });
			event.target.querySelector('[class^="nb-form__input"]').value = '';
		}
	}

	handleAddingThing = () => {
		this.setState({ modalChild: <ModifyThing thing={undefined} charName={this.state.charName} /> });
	}

	handleTextChange = (event) => {
		this.setState({ text: event.target.value });
	};

	editThing = (place) => {
		this.setState({ modalChild: <ModifyThing thing={place} charName={this.state.charName} /> });
	}

	removeItem = (itemId) => {
		const itemRef = firebase.database().ref(`/${this.state.charName}/things/${itemId}`);
		itemRef.remove();
	}

	setSelectedThing = (place) => {
		this.setState({ selectedThing: [place] });
	}

	constructor(props) {
		super(props);
		this.state = {
			things: [],
			text: '',
			charName: this.props.charName,
			modalChild: null,
			selectedThing: []
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
		this.removeItem = this.removeItem.bind(this);
	}

	componentDidMount() {
		const thingsRef = firebase.database().ref(`${this.state.charName}/things/`).orderByChild('name');
		thingsRef.on('child_added', (snapshot) => {
			let items = snapshot.val();
			const currentState = this.state.things;
			let newState = currentState;
			newState.push(items);
			this.setState({
				things: newState
			});
		});
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
		
	}

	render() {
		return (
			<div class="things">
				<Modal>
					{this.state.modalChild}
				</Modal>
				<ul>
					 {this.state.things.map((entry) => (
						<li onClick={memobind(this, 'setSelectedThing', entry)}>
							{entry.name}
						</li>))}
				</ul>
				
				{this.state.selectedThing.map((sThing) => (
					<div class={'modal-content ' + style['place-details']}>
						<h2>{sThing.name}</h2>
						<h4>Location:</h4>
						<p>{sThing.stats}</p>
						<h4>Description:</h4>
						<p>{sThing.description}</p>
						<h4>Notes</h4>
						<p>{sThing.notes}</p>
					</div>
				))}
				<Cta class={`confirm ${style['new-place']}`} buttonText="Add New Thing" clickHandler={this.handleAddingThing} />
			</div>
		);
	}
}
