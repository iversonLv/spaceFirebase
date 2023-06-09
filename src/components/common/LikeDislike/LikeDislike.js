import { useState, useEffect, memo } from "react";

// firebase
import useAuth from "../../../firebase/auth";
import { addLikeDislike, getUserLikeDislikeState, getLikeCounts } from "../../../firebase/firestore";

// Mui component
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip
} from "@mui/material"

// Mui icons
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { DisLike_T, Like_T } from "../../../constants";

const LikeDislike = memo(({id, type}) => {
  // Context
  const { authUser } = useAuth()
  // State
  const [likeDislike, setLikeDislike] = useState("")
  const [likeCount, setLikeCount] = useState()
  // Effect
  useEffect(() => {
    let subscribe = true
    const fetchUserLikeDislikeState = async() => {
      if (subscribe) {
        await getUserLikeDislikeState(type, id, authUser.uid, setLikeDislike)
      }
    }
    fetchUserLikeDislikeState()
    return () => subscribe = false
    // fetchUserLikeDislikeState()
  }, [authUser.uid, id, type]);

  useEffect(() => {
    let subscribe = true
    const fetchLikeCounts = async() => {
      if (subscribe) {
        await getLikeCounts(type, id, setLikeCount)
      }
    }
    fetchLikeCounts()
    return () => subscribe = false
  }, [id, type]);
  
  // Event function
    // why not use onChange but onClick
  // Because it need be able to reset both state
  const handleLikeDislike = async(e, id) => {
    try {
      if (e.target.value === likeDislike) {
        setLikeDislike('');
        await addLikeDislike(type, '', id, authUser.uid)
        await getLikeCounts(type, id, setLikeCount)
      } else {
        setLikeDislike(e.target.value);
        await addLikeDislike(type, e.target.value, id, authUser.uid)
        await getLikeCounts(type, id, setLikeCount)
      }
    }
    catch(error) {
      console.log(error)
    }
  };
  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={likeDislike}
        onClick={(e) => handleLikeDislike(e, id)}
        sx={{
          flexDirection: 'row'
        }}
      >
        <FormControlLabel
          value={Like_T}
          control={
            <Tooltip title={Like_T}>
              <Radio
                icon={<ThumbUpOffAltIcon />}
                checkedIcon={<ThumbUpAltIcon />}
              />
            </Tooltip>
          }
          label={likeCount}
        />
        <FormControlLabel
          value={DisLike_T}
          control={
            <Tooltip title={DisLike_T}>
              <Radio
                icon={<ThumbDownOffAltIcon />}
                checkedIcon={<ThumbDownAltIcon />}
              />
            </Tooltip>
          }
          label=""
        />
      </RadioGroup>
    </FormControl>
  )
})

export default LikeDislike