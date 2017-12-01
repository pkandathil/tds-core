import React from 'react'
import PropTypes from 'prop-types'

import safeRest from '../../utils/safeRest'
import joinClassNames from '../../utils/joinClassNames'
import generateId from '../../utils/generateId'

import Text from '../Typography/Text/Text'
import Box from '../Box/Box'
import ColoredTextProvider from '../Typography/ColoredTextProvider/ColoredTextProvider'
import Flexbox from '../Flexbox/Flexbox'

import styles from './Choice.modules.scss'
import messagingStyles from '../Messaging.modules.scss'

const getId = (id, name, value) => {
  if (id) {
    return generateId(id).identity()
  }

  return generateId(name).postfix(value)
}

const getClassNames = (inputTypeStyles, checked, focus, feedback, disabled) => {
  if (disabled) {
    return checked ? inputTypeStyles.disabledChecked : inputTypeStyles.disabled
  }

  let className
  if (checked) {
    className = inputTypeStyles.checked
  } else if (feedback === 'error') {
    className = styles.error
  } else {
    className = styles.unchecked
  }

  return joinClassNames(className, focus && styles.focused)
}

const renderColoredLabel = (color, content) => (
  <ColoredTextProvider colorClassName={color}>
    <Flexbox direction="row" dangerouslyAddClassName={styles.alignCenter}>
      {content}
    </Flexbox>
  </ColoredTextProvider>
)

const renderLabel = (label, feedback, checked, disabled) => {
  const content = <Text size="medium">{label}</Text>

  if (feedback === 'error' && !checked) {
    return renderColoredLabel(messagingStyles.errorText, content)
  }

  if (disabled) {
    return renderColoredLabel(messagingStyles.disabledText, content)
  }

  return content
}

class Choice extends React.Component {
  state = {
    checked: this.props.checked,
    focus: false,
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.checked !== nextProps.checked) {
      this.setState({
        checked: nextProps.checked,
      })
    }
  }

  onChange = event => {
    const { onChange } = this.props
    this.setState(({ checked }) => ({
      checked: !checked,
    }))

    if (onChange) {
      onChange(event)
    }
  }

  onFocus = event => {
    const { onFocus } = this.props

    this.setState({ focus: true })

    if (onFocus) {
      onFocus(event)
    }
  }

  onBlur = event => {
    const { onBlur } = this.props

    this.setState({ focus: false })

    if (onBlur) {
      onBlur(event)
    }
  }

  render() {
    const { label, name, value, feedback, type, inputTypeStyles, children, ...rest } = this.props

    const choiceId = getId(rest.id, name, value)

    const fakeInputClassNames = joinClassNames(
      type === 'radio' ? styles.fakeRadio : styles.fakeCheckbox,
      getClassNames(inputTypeStyles, this.state.checked, this.state.focus, feedback, rest.disabled)
    )

    return (
      <label data-no-global-styles htmlFor={choiceId}>
        <Box inline between={3} dangerouslyAddClassName={styles.alignCenter}>
          <span className={fakeInputClassNames} data-testid="fake-input">
            <input
              {...safeRest(rest)}
              id={choiceId}
              type={type}
              name={name}
              value={value}
              checked={this.state.checked}
              className={styles.hiddenInput}
              onChange={this.onChange}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              data-no-global-styles
            />

            {children(this.state.checked, rest.disabled)}
          </span>

          {renderLabel(label, feedback, this.state.checked, rest.disabled)}
        </Box>
      </label>
    )
  }
}

Choice.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  checked: PropTypes.bool.isRequired,
  feedback: PropTypes.oneOf(['error']),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  type: PropTypes.oneOf(['checkbox', 'radio']).isRequired,
  inputTypeStyles: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
}

Choice.defaultProps = {
  feedback: undefined,
  onChange: undefined,
  onFocus: undefined,
  onBlur: undefined,
}

export default Choice