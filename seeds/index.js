const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});
const sample = data => data[Math.floor(Math.random() * data.length)];
const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20 + 10);
		const camp = new Campground({
			author: '6028ab1e08d9e736b8444080',
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			geometry: {
				"type": "Point",
				"coordinates": [72.83333, 18.96667]
			},
			images: [
				{
					url: 'https://res.cloudinary.com/rbrbrb/image/upload/v1613726994/Yelp%20Camp/m319fyrjmdt6apctxytw.jpg',
					filename: 'Yelp Camp/m319fyrjmdt6apctxytw'
				},
				{
					url: 'https://res.cloudinary.com/rbrbrb/image/upload/v1613727000/Yelp%20Camp/c7aazcsizfgc90beskzd.jpg',
					filename: 'Yelp Camp/c7aazcsizfgc90beskzd'
				},
				{
					url: 'https://res.cloudinary.com/rbrbrb/image/upload/v1613727010/Yelp%20Camp/jffirlacmwfm8taxzsws.jpg',
					filename: 'Yelp Camp/jffirlacmwfm8taxzsws'
				}
			],
			description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita voluptas atque repellendus explicabo harum earum consectetur dolor inventore pariatur quidem odit, omnis modi quas! Ad commodi quaerat fuga laborum omnis?',
			price
		})
		await camp.save();
	}
}
seedDB().then(() => {
	mongoose.connection.close();
})