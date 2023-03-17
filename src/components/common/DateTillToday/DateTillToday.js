import { memo } from 'react'

import Tooltip from "@mui/material/Tooltip";

import { format } from 'date-fns'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import { Typography } from '@mui/material';

const DateTillToday = memo(({date}) => {
  return (
    <>
      {date && 
        <Tooltip placement="top" title={date && format(new Date(date.toDate()), "yyy-MM-dd @ HH:MM'")}>
          <Typography
            component='span'
            variant='caption'
            sx={{
              fontStyle: 'italic',
              pr: '10px'
            }}
          >
            {
            formatDistanceToNow(
              new Date(date.seconds * 1000),
              {
                includeSeconds: true,
                addSuffix: true
              })
            }
          </Typography>
        </Tooltip>
      }
    </>
  )
})

export default DateTillToday