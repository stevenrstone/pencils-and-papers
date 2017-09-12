import { h, Component } from 'preact';
import style from './style.scss';

// const listItem = (props) => {
export default class ListItem extends Component {
	constructor(props) {
		super();
		this.state = {};

		this.renderClasses = this.renderClasses.bind(this);
	}

	renderClasses() {
		if (this.props.class !== undefined) {
			const classes = this.props.class.split(' ');
			let newClasses = '';
			return classes.map((item) => {
				if (style[item] !== undefined) {
					newClasses += ` ${style[item]}`;
				}
				else {
					newClasses += ` ${item}`;
				}
				return newClasses;
			});
		}
		return '';
	}

	render() {
		return (
			<li class={style['list-item'] + ' ' + this.renderClasses()}
				data-index={this.props['data-index']}
				onContextMenu={this.props.onContextMenu}
				onClick={this.props.onClick}
			>
				{this.props.children}
			</li>
		);
	}
}

// export default listItem;
