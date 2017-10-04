import { h, Component } from 'preact';
import style from './style.scss';
import memobind from 'memobind';

import InlineCta from '../InlineCta';

// const listItem = (props) => {
export default class ListItem extends Component {
	handleMouseEnter() {
		this.setState({
			hovered: true
		});
	}

	handleMouseLeave() {
		this.setState({
			hovered: false
		});
	}
	constructor(props) {
		super();
		this.state = {
			hovered: false
		};

		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.renderClasses = this.renderClasses.bind(this);
	}

	renderClasses() {
		if (this.props.class !== undefined) {
			const classes = this.props.class.split(' ');
			let newClasses = '';
			return classes.map(item => {
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
		const renderInlineCtas = () => {
			if (this.state.hovered) {
				return (
					<span>
						<InlineCta
							class="delete-item"
							onClick={memobind(this, 'removeItem', this.props.entry.id)}
						>
							Delete
						</InlineCta>
						<InlineCta
							class="edit-item"
							onClick={memobind(this, 'editItem', this.props.entry)}
						>
							Edit
						</InlineCta>
					</span>
				);
			}

			return null;
		};
		return (
			<li
				class={style['list-item'] + ' ' + this.renderClasses()}
				data-index={this.props.entry.sort}
				onContextMenu={this.props.onContextMenu}
				onClick={this.props.onClick}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
			>
				{this.props.children}
				{renderInlineCtas()}
			</li>
		);
	}
}

// export default listItem;
