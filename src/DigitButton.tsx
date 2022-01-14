import React from 'react'
import { Action, ActionType } from './App'

type DigitButtonProps = {
  dispatch: (action: Action) => void
  digit: string
}

const DigitButton = (props: DigitButtonProps): JSX.Element => {
  return (
    <button
      onClick={() =>
        props.dispatch({ type: ActionType.ADD_DIGIT, payload: props.digit })
      }
    >
      {props.digit}
    </button>
  )
}

export default DigitButton
