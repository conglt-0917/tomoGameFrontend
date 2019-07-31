import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import QuesArea from './QuesArea';
import RankArea from './RankArea';
import store from 'store';
import * as tomoAction from 'actions/tomoAction';

import '../../style/Sunfetti.css';
import '../../style/App.css';

class PlayerLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '0x0',
      balance: ''
    };
    console.log('player', props);
  }

  async componentDidMount() {
    this.interval = setInterval(() => {
      // console.log(this.props.tomo);
      if (this.props.tomo.account !== null && this.props.tomo.game !== null) {
        store.dispatch(tomoAction.fetchWinCount());
        store.dispatch(tomoAction.getBalance());
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.game !== prevState.game) {
      store.dispatch(tomoAction.updateNewGame(nextProps.game[0].address));
    }
  }

  render() {
    const { rank } = this.props;
    const { question, questionCount } = this.props;
    const { wincount } = this.props;
    const { tomo } = this.props;
    return (
      <div>
        <Container>
          {tomo.web3 ? (
            question && questionCount < 10 ? (
              <Row className='set_height'>
                <QuesArea ques={question} acc={this.props.tomo} />
                <RankArea rank={rank} wincount={wincount} />
              </Row>
            ) : (
              <Row className='set_height'>
                <Col className='box_color' xs='8'>
                  <div className='margin_box '>
                    <span> Waiting ...</span>
                  </div>
                </Col>
                <RankArea rank={rank} />
              </Row>
            )
          ) : (
            <Row className='set_height'>
              <Col xs='12'>
                <div className='Sun_layer'>
                  <span className='Sun_text'>SUN*FETTI</span>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    );
  }
}

const mapStatetoProps = (state) => {
  const question = state.firestore.ordered.current_question;
  const game = state.firestore.ordered.current_game;
  return {
    game: game,
    question: question,
    rank: state.rank.ranking,
    wincount: state.tomo.winCount,
    questionCount: state.tomo.questionCount,
    tomo: state.tomo
  };
};

export default compose(
  connect(mapStatetoProps),
  firestoreConnect([
    {
      collection: 'current_question'
    },
    {
      collection: 'current_game'
    }
  ])
)(PlayerLayout);
