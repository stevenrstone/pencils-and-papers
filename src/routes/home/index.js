import { h, Component } from 'preact';
import Modal from '../../components/modal/index';
import Login from '../../components/login/';

// const Home = () => (
export default class Home extends Component {
// const Home = () => (
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Modal>
				<Login setCharName={this.props.setCharName} {...this.props} />
			</Modal>
		);
	}
}
// );

// export default Home;
