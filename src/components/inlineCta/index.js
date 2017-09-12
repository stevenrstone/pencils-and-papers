import { h } from 'preact';
import style from './style';

const inlineCta = (props) => (
	<span class={style[props.class]} onClick={props.onClick}>
		{props.children}
	</span>
);

export default inlineCta;
