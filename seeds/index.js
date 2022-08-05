const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => (console.log("MongoDB Connected")))
.catch(err => (console.log(err)))

const randomName = () => `${descriptors[Math.floor(Math.random() * descriptors.length)]} ${places[Math.floor(Math.random() * places.length)]}`

const seedDB = async () => {
    await Campground.deleteMany({})
    for(let i = 0; i < 300; i++)
    {
        const randNo = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 50) + 10
        const c = new Campground({
            title: randomName(),
            price,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, facere? Soluta sit saepe quasi eos numquam ab! Debitis, consequatur esse sed at explicabo necessitatibus saepe pariatur aspernatur, eos eum repellat!',
            location: `${ cities[randNo].city }, ${ cities[randNo].state }`,
            geometry: {
                type:'Point',
                coordinates: [cities[randNo].longitude, cities[randNo].latitude]
            },
            author: '61101f5d010e4d12d0aef4f3',
            images: [
                {
                    path: 'https://res.cloudinary.com/dka6w0h3v/image/upload/v1628794426/YelpCamp/l39qnpwmxgtbqcznfzzq.jpg',
                    filename: 'YelpCamp/l39qnpwmxgtbqcznfzzq'
                },
                {
                    path: 'https://res.cloudinary.com/dka6w0h3v/image/upload/v1628792032/YelpCamp/rqkfkdfynoogbf1hjwhm.jpg',
                    filename: 'YelpCamp/l39qnpwmxgtbqcznfzzq'
                }
            ]
        })
        await c.save()
    }
}

seedDB().then(() => (mongoose.connection.close()))  //No need to stay connected through seed file