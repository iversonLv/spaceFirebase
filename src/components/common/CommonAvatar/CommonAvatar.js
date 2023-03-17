import { useNavigate } from "react-router-dom";

// Mui components
import { Avatar, Tooltip } from "@mui/material"

// Constants
import { PROFILE_URL, USERS_URL } from "../../../constants";
/**
 * @param  {object} user: props from user data
 * @param  {string} tooltipPlacement: toptip position, default is top
 * @param  {boolean} me: whether login user, if yes, click the avatar will go to my profile otherwise to user profile, default is false
 * @param  {object} sx={} : for compnoent material sx style
 */
const CommonAvatar = ({user, tooltipPlacement='top', me=false, sx={}}) => {
  const navigate = useNavigate()

  const handleClickAvatar = (e, uid) => {
    // As the avatar sometimes locates at cards which card will direct to detail page, so need to stop the propagation()
    e.stopPropagation();
    // if login user avatar, click it will direct to login profile
    me ? navigate(PROFILE_URL) : navigate(`${USERS_URL}/${uid}`)
  }

  // if no avatar, will show the displayName first char
  // Example: Ben Join, will show 'B'
  const showDisplayNameFirstChar = user?.displayName.charAt()
  return (
    <Tooltip title={user?.displayName} placement={tooltipPlacement}>
      <Avatar
        alt={user?.displayName}
        src={user?.photoURL}
        onClick={(e) => handleClickAvatar(e, user?.uid)}
        sx={{
          ...sx,
          cursor: 'pointer'
        }}
      >
        {showDisplayNameFirstChar}
      </Avatar>
    </Tooltip>
  )
}

export default CommonAvatar