import { Component, h } from 'preact';
// import url = require('url');
// import queryString = require('query-string');
import * as url from 'url';
import * as queryString from 'query-string';




const facebookInitOptions = {
    appId: '398277270719379',
    version: 'v3.2',
    cookie: true,
    xfbml: true
}

type FacebookUserStatus = 'authorization_expired' | 'connected' | 'not_authorized' | 'unknown';

interface InitOptions {
    scriptLoaded: boolean;
    inited: boolean;
    eventsSubscribed: boolean;
}

interface FacebookEvents {
    xfbmlRendered: boolean;
    login: boolean;
    status: FacebookUserStatus
}

interface Auth {
    change: Function;
}

export class FacebookLogin extends Component<Auth, InitOptions & FacebookEvents> {

    public state: InitOptions & FacebookEvents = {
        scriptLoaded: false,
        inited: false,
        eventsSubscribed: false,
        xfbmlRendered: false,
        login: false,
        status: 'unknown'
    };

    constructor(props: Auth) {
        super(props)

        this.onLoadFacebookSDKScript = this.onLoadFacebookSDKScript.bind(this);

        this.facebookInit = this.facebookInit.bind(this);
        this.subscribeFacebookEvents = this.subscribeFacebookEvents.bind(this);


        this.onFBMLrender = this.onFBMLrender.bind(this);
        this.onFacebookLogin = this.onFacebookLogin.bind(this);
        this.sendAuthResponse = this.sendAuthResponse.bind(this);


    }

    async subscribeFacebookEvents() {
        if (this.state.inited) {
            FB.Event.subscribe('xfbml.render', this.onFBMLrender);
            this.setState({ eventsSubscribed: true });
        }
    }

    async facebookInit() {
        window['fbAsyncInit'] = (): void => {
            FB.init(facebookInitOptions);
        };
        if (this.state.scriptLoaded) {
            await (async () => {
                window['fbAsyncInit'] = (): void => {
                    FB.init(facebookInitOptions);
                };
            })
        }

        if (typeof FB !== 'undefined') {
            this.setState({ inited: true });
        }

        if (this.state.inited) {
            await this.subscribeFacebookEvents();
        }
    }

    onFBMLrender() {
        this.setState({ xfbmlRendered: true });
    }

    async sendAuthResponse(authResponse: fb.AuthResponse) {
        const path = url.parse(location.href);
        const params = queryString.parse(path.search);
        const stringified = queryString.stringify({ ...params, ...authResponse });

        try {

            
            // const response = await fetch(`https://${path.hostname}/facebook/login?${stringified}`)
            const response = await fetch(`https://satana.dg02.ru/facebook/login?${stringified}`)
            if (response.status === 200) {
                this.props.change('ok');
                this.setState({ login: true });
            }
        } catch (error) {
            console.log(error);
        }
    }

    onFacebookLogin(event: Event) {
        event.preventDefault();
        FB.login(({ status, authResponse }: fb.StatusResponse) => {
            this.setState({ status })
            if (status === 'connected') {
                this.sendAuthResponse(authResponse);
            }
        }, {
                auth_type: 'rerequest',
                scope: 'email'
            })
    }

    onLoadFacebookSDKScript(_event: Event) {
        this.setState({ scriptLoaded: true })
    }

    async componentDidMount() {
        if (this.state.scriptLoaded && this.state.inited && !this.state.eventsSubscribed) {
            await this.subscribeFacebookEvents();
        }
    }

    render(): JSX.Element {
        const { scriptLoaded, inited } = this.state;
        if (scriptLoaded && !inited) {
            this.facebookInit();
        }

        return (
            <div>
                <button onClick={this.onFacebookLogin} type='submit' className='submitButton'>Отправить</button>
                <div id="fb-root" ></div>
                <script async defer src="https://connect.facebook.net/ru_RU/sdk.js" onLoad={this.onLoadFacebookSDKScript} ></script>
            </div>
        )
    }

}