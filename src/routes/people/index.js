import { h, Component } from 'preact';
import style from './style';
import firebase from '../../components/firebase';
import memobind from 'memobind';

import List from '../../components/list';
import Item from '../../components/listItem';
import Modal from '../../components/modal';
import Cta from '../../components/cta';
import ModifyPerson from '../../components/modifyPerson';

export default class Input extends Component {
	handleSubmit = (event) => {
		event.preventDefault();
		if (this.state.text !== '') {
			let newStateArray = this.state.people.slice();
			newStateArray.push({
				id: '',
				name: this.state.name,
				location: this.state.location,
				description: this.state.description,
				notes: this.state.notes
			});

			const peopleRef = firebase.database().ref(`${this.state.charName}/people/`);
			const item = {
				name: this.state.name,
				location: this.state.location,
				description: this.state.description,
				notes: this.state.notes
			};
			peopleRef.push(item);

			this.setState({ people: newStateArray });
			this.setState({ text: '' });
			event.target.querySelector('[class^="nb-form__input"]').value = '';
		}
	}

	handleAddingPerson = () => {
		this.setState({ modalChild: <ModifyPerson person={undefined} charName={this.state.charName} /> });
	}

	handleTextChange = (event) => {
		this.setState({ text: event.target.value });
	};

	editPerson = (person) => {
		this.setState({ modalChild: <ModifyPerson person={person} charName={this.state.charName} /> });
	}

	removeItem = (itemId) => {
		const itemRef = firebase.database().ref(`/${this.state.charName}/people/${itemId}`);
		itemRef.remove();
	}

	setSelectedPerson = (person) => {
		this.setState({ selectedPerson: [person] });
	}

	constructor(props) {
		super(props);
		this.state = {
			people: [],
			text: '',
			charName: this.props.charName,
			modalChild: null,
			selectedPerson: []
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
		this.removeItem = this.removeItem.bind(this);
	}

	componentDidMount() {
		const peopleRef = firebase.database().ref(`${this.state.charName}/people/`).orderByChild('name');
		peopleRef.on('child_added', (snapshot) => {
			let items = snapshot.val();
			const currentState = this.state.people;
			let newState = currentState;
			newState.push(items);
			this.setState({
				people: newState
			});
		});
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
		
	}

	render() {
		return (
			<div class="people">
				<Modal>
					{this.state.modalChild}
				</Modal>
				<List>
					 {this.state.people.map((entry) => (
						<Item onClick={memobind(this, 'setSelectedPerson', entry)} class="clickable">
							{entry.name}
						</Item>))}
				</List>
				
				{this.state.selectedPerson.map((sPerson) => (
					<div class={'modal-content ' + style['person-details']}>
						<h2>{sPerson.name}</h2>
						<h4>Location:</h4>
						<p>{sPerson.location}</p>
						<h4>Description:</h4>
						<p>{sPerson.description}</p>
						<h4>Notes:</h4>
						<p>{sPerson.description}</p>
					</div>
				))}
				<Cta class={`confirm ${style['new-person']}`} buttonText="Add New Person" clickHandler={this.handleAddingPerson} />
			</div>
		);
	}
}
