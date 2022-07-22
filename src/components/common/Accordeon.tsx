import react, { FC, useState } from 'react';
import { makeStyles } from "@mui/styles";

type AccordeonType = {
  title: any,
  iconSvg: any,
  initialState: boolean
}
const useStyles = makeStyles(({
  titleWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '40px',
    cursor: 'pointer'
  },
  titleLeft: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  icon: {
    curstor: 'pointer',
    height: '40px',
    width: '40px',
    transition: 'transform 0.3s ease-in',
    '& svg': {
      width: '100%',
      height: '100%'
    },
  },
  iconUp: {
    cursor: 'pointer',
    height: '40px',
    width: '40px',
    transition: 'transform 0.3s ease-in',
    transform: 'rotate(-180deg)',
    '& svg': {
      width: '100%',
      height: '100%'
    },
  },
  content: {
    marginTop: '20px'
  }
}))

const Accordeon: FC<AccordeonType> = ({ title, iconSvg, initialState, children }) => {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState(initialState);

  return (
    <div>
      <div 
        className={classes.titleWrapper} 
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <div className={classes.titleLeft}>
          { title }
        </div>

        <div 
          className={isOpen ? classes.icon : classes.iconUp}
        >
          { iconSvg }
        </div>
      </div>

      { isOpen && <div className={classes.content}>
        { children }
      </div>
      }
    </div>
  )
}

export default Accordeon;