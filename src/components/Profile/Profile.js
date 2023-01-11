import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

// MUI components
import Avatar from '@mui/material/Avatar'

const Profile = ({me}) => {


  return (
    <div>
      <Avatar alt={me.displayName} src={me.photoURL}/>
      <div>
        <label>Name:</label> {me.displayName}
      </div>
      <div>
        <label>Country:</label> {me.country}
      </div>
      <div>
        <label>Interests:</label>
        <TagsInput value={me.interests} disabled inputProps={{placeholder: ""}} />
      </div>
    </div>
  )
}

export default Profile