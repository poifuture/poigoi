import React, { PropsWithChildren } from "react"
import {
  List as MuiList,
  Box,
  Paper,
  Container,
  useMediaQuery,
} from "@material-ui/core"
import JaWordCard, { JaWordCardPropsType } from "./JaWordCard"
import { useSpring, animated, useTransition, config } from "react-spring"
import { useGesture } from "react-use-gesture"
import { useTheme } from "@material-ui/styles"
import DebugModule from "debug"
const debug = DebugModule("PoiGoi:WordCard")

export interface WordCardPropsType {
  isTyping: boolean
  JaWordCardProps: Partial<JaWordCardPropsType>
}
export function WordCard(props: PropsWithChildren<WordCardPropsType>) {
  const theme: any = useTheme()
  const mdDown = useMediaQuery(theme.breakpoints.down("xs"))
  const { JaWordCardProps } = props
  const wordKey =
    typeof JaWordCardProps.word !== "undefined"
      ? JaWordCardProps.word.key
      : "あ"
  return (
    <Paper
      style={{
        ...{
          minHeight: mdDown ? "calc(100vh - 200px)" : "calc(100vh - 248px)",
          maxHeight: props.isTyping
            ? "calc(100vh - 140px)"
            : "calc(100vh - 200px)",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <div style={{ overflowY: "auto" }}>
        <Container>
          <JaWordCard key={wordKey} {...props.JaWordCardProps} />
        </Container>
      </div>
      {props.children}
    </Paper>
  )
}

export interface WordCardStackPropsType {
  PreviousWordCard: ReturnType<typeof WordCard>
  CurrentWordCard: ReturnType<typeof WordCard>
  NextWordCard: ReturnType<typeof WordCard>
  onGesturePrevious?: ({ deltaX }: { deltaX: number }) => void
  onGestureNext?: ({ deltaX }: { deltaX: number }) => void
}
export function WordCardStack(props: WordCardStackPropsType) {
  const { PreviousWordCard, CurrentWordCard, NextWordCard } = props
  const [gestureProps, setGestrueProps] = useSpring(() => {
    return { currentX: 0, previousX: -window.innerWidth }
  })
  const bind = useGesture(({ down, delta, direction, velocity }) => {
    const directionX = direction[0] < -0.5 ? -1 : direction[0] > 0.5 ? 1 : 0 // Direction should either point left or right
    const isActionTriggered = !down && velocity > 0.5
    const [deltaX] = delta
    const currentX = deltaX > -20 ? 0 : down ? deltaX : 0
    const previousX =
      deltaX < 20
        ? -window.innerWidth
        : down
        ? deltaX - window.innerWidth
        : -window.innerWidth
    if (isActionTriggered && directionX < 0) {
      debug("onGestureNext", deltaX)
      if (typeof props.onGestureNext !== "undefined") {
        props.onGestureNext({ deltaX })
      }
    }
    if (isActionTriggered && directionX > 0) {
      debug("onGesturePrevious", deltaX)
      if (typeof props.onGesturePrevious !== "undefined") {
        props.onGesturePrevious({ deltaX })
      }
    }
    setGestrueProps({
      currentX,
      previousX,
      config: { friction: 50, tension: down ? 1000 : 400 },
    })
  })
  const transitions = useTransition(CurrentWordCard.key, item => item, {
    from: { opacity: 0.5 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.molasses,
  })
  debug("transitions", transitions)
  return (
    <animated.div
      style={{ position: "relative" }}
      // {...bind()}
    >
      <animated.div
        key={NextWordCard.key ? NextWordCard.key : undefined}
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {NextWordCard}
      </animated.div>
      {transitions.map(({ item, props, key }) => (
        <animated.div
          key={key}
          style={{
            ...props,
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100%",
            // transform: gestureProps.currentX.interpolate(
            //   x => `translate3d(${x}px,0px,0)`
            // ),
          }}
        >
          {CurrentWordCard}
        </animated.div>
      ))}
      {/* <animated.div
        key={CurrentWordCard.key ? CurrentWordCard.key : undefined}
        style={{
          width: "100%",
          height: "100%",
          transform: gestureProps.currentX.interpolate(
            x => `translate3d(${x}px,0px,0)`
          ),
        }}
      >
        {CurrentWordCard}
      </animated.div> */}
      <animated.div
        key={PreviousWordCard.key ? PreviousWordCard.key : undefined}
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          height: "100%",
          transform: gestureProps.previousX.interpolate(
            x => `translate3d(${x}px,0px,0)`
          ),
        }}
      >
        {PreviousWordCard}
      </animated.div>
    </animated.div>
  )
}

export default WordCardStack
