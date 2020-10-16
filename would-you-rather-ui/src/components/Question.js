import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { handleAnswer } from '../actions/users'
import UserInfo from './UserInfo'

class Question extends Component {
	state = {
		choice: ''
	}

	setChoice = (choice) => {
		this.setState({
			choice: choice
		})
	}

	randomNum = () => Math.floor(Math.random() * this.props.questionIds.length)

	questionId = () => window.location.pathname.substr(11)

	question = (id = this.questionId()) => this.props.questions[id]

	render() {
		const { display, authedUser, questionIds, questions, users, dispatch } = this.props
		const { choice } = this.state
		const num = this.randomNum()
		const randomQuestion = this.question(questionIds[num])
		const question = this.question()
		const opt1 = 'optionOne'
		const opt2 = 'optionTwo'
		const optionText = (option) => {
			return authedUser === undefined
				? randomQuestion[option].text
				: question[option].text
		}
		const isAnswered = () => Object.keys(authedUser.answers).includes(question.id)
		const usersAnswer = () => authedUser.answers[question.id]
		const votes = (option) => question[option].votes.length
		const choiceAverage = (option) => (question[option].votes.length / Object.keys(users).length * 100).toFixed(2)
		const border = '2px solid red'
		return(
			<div className='page' style={{display: display ? 'none' : ''}}>
				<h2>Would You Rather...</h2>
				{authedUser === undefined
 					? questionIds.length === 0
 						? <div>Loading...</div>
 						: <div style={{display: display}}>
						    <button id='opt1' >{optionText(opt1)}?</button>
						    <h3>--or--</h3>
						    <button id='opt2' >{optionText(opt2)}?</button>
						  </div>
					: question !== undefined
						? <div>
							<UserInfo id={question.author} />
							<button id='opt1' onClick={e => this.setChoice(opt1)} style={{border: usersAnswer() === opt1 && border}}>{optionText(opt1)}?</button>
							<p style={{display: isAnswered() ? '' : 'none' }}>votes: {votes(opt1)}  / choice of {choiceAverage(opt1)}% of players</p>
							<h3 className='or'>--or--</h3>
							<button id='opt2' onClick={e => this.setChoice(opt2)} style={{border: usersAnswer() === opt2 && border}}>{optionText(opt2)}?</button>
						  	<p style={{display: isAnswered() ? '' : 'none' }}>votes: {votes(opt2)}  / choice of {choiceAverage(opt2)}% of players</p>
							<Link to='/' >
						  	{isAnswered()
						  		? <span><button className='submit' disabled >Final Answer</button> already answered!</span>
						  		: choice === ''
						  			? <button className='submit' disabled>Final Answer</button>
						  			: <button className='submit' onClick={e => dispatch(handleAnswer(question.id, choice))}>Final Answer</button>
						  	}
						  	</Link>
	                		<Link to='/polls'><button className='backBtn'>back</button></Link>
						  </div>
						: <div style={{display: display ? 'none' : ''}}>
							<h1>404</h1>
							<h4>This poll quesetion is not available</h4>
						  </div>
				}
			</div>
		)
	}
}

function mapStateToProps ({ questions, authedUser, users }, { num, display }) {
	return {
		users,
		authedUser: users[authedUser],
		questions,
		questionIds: Object.keys(questions),
		num,
		display
	}
}

export default connect(mapStateToProps)(Question)
