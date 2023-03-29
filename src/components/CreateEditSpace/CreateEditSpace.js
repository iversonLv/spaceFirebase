import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

// MUI component
import {
  Typography,
  TextField,
  Button,
  Grid
} from "@mui/material"


// reactJs tagss
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

// components
import TextForm from '../common/TextForm/TextForm'
import DndUpload from '../common/DndUpload/DndUpload'
import DividerWithTitle from "../common/DividerWithTitle/DividerWithTitle"

// context
import useAuth from '../../firebase/auth'
import useSpaces from '../../firebase/space'
import { addSpace, updateSpace, getEditSpaceById} from '../../firebase/firestore'

// helper
import { checkObj } from '../../utils/helper'

// constants
import { CREATE_SPACE_PAGE_TITLE, EDIT_SPACE_PAGE_TITLE, NO_SUCH_SPACE, PROFILE_URL } from "../../constants"
import JoinLeaveBtn from "../common/JoinLeaveBtn/JoinLeaveBtn"
import SpaceSkeleton from "../common/SpaceSkeleton/SpaceSkeleton"
import BackArrowTitleWithActionBtn from "../common/BackArrowTitleWithActionBtn/BackArrowTitleWithActionBtn";

const CreateEditSpace = ({ loading, setLoading, pageTitle }) => {
  // context
  const { authUser } = useAuth()
  const { fetchSpaces } = useSpaces()
  // hook
  const params = useParams();
  const navigate = useNavigate()
  // state
  const [thumbnail, setThumbnail] = useState()
  const [previewPhoto, setPreviewPhoto] = useState('')
  const [spaceField, setSpaceField] = useState({})
  const [getEditSpaceByIdLoading, setGetEditSpaceByIdLoading] = useState(true)
  
  // if form fields and photo are not set, create btn is disabled
  const disabledBtn = checkObj(spaceField) || !previewPhoto ?  true : false

  // UseEffect
  // If edit page
  useEffect(() => {
    if(pageTitle === EDIT_SPACE_PAGE_TITLE) {
      const unscribe = async() => {
        await getEditSpaceById(params.spaceId, setSpaceField, setPreviewPhoto, setGetEditSpaceByIdLoading)
      }  
      unscribe()
    }
  }, [pageTitle, params.spaceId]);

  // If new page
  useEffect(() => {
    if(pageTitle === CREATE_SPACE_PAGE_TITLE) {
      setGetEditSpaceByIdLoading(false)
      setSpaceField({
        title: '',
        overview: '',
        keywords: [],
        prerequisites: []
      })
      setPreviewPhoto(null)
    }

  }, [pageTitle]);

  // event function

  // forms
  const handleSpaceField = (e) => setSpaceField({...spaceField, [e.target.name]: e.target.value })
  const handlekeywordsChange = (tags) => setSpaceField({...spaceField, keywords: [...tags]})
  const handlePrerequisitesChange = (tags) => setSpaceField({...spaceField, prerequisites: [...tags]})

  // edit/create btn function
  const handleAction = async (action) => {
    setLoading(true)
    if (action === CREATE_SPACE_PAGE_TITLE) {
      await addSpace(authUser, spaceField, thumbnail)
    } else {
      await updateSpace(spaceField, thumbnail, params.spaceId)
    }
    await fetchSpaces()
    setLoading(false)
    navigate(PROFILE_URL)
  }

  return (
    <>
    {getEditSpaceByIdLoading && <SpaceSkeleton />}
    {!!Object.keys(spaceField).length && !getEditSpaceByIdLoading && (
      <>
        <BackArrowTitleWithActionBtn
          title={pageTitle}
        >
          {pageTitle === EDIT_SPACE_PAGE_TITLE && <JoinLeaveBtn space={{id: params.spaceId, author: {uid: authUser.uid}}} isEditPage={true} loadingDisabled={loading}/>}
        </BackArrowTitleWithActionBtn>
        
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} lg={4}>
            <DndUpload
              setThumbnail={setThumbnail}
              previewPhoto={previewPhoto}
              setPreviewPhoto={setPreviewPhoto}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={8}>
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
          
            <DividerWithTitle title='Keywords'/>
            <TagsInput disabled={loading} value={spaceField?.keywords} onChange={handlekeywordsChange} inputProps={{placeholder: "Add keywords", className: 'react-tagsinput-input'}} />
            
            <DividerWithTitle title='Prerequisites'/>
            <TagsInput  disabled={loading} value={spaceField?.prerequisites} onChange={handlePrerequisitesChange} inputProps={{placeholder: "Add prerequisites", className: 'react-tagsinput-input'}} />
              
            <Button
              variant="contained"
              disabled={loading || disabledBtn}
              size='small'
              onClick={() => handleAction(pageTitle)}
            >
              {pageTitle === CREATE_SPACE_PAGE_TITLE ? 'Create': 'Edit'}
            </Button>
          </Grid>
        </Grid>
      </>)}
      {!Object.keys(spaceField).length && !getEditSpaceByIdLoading &&
      <Typography
        variant="h4"
        gutterBottom
        align='center'
        sx={{
          textTransform: 'uppercase'
        }}
      >
        {NO_SUCH_SPACE}
      </Typography>}
    </>
  )
}

export default CreateEditSpace