import React, { useState, useEffect, useRef, useCallback } from 'react'

// https://github.com/gaearon/overreacted.io/blob/master/src/pages/making-setinterval-declarative-with-react-hooks/index.md
function useInterval(callback: Function, delay: number | null) {
  const savedCallback = useRef<any>()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

const inputIsValid = (str: any) => {
  return !isNaN(str) && Number.isInteger(parseFloat(str)) && str !== Infinity && str >= 1
}

const INVALID_INPUT_MESSAGE = 'must be an integer greater than or equal 1'

type Props = {
  initialRedDuration?: number
  initialYellowDuration?: number
  initialGreenDuration?: number
}

enum LightState {
  GREEN,
  YELLOW,
  RED,
}

const TrafficLight = (props: Props) => {
  const { initialRedDuration = 1, initialYellowDuration = 1, initialGreenDuration = 1 } = props

  const [redDuration, redDurationSet] = useState<number>(Math.round(initialRedDuration))
  const [yellowDuration, yellowDurationSet] = useState<number>(Math.round(initialYellowDuration))
  const [greenDuration, greenDurationSet] = useState<number>(Math.round(initialGreenDuration))

  const [inputRedDuration, inputRedDurationSet] = useState<string>(initialRedDuration.toString())
  const [inputYellowDuration, inputYellowDurationSet] = useState<string>(initialYellowDuration.toString())
  const [inputGreenDuration, inputGreenDurationSet] = useState<string>(initialGreenDuration.toString())

  const [tick, tickSet] = useState<number>(initialGreenDuration)
  const [lightState, lightStateSet] = useState<LightState>(LightState.GREEN)

  const [isPause, isPauseSet] = useState<boolean>(false)

  const changeLight = useCallback(() => {
    switch (lightState) {
      case LightState.GREEN:
        lightStateSet(LightState.YELLOW)
        tickSet(yellowDuration)
        return
      case LightState.YELLOW:
        lightStateSet(LightState.RED)
        tickSet(redDuration)
        return
      case LightState.RED:
        lightStateSet(LightState.GREEN)
        tickSet(greenDuration)
        return
    }
  }, [lightState, yellowDuration, redDuration, greenDuration])

  useInterval(
    () => {
      if (tick - 1 <= 0) {
        changeLight()
      } else {
        tickSet(tick - 1)
      }
    },
    isPause ? null : 1000
  )

  let timerColorClass
  switch (lightState) {
    case LightState.GREEN:
      timerColorClass = 'text-green'
      break
    case LightState.YELLOW:
      timerColorClass = 'text-yellow'
      break
    case LightState.RED:
      timerColorClass = 'text-red'
      break
  }

  let tickStr
  if (isPause) {
    tickStr = '---'
  } else {
    tickStr = tick.toString()
    if (tickStr.length === 1) {
      tickStr = `00${tickStr}`
    } else if (tickStr.length === 2) {
      tickStr = `0${tickStr}`
    }
  }

  return (
    <div className="d-flex m-0-5">
      <div className="d-flex flex-column cmt-0-5 p-0-5 bg-black text-white">
        <div>Red duration:</div>
        <input value={inputRedDuration} onChange={(e) => inputRedDurationSet(e.currentTarget.value)} />
        <div>Yellow duration:</div>
        <input value={inputYellowDuration} onChange={(e) => inputYellowDurationSet(e.currentTarget.value)} />
        <div>Green duration:</div>
        <input value={inputGreenDuration} onChange={(e) => inputGreenDurationSet(e.currentTarget.value)} />

        <div className="d-flex cml-0-5">
          <button
            onClick={() => {
              const errors = []
              if (!inputIsValid(inputRedDuration)) {
                errors.push(`Red duration ${INVALID_INPUT_MESSAGE}`)
              }
              if (!inputIsValid(inputYellowDuration)) {
                errors.push(`Yellow duration ${INVALID_INPUT_MESSAGE}`)
              }
              if (!inputIsValid(inputGreenDuration)) {
                errors.push(`Green duration ${INVALID_INPUT_MESSAGE}`)
              }
              if (errors.length > 0) {
                alert(errors.join('\n'))
              } else {
                redDurationSet(Math.round(parseFloat(inputRedDuration)))
                yellowDurationSet(Math.round(parseFloat(inputYellowDuration)))
                greenDurationSet(Math.round(parseFloat(inputGreenDuration)))
              }
            }}>
            SET
          </button>
          <button
            onClick={() => {
              isPauseSet(!isPause)
            }}>
            {isPause ? 'PLAY' : 'PAUSE'}
          </button>
          <button
            onClick={() => {
              redDurationSet(Math.round(initialRedDuration))
              yellowDurationSet(Math.round(initialYellowDuration))
              greenDurationSet(Math.round(initialGreenDuration))
            }}>
            RESET
          </button>
        </div>
        <div className="d-flex cml-0-5">
          <button disabled={!isPause} onClick={changeLight}>
            CHANGE PAUSED
          </button>
          <button
            disabled={!isPause}
            onClick={() => {
              isPauseSet(false)
              changeLight()
            }}>
            CHANGE PLAY
          </button>
        </div>
      </div>
      <div className="d-flex flex-column align-items-center cmt-0-5 p-0-5 bg-black">
        <div className={`timer ${timerColorClass}`}>{tickStr}</div>
        <div className={`circle p-1-5 light-red ${lightState !== LightState.RED ? 'no-light' : ''}`}></div>
        <div className={`circle p-1-5 light-yellow ${lightState !== LightState.YELLOW ? 'no-light' : ''}`}></div>
        <div className={`circle p-1-5 light-green ${lightState !== LightState.GREEN ? 'no-light' : ''}`}></div>
      </div>
    </div>
  )
}

export default TrafficLight
