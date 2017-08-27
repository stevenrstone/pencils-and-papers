import { h, Component } from 'preact';
import style from './style.scss';

export default class Cta extends Component {
	constructor(props) {
		super(props);

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
				console.log(newClasses);
				return newClasses;
			});
		}
		return '';
	}

	render() {
		return (
			<button type={this.props.buttonType !== null ? this.props.buttonType : 'button'}
				onClick={this.props.clickHandler}
				class={style.button + ' ' + this.renderClasses()}
			>
				{this.props.buttonText}
			</button>
		);
	};
};

// export default Cta;
