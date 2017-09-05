import { h, Component } from 'preact';
import style from './style.scss';
import memobind from 'memobind';

export default class Cta extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		// this.renderClasses = this.renderClasses.bind(this);
	}

	// renderClasses() {
	// 	if (this.props.class !== undefined) {
	// 		const classes = this.props.class.split(' ');
	// 		let newClasses = '';
	// 		return classes.map((item) => {
	// 			if (style[item] !== undefined) {
	// 				newClasses += ` ${style[item]}`;
	// 			}
	// 			else {
	// 				newClasses += ` ${item}`;
	// 			}
	// 			return newClasses;
	// 		});
	// 	}
	// 	return '';
	// }

	render() {
		return (
			<ul>
				{this.state.entries.map((entry) => (
					<li data-index={entry.sort} onContextMenu={this.customContext} >
						{entry.text}
						<span style="color: red;" class="delete-item" onClick={memobind(this, 'removeItem', entry.id)}>x</span>
						<span style="color: green;" class="edit-item" onClick={memobind(this, 'editItem', entry)}>e</span>
					</li>))}
			</ul>
		);
	};
};

// export default Cta;
