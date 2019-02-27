import { Component, h } from 'preact';
// import { FacebookLogin } from './components/facebook';
import { AlenaAuth } from './components/auth';

export interface AppProps {
	title: string;
}

interface AppState {
	title: string;
}

export class App extends Component<AppProps, AppState> {
	public state = {
		title: 'local state'
	};

	constructor(props: AppProps) {
		super(props);
		this.state.title += ' - ' + props.title;
	}

	componentDidMount() {
		setTimeout(() => {
			let state = this.state;

			state.title = `Preact's [componentDidMount] worked as expected`;
			this.setState(state);
		}, 2000);
	}

	render(props: AppProps, state: AppState) {
		return (
			<div className='wrapper'>
				<AlenaAuth />
			</div>
		)
	}
}