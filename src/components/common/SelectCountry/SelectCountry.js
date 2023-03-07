import { useMemo } from "react";
import countryList from "react-select-country-list";

// Mui components
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";

const SelectCountry = ({setCountry, country}) => {
  const options = useMemo(() => countryList().getData(), []);
  const handleChange = (e, newValue) => {
    e.preventDefault();
    
    setCountry(newValue)
  }
  return (
    <Autocomplete
      disableClearable
      disablePortal
      size='small'
      id="country"
      name="country"
      options={options}
      value={!country?.value ? null : country}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      onChange={(e, newValue) => handleChange(e, newValue)}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.value.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.value.toLowerCase()}.png 2x`}
            alt=""
          />
          {option.label} ({option.value})
        </Box>
      )}
      renderInput={(params) => (
        <TextField {...params}
          label="Select your country" 
          fullWidth
          margin="normal"
        />
      )}
    />
  )
}

export default SelectCountry