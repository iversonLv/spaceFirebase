# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

### Routes

/
/login
/register
/profile
/users/:uid
/spaces:/:spaceId
/createLearningSpace

### Important

You need to replace/create a .env file with below data of firebaseConfig with yours
| Variable key                       | Variable value    | How could I find them                                                                                                                                                                                                   |
|------------------------------------|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| REACT_APP_FIREBASE_BUCKET_URL      | BUCKET_URL        | Go to your firebase console, check Build -> storage, there is a URL at top table starts with URL like `gs://api-project-xxxxxx.appspot.com`                                                                                   |
| REACT_APP_FIREBASE_APIKEY          | apiKey            | Go to your firebase console, top left there is setting icon right of the title 'Project Overview', click it and select 'Project settings'-> General tab -> Your apps -> SDK setup and configuration -> Select npm radio |
| REACT_APP_FIREBASE_AUTHDOMAIN      | authDomain        |                                                                                                                                                                                                                         |
| REACT_APP_FIREBASE_PROJECTID       | projectId         |                                                                                                                                                                                                                         |
| REACT_APP_FIREBASE_STORAGEBUCKET   | storageBucket     |                                                                                                                                                                                                                         |
| REACT_APP_FIREBASE_MESSAGESENDERID | messagingSenderId |                                                                                                                                                                                                                         |
| REACT_APP_FIREBASE_APPID           | appId             |                                                                                                                                                                                                                         |

You need enable your firebase application `Authentication -> Sign-in methon -> Email/Password`

You need to remove `: if false;` of your firebase app `Firestore Database -> Rules`
As follows:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write
    }
  }
}
```

You might need to build the index of your firebase app `Firestore Database -> Indexs` or console will show error to direct you to your app to enable the indexs  

You need to remove `: if false;` of your firebase app `Storage -> Rules`

```text
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write
    }
  }
}
```

### Route, URL

As URL might set many files, so I used constants for route URL in order to aviod DRY  
All route URLs are set at `constants.js`

[x] same router /spaces/:spaceId not load  
[x] form validation for login, register, create space  
[70%] split the component smaller  
[x] markdown post, comment, create space  
[x] like dislike  
[x] login, register auth code move to firebase  
[] test-data for user, posts, comments  
[x] create space by login use  
[x] join will duplicated, update  
[x] SpaceCard loading skeleton  
[] modal for leave  
[x] snackbar for leave/join message  
[x] edit space, thumbnail not fetch yet(V3), switch to create space, data not reset yet  
[x] after create switch to profile page  
[x] Updated firebase default array method rather than javascript push/filter  
[x] Home page, leave/join not dynamic update, move the number into avatar group  
[x] filter keywords, navigate back home, won't reset  
[] Delete post/comment: TODO, the related data should be removed  
[90%] Edit post/comment, page can't scroll  
[] Loading look buggy  
[x] click snackbar for leave/join will direct to detail page  
[x] CommonAvatar for all tooltip+avatar except profile top avatar  
[x] xxx ago with date-fns/formatDistanceToNow  
[x] Add avatar at header  
[x] Use firebase UI for login (V3) and refactor existing Form

Home page and space detail page are for all users to view
If non login, some button will change to disabled or show `SIGN UP to xxx`  
