import { useNavigate } from "react-router-dom";

// Mui components
import { Avatar, Tooltip } from "@mui/material"

// Constants
import { USERS_URL } from "../../../constants";

const CommonAvatar = ({user}) => {
  const navigate = useNavigate()

  const handleClickAvatar = (e, uid) => {
    e.stopPropagation();
    navigate(`${USERS_URL}/${uid}`)
  }

  return (
    <Tooltip title={user?.displayName} placement="top">
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