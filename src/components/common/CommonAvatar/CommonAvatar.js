import { useNavigate } from "react-router-dom";

// Mui components
import { Avatar, Tooltip } from "@mui/material"

// Constants
import { PROFILE_URL, USERS_URL } from "../../../constants";

const CommonAvatar = ({user, tooltipPlacement='top', me=false}) => {
  const navigate = useNavigate()

  const handleClickAvatar = (e, uid) => {
    e.stopPropagation();
    me ? navigate(PROFILE_URL) : navigate(`${USERS_URL}/${uid}`)
  }

  return (
    <Tooltip title={user?.displayName} placement={tooltipPlacement}>
      <Avatar
        alt={user?.displayName}
        src={user?.photoURL}
        onClick={(e) => handleClickAvatar(e, user?.uid)}
        sx={{
          cursor: 'pointer'
        }}
      >
        {user?.displayName}
      </Avatar>
    </Tooltip>
  )
}

export default CommonAvatar