import React, { PropsWithChildren, useState } from "react"
import {
  List as MuiList,
  Box,
  Paper,
  Container,
  useMediaQuery,
} from "@material-ui/core"
import JaWordCard, { JaWordCardPropsType } from "./JaWordCard"
import {
  useSpring,
  animated,
  useTransition,
  config,
  interpolate,
} from "react-spring"
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
  const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1280
  const { PreviousWordCard, CurrentWordCard, NextWordCard } = props
  const [gestureStopX, setGestureStopX] = useState(0)
  const [gestureProps, setGestrueProps] = useSpring(() => {
    return { currentX: 0, previousX: -windowWidth }
  })
  let isGestureReseted = false
  const resetGestureProps = (stopX: number) => {
    setGestureStopX(stopX)
    setGestrueProps({
      currentX: 0,
      previousX: -windowWidth,
      config: { duration: 0 },
    })
    isGestureReseted = true
  }
  const bindGesture = useGesture(({ down, delta, direction, velocity }) => {
    const directionX = direction[0] < -0.5 ? -1 : direction[0] > 0.5 ? 1 : 0 // Direction should either point left or right
    const isActionTriggered = !down && velocity > 0.2
    const [deltaX] = delta
    const currentX = deltaX > -20 ? 0 : down ? deltaX : 0
    const previousX =
      deltaX < 20 ? -windowWidth : down ? deltaX - windowWidth : -windowWidth
    if (isActionTriggered && directionX < 0) {
      debug("onGestureNext", deltaX)
      if (typeof props.onGestureNext !== "undefined") {
        resetGestureProps(deltaX)
        props.onGestureNext({ deltaX })
      }
    }
    if (isActionTriggered && directionX > 0) {
      debug("onGesturePrevious", deltaX)
      if (typeof props.onGesturePrevious !== "undefined") {
        resetGestureProps(deltaX)
        props.onGesturePrevious({ deltaX })
      }
    }
    if (!isGestureReseted) {
      setGestrueProps({
        currentX,
        previousX,
        config: { friction: 50, tension: down ? 1000 : 400 },
      })
    }
  })
  const currentWordCardTransitions = useTransition(
    CurrentWordCard,
    item => item.key || "あ",
    {
      from: { opacity: 0.9, transitionX: 0, zIndex: 0 },
      enter: { opacity: 1, transitionX: 0, zIndex: 0 },
      leave: { opacity: 0, transitionX: -windowWidth, zIndex: 100 },
      config: { duration: 400 },
      transitionX: 0,
      opacity: 1,
      zIndex: 0,
    }
  )
  debug("transitions", currentWordCardTransitions)
  return (
    <animated.div style={{ position: "relative" }} {...bindGesture()}>
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
      {currentWordCardTransitions.map(({ item, props, key }) => {
        debug("transition props", item.key, props, key)
        return (
          <animated.div
            key={key}
            style={{
              zIndex: props.zIndex,
              opacity: props.opacity,
              position: "absolute",
              top: 0,
              width: "100%",
              height: "100%",
              transform: interpolate(
                [gestureProps.currentX, props.transitionX],
                (gestureX, transitionX) => {
                  const translate = transitionX
                    ? `translate3d(${transitionX + gestureStopX}px,0px,0px)`
                    : `translate3d(${gestureX}px,0px,0px)`
                  debug("translate", key, translate)
                  return translate
                }
              ),
            }}
          >
            {item}
          </animated.div>
        )
      })}
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
