import { h, Component } from 'preact';
import style from './style';
import firebase from '../../components/firebase';
import memobind from 'memobind';

import Modal from '../../components/modal/index';
import ModifyEntry from '../../components/modifyEntry/index';

export default class Notes extends Component {
	handleSubmit = (event) => {
		event.preventDefault();
		if (this.state.text !== '') {
			let newStateArray = this.state.entries.slice();
			newStateArray.push({
				id: '',
				text: this.state.text,
				sort: this.state.entries.length
			});

			const itemsRef = firebase.database().ref(`${this.state.charName}/notes/`);
			const item = {
				text: this.state.text,
				sort: this.state.entries.length
			};
			itemsRef.push(item);

			this.setState({ entries: newStateArray });
			this.setState({ text: '' });
			event.target.querySelector('[class^="nb-form__input"]').value = '';
		}
	}

	customContext = (event) => {
		if (window.getSelection().toString() !== '') {
			event.preventDefault();
			const mouseX = event.clientX;
			const mouseY = event.clientY;

			const menu = document.createElement('ul');
			menu.className = style['custom-context'];
			menu.style.position = 'absolute';
			menu.style.left = `${mouseX}px`;
			menu.style.top = `${mouseY}px`;

			const newPlace = document.createElement('li');
			newPlace.innerHTML = 'new place';

			const newPerson = document.createElement('li');
			newPerson.innerHTML = 'new person';

			const newThing = document.createElement('li');
			newThing.innerHTML = 'new thing';

			menu.appendChild(newPlace);
			menu.appendChild(newPerson);
			menu.appendChild(newThing);
			document.body.appendChild(menu);
		}
	}

	handleTextChange = (event) => {
		this.setState({ text: event.target.value });
	};

	editItem = (item) => {
		this.setState({ modalChild: <ModifyEntry entry={item} charName={this.state.charName} /> });
	}

	removeItem = (itemId) => {
		const itemRef = firebase.database().ref(`/${this.state.charName}/notes/${itemId}`);
		itemRef.remove();
	}

	constructor(props) {
		super(props);
		this.state = {
			entries: [],
			text: '',
			charName: this.props.charName,
			modalChild: null
		};

		this.customContext = this.customContext.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
		this.removeItem = this.removeItem.bind(this);
	}

	componentDidMount() {
		const itemsRef = firebase.database().ref(`${this.state.charName}/notes/`);
		itemsRef.on('value', (snapshot) => {
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
				entries: newState
			});
		});
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
		
	}

	render() {
		return (
			<div class="notes">
				<Modal>
					{this.state.modalChild}
				</Modal>
				<ul>
					 {this.state.entries.map((entry) => (
						<li data-index={entry.sort} onContextMenu={this.customContext} >
							{entry.text}
							<span class="delete-item" onClick={memobind(this, 'removeItem', entry.id)}>Delete</span>
							<span class="edit-item" onClick={memobind(this, 'editItem', entry)}>Edit</span>
						</li>))}
				</ul>
				<form autocomplete="off" class={style['nb-form']} onSubmit={this.handleSubmit}>
					<input
						class={style['nb-form__input']}
						onKeyUp={this.handleTextChange}
						placeholder="New note"
						type="text"
					/>
					<button type="submit" class="hidden-submit" disabled={'' === this.state.text}>Submit</button>
				</form>
			</div>
		);
	}
}
