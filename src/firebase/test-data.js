import { collection, Timestamp, doc, setDoc } from "firebase/firestore";
import { db, SPACES_COLLECTION } from './firebase-config'

  // for space
  const keywords = ['coding', 'art', 'swimming', 'running', 'video game', 'writing' , 'shopping' , 'basketball']
  const prerequisites = [
    'Darkness is also a prerequisite for the movies, and unmade ones haunt Adam Brewster; sections of the book are delivered in script form.',
    'That\'s not a prerequisite to engage what already belongs to people, and that is their Jewish heritage.',
    'Online safety for our children and young people needs to be a prerequisite, not an afterthought.',
    'Future greatness does not always inspire popularity. Coolness, in the high-school or hip sense of the word, is not a prerequisite for leadership.',
    'opposition to the totalitarian threat was the prerequisite for membership in American liberalism because communism was the defining moral challenge of the age.',
    'But old-school Andy lacks a skill that may soon be a prerequisite for 21st-century detective work: knowing how to glean secrets from a suspect\'s hard drive' ,
    'Prerequisite is partly based on requirere, the Latin verb meaning "to need or require".' ,
    'So a prerequisite can be anything that must be accomplished or acquired before something else can be done',
    'Possessing a valid credit card is a prerequisite for renting a car',
    'A physical exam may be a prerequisite for receiving a life-insurance policy',
    'And successful completion of an introductory course is often a prerequisite for enrolling in a higher-level course.'
  ]
  const titleOverview = [
    {
      title: "The Future of AI: Opportunities and Challenges",
      overview: 'This overview will discuss the current state of artificial intelligence (AI) and its potential future developments. It will explore the ways in which AI is already being used in various industries, as well as the potential benefits and drawbacks of increased AI adoption.'
    },
    {
      title: "The Rise of Remote Work: How Technology is Changing the Way We Work",
      overview: 'This overview will examine the trend of remote work and the ways in which technology has enabled this shift. It will discuss the benefits and challenges of remote work, as well as its potential impact on the future of the workforce.'
    },
    {
      title: "The Impact of Climate Change on Agriculture",
      overview: 'This overview will explore the ways in which climate change is affecting agriculture, including changes in temperature, precipitation, and weather patterns. It will discuss the potential impacts of these changes on crop yields, food security, and rural livelihoods.'
    },
    {
      title: "The Role of Artificial Intelligence in Healthcare",
      overview: 'This overview will examine the ways in which AI is being used in the healthcare industry, including in areas such as diagnosis, treatment planning, and drug development. It will also discuss the potential benefits and drawbacks of increased AI adoption in healthcare.'
    },
    {
      title: "The Importance of Cybersecurity in the Digital Age",
      overview: 'This overview will delve into the ethical considerations surrounding the development and use of AI. It will discuss topics such as bias in algorithms, privacy concerns, and the impact of AI on jobs.'
    },
    {
      title: "Exploring the Ethics of Artificial Intelligence",
      overview: 'This overview will examine the current state and future potential of electric cars and self-driving cars. It will discuss the benefits of these technologies, such as reduced emissions and increased safety, as well as the challenges that must be overcome in order to fully realize their potential.'
    },
    {
      title: "The Future of Transportation: Electric Cars and Self-Driving Cars",
      overview: 'This overview will discuss the ways in which big data is being used by companies to make more informed decisions. It will examine the potential benefits and drawbacks of using big data, as well as the challenges that must be overcome in order to effectively utilize this information.'
    },
    {
      title: "The Role of Big Data in Business Decision Making",
      overview: 'This overview will explore the ways in which social media is impacting society, including the spread of information, the formation of communities, and the potential for misinformation. It will also discuss the potential downsides of increased social media use, such as addiction and the erosion of privacy.'
    },
    {
      title: "The Impact of Social Media on Society",
      overview: 'This overview will discuss the current state of artificial intelligence (AI) and its potential future developments. It will explore the ways in which AI is already being used in various industries, as well as the potential benefits and drawbacks of increased AI adoption.'
    },
    {
      title: "The Future of Education: How Technology is Changing the Classroom",
      overview: 'This overview will examine the ways in which technology is impacting education, including the use of online resources, virtual reality, and artificial intelligence. It will discuss the potential benefits and drawbacks of these technologies, and the impact they may have on the future of education.'
    }
  ]
  const imageList = [
    'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=248&fit=crop&auto=format',
    'https://mui.com/static/images/cards/contemplative-reptile.jpg',
    'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c?w=248&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?w=248&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=248&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=248&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1?w=248&fit=crop&auto=format'
  ]
  const generateRandomMutiple = (data) => {
    let finall = []
    let randomLength = Math.floor(Math.random() * data.length)
    for(let i = 0; i < randomLength + 1; i++) {
      const get1 = data[randomLength]
      finall.push(get1)
      data = data.filter(k => k !== get1)
      randomLength = Math.floor(Math.random() * data.length)
    }
    return finall
  }
  const generateOne = (data) => {
    return data[Math.floor(Math.random() * data.length)]
  }
  const generateDate = (startDate, endDate) => {
    var start = new Date(startDate).getTime();
    var end = new Date(endDate).getTime();
    var randomMilliseconds = Math.floor(Math.random() * (end - start)) + start;
    return new Date(randomMilliseconds);
  }
  export const addSpaces = async(num) => {
    // const docRef = collection(db, SPACES_COLLECTION);
    // Add a new document with a generated id.
    for (let i = 0; i < num; i++) {
      console.log(i)
      const newDocRef = doc(collection(db, SPACES_COLLECTION));
      await setDoc(newDocRef, {
        createdOn: new Date(),
        updatedOn: Timestamp.fromDate(generateDate('2020-01-01', '2023-01-01')),
        id: newDocRef.id,
        bucket: '',

        activeUsers: [],
        activeUsersId: [],
        numOfMembers: 0,
        postsId: [],
        prerequisites: generateRandomMutiple(prerequisites),
        keywords: generateRandomMutiple(keywords),
        ...generateOne(titleOverview)
      })
    }
  }