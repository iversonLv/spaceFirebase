
// APP
export const APP_HEADING = 'LSpaces'
export const CREATE_SPACE_PAGE_TITLE = 'Create Space'
export const EDIT_SPACE_PAGE_TITLE = 'Edit Space'

// Like, Dislike are affect some files, so make constants for consistency
export const Like_T = 'like'
export const DisLike_T = 'dislike'

export const TYPE_POST = 'post'
export const TYPE_COMMENT = 'comment'

// URL
export const HOME_URL = '/'
export const PROFILE_URL = '/profile'
export const USERS_URL = '/users'
export const SPACES_URL = '/spaces'
export const SIGN_IN_UP_URL = '/signinup'

// Exteral URL
export const MY_GITHUB_URL = 'https://github.com/iversonLv'
export const PROJECT_GITHUB_URL = 'https://github.com/iversonLv/spaceFirebase'

// header menu
export const loginedNavItem = [
  {'label': 'Profile', 'route': PROFILE_URL}, 
  {'label': 'Create Space', 'route': `${SPACES_URL}/create`}, 
];

export const nonLoginedNavItem = [ 
  {'label': 'Sign in/up', 'route': SIGN_IN_UP_URL}
];

// load more number
// If item more than 3 will show load more btn
// Example, space detail page, bottom related spaces section
export const LOAD_MORE_NUMBER = 3

// message
// Space detail page, bottom related space
export const NO_RELATED_SPACE = 'Current the space hasn\'t any related space yet'
export const NO_POST = 'Current the space hasn\'t any post yet'
// Home page
export const NO_SPACE = 'No spaces currectly'
// Profile page
export const NO_CREATED_SPACE = 'Current user hasn\'t created any space yet'
export const NO_JOINED_SPACE = 'Current user hasn\'t joined any space yet'

// Edit, view a none space with the spaceId
export const NO_SUCH_SPACE = 'Ops, seems the space is not available'
