// MUI component
import TextField from '@mui/material/TextField'

/**
 * @param  {string} name: for id and name for control, 	
 * @param  {string} type: default is text, eg: password, file
 * @param  {boolean} isFullWidth: default is true whether the input full width of the container
 * @param  {function} onChange function
 * @param  {func} props props: whether there is icon
 * @param  {function} onChange function
 * @param  {boolean} required: whether the input is required or not
 * @param  {string} The size of the component: 'medium' | 'small' | string
 * 
 * More detail: https://mui.com/material-ui/react-text-field/
 */
const TextForm = ({name, type='text', isFullWidth = true, handleChange, props, required = false, value, size='medium', sx={}, margin='normal', disabled=false }) => {
  return <TextField

      autoComplete='on'
      value={value}
      fullWidth={isFullWidth}
      required={required}
      disabled={disabled}
      margin={margin}
      id={name}
      name={name}
      label={`Enter the ${name}`}
      type={type}
      variant='outlined'
      onChange={handleChange}
      InputProps={props}
      size={size}
      sx={sx}
  />
}

export default TextForm