import {saveAnswer} from '../utils/api'
export const RECEIVE_USERS = 'RECEIVE_USERS'
export const ADD_USER_ANSWER = 'ADD_USER_ANSWER'

export function receiveUsers (users) {
	return {
		type: RECEIVE_USERS,
		users,
	}
}

export function addUserAnswer (authedUser, qid, answer) {
	return {
		type: ADD_USER_ANSWER,
		authedUser,
		qid,
		answer
	}
}

export function handleAnswer (authedUser, qid, answer) {
    return (dispatch) => {
        return saveAnswer({authedUser, qid, answer})
            .catch(() => {
                alert('Answer not saved, submit again.')
            }).then(() => {
                dispatch(addUserAnswer(authedUser, qid, answer))
            })
    }
}
