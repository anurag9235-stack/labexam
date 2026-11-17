import express from 'express';

const app = express();

app.use(express.json());

// Sample Food Data
let foods = [
    {
        id: 1,
        foodName: "Pizza",
        category: "Fast Food",
        price: 250,
        availability: true
    },
    {
        id: 2,
        foodName: "Burger",
        category: "Fast Food",
        price: 120,
        availability: true
    },
    {
        id: 3,
        foodName: "Ice Cream",
        category: "Dessert",
        price: 80,
        availability: false
    }
];

// GET All Foods
app.get('/foods', (req, res) => {
    res.status(200).json(foods);
});

// GET Food By ID
app.get('/foods/:id', (req, res) => {

    const id = Number(req.params.id);

    const food = foods.find(item => item.id === id);

    if (!food) {
        return res.status(404).json({
            message: 'Food item not found'
        });
    }

    res.status(200).json(food);
});

// POST Add New Food
app.post('/foods', (req, res) => {

    const { id, foodName, category, price, availability } = req.body;

    if (
        id === undefined ||
        !foodName ||
        !category ||
        typeof price !== 'number' ||
        price <= 0 ||
        typeof availability !== 'boolean'
    ) {
        return res.status(400).json({
            message: 'Invalid or missing food details'
        });
    }

    if (foods.some(food => food.id === id)) {
        return res.status(400).json({
            message: 'Food ID already exists'
        });
    }

    const newFood = {
        id,
        foodName,
        category,
        price,
        availability
    };

    foods.push(newFood);

    res.status(201).json({
        message: 'Food item added successfully',
        food: newFood
    });
});

// PUT Update Food
app.put('/foods/:id', (req, res) => {

    const id = Number(req.params.id);

    const food = foods.find(item => item.id === id);

    if (!food) {
        return res.status(404).json({
            message: 'Food item not found'
        });
    }

    const { foodName, category, price, availability } = req.body;

    if (
        (foodName !== undefined && !foodName) ||
        (category !== undefined && !category) ||
        (price !== undefined &&
            (typeof price !== 'number' || price <= 0)) ||
        (availability !== undefined &&
            typeof availability !== 'boolean')
    ) {
        return res.status(400).json({
            message: 'Invalid food details'
        });
    }

    if (foodName !== undefined) food.foodName = foodName;
    if (category !== undefined) food.category = category;
    if (price !== undefined) food.price = price;
    if (availability !== undefined) food.availability = availability;

    res.status(200).json({
        message: 'Food updated successfully',
        food
    });
});

// DELETE Food
app.delete('/foods/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = foods.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Food item not found'
        });
    }

    const deletedFood = foods.splice(index, 1);

    res.status(200).json({
        message: 'Food deleted successfully',
        food: deletedFood[0]
    });
});

// Invalid Route
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

// Start Server
app.listen(4000, () => {
    console.log('Express Server running at http://localhost:4000');
});