import { Component, h } from 'preact';
import { FacebookLogin } from '../facebook';
import * as image from '../../images/alena.png';


type AuthStatus = 'ok' | 'prepared' | 'fail';

interface AuthState {
    status: AuthStatus;
}

export class AlenaAuth extends Component<{}, AuthState>{


    constructor(props: {}) {
        super(props);

        this.state = {
            status: 'prepared'
        }

        this.getContent = this.getContent.bind(this);
        this.handleAuth = this.handleAuth.bind(this);
    }

    handleAuth(status: AuthStatus) {
        this.setState({ status: status });
    }

    getContent(status: AuthStatus) {
        if (status === 'ok') {
            return '... раздвинула твои булки! Ты попал в анальное рабство!';
        }

        if (status === 'prepared') {
            return 'Привет кусок мяса! Ебани культяпой по кнопе чтобы я раздвинула...';
        }

        if (status === 'fail') {
            return 'Ебаш нахуй отседа!'
        }
    }

    render() {
        return (
            <div className='alenaContainer'>
                <div className='alenaBox'>
                    <div className='alenaCenter'>
                        <img className='alenaImage' src={image} />
                        <div className='alenaText'>{this.getContent(this.state.status)}</div>
                    </div>
                    {
                        this.state.status !== 'ok' &&
                        <div>
                            <div className='policy'>
                                Отправляя данные вы соглашаетесь с <a href='https://digitalgod.be/policy'>политикой конфиденциальности</a>
                            </div>
                            <div className='facebookBlock'>
                                <FacebookLogin change={this.handleAuth} />
                            </div>
                        </div>
                    }

                </div>
            </div>
        );
    }


}



// <div className={style.alenaContainer} >
//     <div className={style.alenaBox}>
//         <div className={style.alenaCenter}>
//             <img className={style.alenaImage} src='/assets/images/alena.png'></img>
//             <div className={style.alenaText}>
//                 Дружочек-колобочек знай! WiFi доступен только нашим ученикам и зарегистрированным гостям.
//         </div>
//         </div>
//         <div className={style.faceBookBlock}>

//             <FacebooTestLogin />
//         </div>
//     </div>
// </div>