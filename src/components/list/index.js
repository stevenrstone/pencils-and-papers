import { h } from 'preact';
import style from './style.scss';
// import memobind from 'memobind';

// export default class Cta extends Component {
const List = (props) => (
	<ul class={style.list} >
		{props.children}
	</ul>
);

export default List;
