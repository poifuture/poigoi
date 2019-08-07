export const ToggleEvents = (
  toggleEventHandler: (value?: boolean) => void | Promise<void>
) => {
  return {
    // onClick: () => toggleEventHandler(),
    onFocus: () => toggleEventHandler(true),
    onBlur: () => toggleEventHandler(false),
    onMouseEnter: () => toggleEventHandler(true),
    onMouseLeave: () => toggleEventHandler(false),
    onClose: () => toggleEventHandler(false),
  }
}
