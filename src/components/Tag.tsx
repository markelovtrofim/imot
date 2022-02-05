import React from 'react';
import PropTypes from 'prop-types';
import MaterialChip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';

const Chip = (props: any) => {
  const StyledChip = withStyles({
    root: {
      'cursor': "pointer",
      'borderRadius': '5px',
      'margin': '0 0 15px 10px',
      'border': `1px solid ${props.backgroundColor}`,
      'color': props.color,
      'padding': '0',
      'height': '26px',
      'backgroundColor': `${props.backgroundColor} !important`,
      '&:hover': {
        borderColor: props.hover,
        backgroundColor: props.color,
      },
    },
    outlined: {
      color: props.color,
      border: `1px solid ${props.color}`,
      backgroundColor: `transparent !important`,
    },
    icon: {
      color: props.variant === 'outlined' ? props.color : 'white',
    },
    deleteIcon: {
      color: props.variant === 'outlined' ? props.color : 'white',
    },
  })(MaterialChip);

  return <StyledChip {...props} />;
};

Chip.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.oneOf(['regular, outlined']),
};

export default Chip;