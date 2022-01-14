import React from 'react'
import { Action, ActionType } from './App'

type DigitButtonProps = {
  dispatch: (action: Action) => void
  operation: string
}

const OperationButton = (props: DigitButtonProps): JSX.Element => {
  return (
    <button
      onClick={() =>
        props.dispatch({
          type: ActionType.CHOOSE_OPERATION,
          payload: props.operation,
        })
      }
    >
      {props.operation}
    </button>
  )
}

export default OperationButton
