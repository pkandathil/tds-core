import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { small, smallFont } from '@tds/shared-typography'

import safeRest from '../../shared/utils/safeRest'

const StyledSmall = styled.small(small, smallFont)

/**
 * Small print, such as copyright and legal text.
 *
 * @version ./package.json
 */
const Small = ({ children, ...rest }) => <StyledSmall {...safeRest(rest)}>{children}</StyledSmall>

Small.propTypes = {
  /**
   * The text.
   */
  children: PropTypes.string.isRequired,
}

export default Small
