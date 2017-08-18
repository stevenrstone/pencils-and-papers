import { h, Component } from 'preact';
import style from './style';

export default class Input extends Component {
	handleSubmit = (event) => {
		event.preventDefault();
		if (this.state.text !== '') {
			let newStateArray = this.state.entries.slice();
			newStateArray.push(this.state.text);
			this.setState({ entries: newStateArray });
			this.setState({ text: '' });
		}
	}

	handleTextChange = (event) => {
		this.setState({ text: event.target.value });

		// const doc = new this.state.doc({ a: 5, now: new Date(), test: 'this is a string' });
		// doc.b = 13;
		// doc.save((err) => {
		// 	alert(doc._id);
		// });
	};

	constructor(props) {
		super(props);
		this.state = {
			entries: [],
			text: '',
			linvo: this.props.linvo
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
	}

	// gets called when this route is navigated to
	componentDidMount() {
		// getEntries();
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
		
	}

	// Note: `user` comes from the URL, courtesy of our router
	render() {
		return (
			<div>
				<ul>
					 {this.state.entries.map((entry) => (<li>{entry}</li>))}
				</ul>
				<form autocomplete="off" class={style['nb-form']} onSubmit={this.handleSubmit}>
					<input
						class={style['nb-form__input']}
						onChange={this.handleTextChange}
						placeholder="New note"
						type="text"
						value={this.text}
					/>
					<button type="submit" class={style['nb-form__submit']} disabled={'' === this.state.text}>Submit</button>
				</form>
			</div>
		);
	}
}
