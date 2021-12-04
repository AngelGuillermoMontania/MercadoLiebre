const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const writeJson = dataBase => fs.writeFileSync(productsFilePath, JSON.stringify(dataBase), 'utf-8')
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', {
			products,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let id = +req.params.id;
		let product = products.find(element => element.id === id)
		res.render('detail', {
			product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const {name, price, category, discount, description} = req.body;

		let lastId = 1;
		products.forEach(element => {
			if(element.id > lastId) {
				lastId = element.id
			}
		});

		let newProduct = {
			id: lastId + 1,
			name,
			price: +price,
			category,
			discount: +discount,
			description,
			image: req.file ? req.file.filename : 'default-img.jpg'
		}

		products.push(newProduct)
		writeJson(products)

		res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		let id = +req.params.id;
		let product = products.find(element => element.id === id);

		res.render('product-edit-form', {
			product,
		})
	},
	// Update - Method to update
	update: (req, res) => {
		let id = +req.params.id;
		const {name, price, category, discount, description} = req.body;
		products.forEach(element => {
			if(element.id === id) {
				element.id = element.id,
				element.name = name,
				element.price = +price,
				element.category = category,
				element.discount = +discount,
				element.description = description
				if(req.file) {
					if(fs.existsSync('./public/images/products/', element.image)) {
						fs.unlinkSync(`./public/images/products/${element.image}`)
					} else {
						console.log('No encuentro img')
					}
					element.image = req.file.filename
				} else {
					element.image = element.image
				}
			}
		})

		writeJson(products)

		res.redirect(`/products/detail/${id}`)
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let id = +req.params.id;
		let newProducts = products.filter(element => element.id !== id);
		var deleteProduct = products.filter(element => element.id === id);
		if(newProducts.length !== products.length) {
			if(fs.existsSync('./public/images/products/', deleteProduct[0].image)) {
				console.log(deleteProduct)
				fs.unlinkSync(`./public/images/products/${deleteProduct[0].image}`)
			} else {
				console.log('No encuentro img')
			};
			writeJson(newProducts)
		} else {
			console.log('No se encontro')
		}

		res.redirect('/products')
	}
};

module.exports = controller;