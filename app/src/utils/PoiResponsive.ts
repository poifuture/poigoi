export const ToggleEvents = (
  toggleEventHandler: (value?: boolean, event?: string) => void | Promise<void>
) => {
  return {
    onClick: () => toggleEventHandler(true, "onClick"),
    onFocus: () => toggleEventHandler(true, "onFocus"),
    onBlur: () => toggleEventHandler(false, "onBlur"),
    onMouseEnter: () => toggleEventHandler(true, "onMouseEnter"),
    onMouseLeave: () => toggleEventHandler(false, "onMouseLeave"),
    onClose: () => toggleEventHandler(false, "onClose"),
  }
}
