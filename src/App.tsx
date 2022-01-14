import React, { useReducer, ReactElement } from 'react'
import './App.css'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'

export enum ActionType {
	ADD_DIGIT,
	CHOOSE_OPERATION,
	CLEAR,
	DELETE_DIGIT,
	EVALUATE,
}

type State = {
	currentOperand?: string
	previousOperand?: string
	operation?: string
	overwrite?: boolean
}

export type Action = {
	type: ActionType
	payload?: string
}

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case ActionType.ADD_DIGIT:
			if (state.overwrite) {
				return {
					...state,
					currentOperand: action.payload,
					overwrite: false,
				}
			}
			if (action.payload === '0' && state.currentOperand === '0') {
				return state
			}
			if (action.payload === '.' && state.currentOperand?.includes('.')) {
				return state
			}
			return {
				...state,
				currentOperand: `${state.currentOperand || ''}${action.payload}`,
			}
		case ActionType.CHOOSE_OPERATION:
			if (state.currentOperand == null && state.previousOperand == null) {
				return state
			}
			if (state.currentOperand == null) {
				return {
					...state,
					operation: action.payload,
				}
			}
			if (state.previousOperand == null) {
				return {
					...state,
					operation: action.payload,
					previousOperand: state.currentOperand,
					currentOperand: undefined,
				}
			}
			if (state.previousOperand !== null && state.currentOperand !== null) {
				return {
					...state,
					operation: action.payload,
					previousOperand: evaluate(state),
					currentOperand: undefined,
				}
			}
			break
		case ActionType.CLEAR:
			return {}
		case ActionType.DELETE_DIGIT:
			if (state.overwrite) {
				return {
					...state,
					overwrite: false,
					currentOperand: undefined,
				}
			}
			if (state.currentOperand === undefined) {
				return state
			}
			if (state.currentOperand.length === 1) {
				return {
					...state,
					currentOperand: undefined,
				}
			}
			return {
				...state,
				currentOperand: state.currentOperand.slice(0, -1),
			}
		case ActionType.EVALUATE:
			if (
				state.currentOperand === undefined ||
				state.previousOperand === undefined ||
				state.operation === undefined
			) {
				return state
			}
			return {
				...state,
				overwrite: true,
				operation: undefined,
				previousOperand: undefined,
				currentOperand: evaluate(state),
			}
	}
	return {}
}

const evaluate = ({
	previousOperand,
	currentOperand,
	operation,
}: State): string => {
	if (previousOperand === undefined || currentOperand === undefined) {
		return ''
	}
	const prev = parseFloat(previousOperand)
	const curr = parseFloat(currentOperand)
	if (isNaN(prev) || isNaN(curr)) {
		return ''
	}
	let result = 0
	switch (operation) {
		case '+':
			result = prev + curr
			break
		case '-':
			result = prev - curr
			break
		case '/':
			result = prev / curr
			break
		case '*':
			result = prev * curr
			break
	}
	return String(result)
}

const INT_FORMATTER = new Intl.NumberFormat('en-us', {
	maximumFractionDigits: 0,
})

const formatOperand = (operand: string | undefined): string => {
	if (operand === undefined) {
		return ''
	}
	const [intpart, decimal] = operand.split('.')
	if (decimal == undefined) {
		return INT_FORMATTER.format(Number(intpart))
	}
	return `${INT_FORMATTER.format(Number(intpart))}.${decimal}`
}

const App = (): ReactElement => {
	const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
		reducer,
		{},
	)
	return (
		<div className="calculator-grid">
			<div className="output">
				<div className="previous-operand">
					{formatOperand(previousOperand)} {operation}
				</div>
				<div className="current-operand">{formatOperand(currentOperand)}</div>
			</div>
			<button
				className="span-two"
				onClick={() => dispatch({ type: ActionType.CLEAR })}
			>
				AC
			</button>
			<button onClick={() => dispatch({ type: ActionType.DELETE_DIGIT })}>
				DEL
			</button>
			<OperationButton operation="/" dispatch={dispatch} />
			<DigitButton digit="1" dispatch={dispatch} />
			<DigitButton digit="2" dispatch={dispatch} />
			<DigitButton digit="3" dispatch={dispatch} />
			<OperationButton operation="*" dispatch={dispatch} />
			<DigitButton digit="4" dispatch={dispatch} />
			<DigitButton digit="5" dispatch={dispatch} />
			<DigitButton digit="6" dispatch={dispatch} />
			<OperationButton operation="+" dispatch={dispatch} />
			<DigitButton digit="7" dispatch={dispatch} />
			<DigitButton digit="8" dispatch={dispatch} />
			<DigitButton digit="9" dispatch={dispatch} />
			<OperationButton operation="-" dispatch={dispatch} />
			<DigitButton digit="0" dispatch={dispatch} />
			<DigitButton digit="." dispatch={dispatch} />
			<button
				className="span-two"
				onClick={() => dispatch({ type: ActionType.EVALUATE })}
			>
				=
			</button>
		</div>
	)
}

export default App
