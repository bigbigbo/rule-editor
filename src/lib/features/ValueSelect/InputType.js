import React, { useState, useRef, useEffect } from 'react'

const InputType = (props) => {
  const { value, onChange } = props;
  const [focus, setFocus] = useState(true)
  const ref = useRef();

  useEffect(() => {
    if (focus) {
      ref.current.focus()
    }
  }, [focus])


  const handleFocus = (status) => {
    setFocus(status)
  }

  const handleEnter = ({ keyCode }) => {
    if (keyCode === 13) {
      setFocus(false)
    }
  }

  return focus ?
    <input ref={ref} type="text" value={value} onChange={onChange} onBlur={() => handleFocus(false)}
      style={{ height: 18, width: 100, outline: 'none', border: '1px solid #c9c9c9' }} onKeyDown={handleEnter} />
    :
    <span onClick={() => handleFocus(true)} style={{ color: '#b45f04' }}>{value || '请输入值'}</span>
}

export default InputType
