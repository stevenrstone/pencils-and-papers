import { h, Component } from 'preact';
import style from './style';
import firebase from '../../components/firebase';
import memobind from 'memobind';

import List from '../../components/list';
import Item from '../../components/listItem';
import Modal from '../../components/modal/index';
import Cta from '../../components/cta';
import ModifyThing from '../../components/modifyThing';

export default class Thing extends Component {
	handleAddingThing = () => {
		this.setState({
			modalChild: (
				<ModifyThing
					thing={undefined}
					charName={this.state.charName}
					closeModal={this.removeModalChild}
				/>
			)
		});
	};

	handleTextChange = event => {
		this.setState({ text: event.target.value });
	};

	editThing = place => {
		this.setState({
			modalChild: (
				<ModifyThing
					thing={place}
					charName={this.state.charName}
					closeModal={this.removeModalChild}
					callback={this.refreshSelectedThing}
				/>
			)
		});
	};

	removeItem = itemId => {
		const itemRef = firebase
			.database()
			.ref(`/${this.state.charName}/${this.state.type}/${itemId}`);
		itemRef.remove();
	};

	removeModalChild = () => {
		this.setState({
			modalChild: null
		});
	};

	refreshSelectedThing = () => {
		if (this.state.selectedThing.length > 0) {
			const selectedId = this.state.selectedThing[0].id;
			const foundObj = this.state.things.find(el => el.id === selectedId);
			this.setSelectedThing(foundObj);
		}
	};

	removeSelectedThing = () => {
		this.setState({
			selectedThing: []
		});
	};

	setSelectedThing = place => {
		this.setState({ selectedThing: [place] });
	};

	updateType = type => {
		this.setState({
			type
		});
	};

	getData = () => {
		const thingsRef = firebase
			.database()
			.ref(`${this.state.charName}/${this.state.type}/`)
			.orderByChild('name');
		thingsRef.on('value', snapshot => {
			let items = snapshot.val();
			let newState = [];
			for (let item in items) {
				if (Object.prototype.hasOwnProperty.call(items, item)) {
					newState.push({
						id: item,
						description: items[item].description,
						name: items[item].name,
						notes: items[item].notes,
						stats: items[item].stats
					});
				}
			}
			newState.sort((a, b) => a.name > b.name);
			this.setState({
				things: newState
			});
		});
	};

	constructor(props) {
		super(props);
		this.state = {
			things: [],
			text: '',
			charName: this.props.charName,
			modalChild: null,
			selectedThing: [],
			type: this.props.type
		};

		console.log(this.state);

		this.getData = this.getData.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
		this.removeItem = this.removeItem.bind(this);
		this.removeModalChild = this.removeModalChild.bind(this);
		this.renderItems = this.renderItems.bind(this);
		this.updateType = this.updateType.bind(this);
	}

	componentDidMount() {
		console.log('component did mount');
		this.getData();
	}

	componentWillReceiveProps(nextProps, nextState) {
		console.log('should component update');
		if (nextProps === this.props) {
			return false;
		}

		this.updateType(nextProps.type);
		this.removeSelectedThing();
		this.getData();

		return true;
	}

	renderItems = () => {
		if (this.state.things[0] === undefined) {
			return;
		}

		const thingObj = this.state.things[0];
		const keys = Object.keys(thingObj);

		return keys.map(key => (
			<Item
				onClick={memobind(this, 'setSelectedThing', thingObj[key])}
				class="clickable"
			>
				{thingObj[key].name}
			</Item>
		));
	};

	render() {
		return (
			<div class="things">
				<Modal>{this.state.modalChild}</Modal>
				<List>
					{this.state.things.map((thing, index) => (
						<Item
							onClick={memobind(this, 'setSelectedThing', thing)}
							class="clickable"
						>
							{thing.name}
						</Item>
					))}

					{/* {this.renderItems()} */}
				</List>

				{this.state.selectedThing.map(sThing => (
					<div class={'modal-content ' + style['place-details']}>
						<h2>{sThing.name}</h2>
						<h4>Stats:</h4>
						<p>{sThing.stats}</p>
						<h4>Description:</h4>
						<p>{sThing.description}</p>
						<h4>Notes:</h4>
						<p>{sThing.notes}</p>
						<Cta
							class={style.edit}
							buttonText={`Edit ${sThing.name}`}
							clickHandler={memobind(this, 'editThing', sThing)}
						/>
					</div>
				))}
				<Cta
					class={`confirm ${style['new-place']}`}
					buttonText={`Add New ${this.state.type.charAt(0).toUpperCase() +
						this.state.type.slice(1)}`}
					clickHandler={this.handleAddingThing}
				/>
			</div>
		);
	}
}
