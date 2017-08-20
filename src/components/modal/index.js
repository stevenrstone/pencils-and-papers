import { h } from 'preact';
import style from './style';


const Modal = ({ children }) => (
	<div class={style.overlay}>
		{children}
	</div>
);

export default Modal;