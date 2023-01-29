import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
// MUI component
import { Box } from "@mui/system"
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// reactJs tagss
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

// components
import TextForm from '../common/TextForm/TextForm'
import DndUpload from '../common/DndUpload/DndUpload'

// context
import useAuth from '../../firebase/auth'
import useSpaces from '../../firebase/space'
import { addSpace, updateSpace, getSpaceById} from '../../firebase/firestore'

// helper
import { checkObj } from '../../utils/helper'

// constants
import { CREATE_SPACE_PAGE_TITLE, EDIT_SPACE_PAGE_TITLE, PROFILE_URL } from "../../constants"

const CreateEditSpace = ({ loading, setLoading, pageTitle }) => {
  const { authUser } = useAuth()
  const { fetchSpaces } = useSpaces()
  const navigate = useNavigate()
  const [thunbmail, setThunbmail] = useState()
  const [disabledBtn, setDisabledBtn] = useState(true)
  const [previewPhoto, setPreviewPhoto] = useState('')
  const [spaceField, setSpaceField] = useState({
    title: '',
    overview: '',
    keywords: [],
    prerequisites: []
  })
  
  const params = useParams();

  const handleSpaceField = (e) => setSpaceField({...spaceField, [e.target.name]: e.target.value })
  const handleAction = async (action) => {
    setLoading(true)
    if (action === CREATE_SPACE_PAGE_TITLE) {
      //console.log(spaceField, thunbmail)
      await addSpace(authUser, spaceField, thunbmail)
    } else {
      await updateSpace(spaceField, thunbmail, params.spaceId)
    }
    await fetchSpaces()
    setLoading(false)
    navigate(PROFILE_URL)
  }
  const handlekeywordsChange = (tags) => setSpaceField({...spaceField, keywords: [...tags]})
  const handlePrerequisitesChange = (tags) => setSpaceField({...spaceField, prerequisites: [...tags]})
  
  
  // check form and enable create btn
  useEffect(() => {
    
    if(checkObj(spaceField) || !previewPhoto) {
      return setDisabledBtn(true)
    } 
    setDisabledBtn(false)
  }, [spaceField, previewPhoto]);

  useEffect(() => {
    if(pageTitle === EDIT_SPACE_PAGE_TITLE) {
      
        setLoading(true)
        getSpaceById(params.spaceId, setSpaceField)
        setLoading(false)
        
        
    }
  }, [pageTitle, params.spaceId, setLoading]);

  useEffect(() => {
    if(pageTitle === CREATE_SPACE_PAGE_TITLE) {
      setSpaceField({
        title: '',
        overview: '',
        keywords: [],
        prerequisites: []
      })
      setPreviewPhoto('')
    }

  }, [pageTitle]);

  return (
    <>
    <Typography
          variant="h3"
          gutterBottom
          align='center'
        >
          {pageTitle}
      </Typography>
      <DndUpload setThunbmail={setThunbmail} previewPhoto={previewPhoto} setPreviewPhoto={setPreviewPhoto}/>
      <Box
          component="form"
          autoComplete="off"
        >
        <TextForm
          name='title'
          required={true}
          handleChange={handleSpaceField}
          disabled={loading}
          value={spaceField.title || ''}
        />
        <TextField
          fullWidth
          margin='normal'
          name='overview'            
          label="Overview"
          onChange={handleSpaceField}
          multiline
          rows={4}
          disabled={loading}
          value={spaceField.overview || ''}
        />
      <TagsInput disabled={loading} value={spaceField?.keywords} onChange={handlekeywordsChange} inputProps={{placeholder: "Add keywords", className: 'react-tagsinput-input'}} />
      <TagsInput  disabled={loading} value={spaceField?.prerequisites} onChange={handlePrerequisitesChange} inputProps={{placeholder: "Add prerequisites", className: 'react-tagsinput-input'}} />
        
      <Button
        sx={{
          marginTop: '20px'
        }}
        variant="contained" onClick={() => handleAction(pageTitle)} disabled={loading}>
          {pageTitle === CREATE_SPACE_PAGE_TITLE ? 'Create': 'Edit'}
        </Button>
    </Box>
    </>
  )
}

export default CreateEditSpace