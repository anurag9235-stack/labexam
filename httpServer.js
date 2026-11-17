import http from 'http';
import fs from 'fs';

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

const server = http.createServer((req, res) => {

    // Home Route
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end('<h1>Welcome to Online Food Ordering</h1>');
    }

    // GET Foods
    else if (req.url === '/foods' && req.method === 'GET') {
        const availableFoods = foods.filter(
            food => food.availability === true
        );

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify(availableFoods));
    }

    // About Route
    else if (req.url === '/about' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end('<h2>We provide delicious food to customers.</h2>');
    }

    // Menu Route using FS Module
    else if (req.url === '/menu' && req.method === 'GET') {
        fs.readFile('./public/menu.html', 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                return res.end('Unable to read menu file');
            }

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.end(data);
        });
    }

    // POST Add Food
    else if (req.url === '/add-food' && req.method === 'POST') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {

            try {
                const newFood = JSON.parse(body);

                const { id, foodName, category, price, availability } = newFood;

                if (
                    id === undefined ||
                    !foodName ||
                    !category ||
                    typeof price !== 'number' ||
                    price <= 0 ||
                    typeof availability !== 'boolean' ||
                    foods.some(food => food.id === id)
                ) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json'
                    });

                    return res.end(JSON.stringify({
                        message: 'Invalid or missing food details'
                    }));
                }

                foods.push(newFood);

                res.writeHead(201, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    message: 'Food added successfully',
                    food: newFood
                }));

            } catch (error) {

                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    message: 'Invalid JSON'
                }));
            }
        });
    }

    // Invalid Route
    else {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });

        res.end('404 Page Not Found');
    }
});

server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});