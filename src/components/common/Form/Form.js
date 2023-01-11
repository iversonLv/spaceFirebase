import './Form.css'

// MUI component
import { Box } from "@mui/system"
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// reactJs tagss
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'



const Form = ({title, setEmail, setPassword, handleAction, loading, setBiography, setCountry, setDisplayName, interests, setInterests}) => {
  const handleChange = (tags) => {
    setInterests([...tags])
  }
  return (
    <div className="heading-container">
      <h1>{title}</h1>
      <Box
        component="form"
        sx={{
          '& > :not(style)' : { m :1, width: '50ch'},
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="email" label="Enter the Email" variant="outlined" onChange={e => setEmail(e.target.value)} type="email" />
        <TextField id="password" label="Enter the Password" variant="outlined" onChange={e => setPassword(e.target.value)} type="password" />
        {title === 'Register' && (
          <>
            <TextField id="displayName" label="Enter the name" variant="outlined" onChange={e => setDisplayName(e.target.value)} />
            <TextField id="biography" label="Enter the Biography" variant="outlined" onChange={e => setBiography(e.target.value)} />
            <TextField id="country" label="Enter the Country of residence" variant="outlined" onChange={e => setCountry(e.target.value)} />
            <TagsInput value={interests} onChange={handleChange} inputProps={{placeholder: "Press enter to add interests", className: 'react-tagsinput-input'}} />
          </>
        )}
      </Box>
      <Button variant="contained" onClick={handleAction} disabled={loading}>{title}</Button>
    </div>
  )
}

export default Form