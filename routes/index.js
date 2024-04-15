var express = require('express');
var router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


router.get('/communication/all', async function (req, res) {
    const pool = req.app.get('pool');
    try {
        const { user_id } = req.query;
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM communications WHERE seller_id=($1) OR customer_id=($1)', [user_id]);
        const forSend = result.rows;
        client.release();
        res.json(forSend);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Error getting');
    }
});
router.get('/communication/messages', async function (req, res) {
    const pool = req.app.get('pool');
    try {
        const { user_id, communication_id } = req.query;
        const client = await pool.connect();
        const result = await client.query('SELECT body FROM messages JOIN communications ON messages.communication_id = communications.id WHERE (seller_id = $1 OR customer_id = $1) AND communication_id = $2', [user_id,communication_id]);
        const forSend = result.rows;
        client.release();
        res.json(forSend);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Error getting');
    }
});
router.post('/message', async (req, res) => {
    const pool = req.app.get('pool');
    console.log(req.body);
    try {
        const { user_id,communication_id,body,creationdate } = req.query;

        const client = await pool.connect();
        const result = await client.query('INSERT INTO messages (user_id,communication_id,body,creationdate) VALUES ($1,$2,$3,$4)', [user_id, communication_id, body, creationdate]);

        client.release();
        res.status(201).json(result.rows[0]);
        console.log('posted new');

    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error posting');
    }
});
router.delete('/communication', async (req, res) => {
    const pool = req.app.get('pool');
    try {
        const { id } = req.query;

        const client = await pool.connect();
        const result = await client.query('DELETE FROM communications WHERE id = $1', [id]);

        client.release();
        if (result.rowCount === 1) {
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Resource not found.' });
        }

    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error deleting');
    }
});
router.get('/product', async function (req, res, next) {
    const pool = req.app.get('pool');
    try {
        const { id } = req.query;
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM products WHERE id=$1', [id]);
        const users = result.rows;
        client.release();
        res.json(users);
        console.log("id: ", id);
        console.log("result: ", result);
        console.log("users: ", users);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error getting');
    }
});
router.post('/product', async (req, res) => {
    const pool = req.app.get('pool');
    console.log(req.body);
    try {
        const { user_id,category_id,name,address,price,creationdate,body } = req.query;

        const client = await pool.connect();
        const result = await client.query('INSERT INTO products (user_id, category_id, name,address,price,creationdate,body) VALUES ($1,$2,$3,$4,$5,$6,$7)', [user_id, category_id, name, address, price, creationdate,body]);

        client.release();
        res.status(201).json(result.rows[0]);
        console.log('posted new')

    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error posting');
    }
});
router.put('/product', async (req, res) => {
    const pool = req.app.get('pool');
    try {
        const { id, name } = req.query;

        const client = await pool.connect();
        const result = await client.query('UPDATE products SET name=$1 WHERE id=$2', [name, id]);

        client.release();
        if (result.rowCount === 1) {
            res.status(200).json({ message: 'Resource updated successfully.' });
        } else {
            res.status(404).json({ error: 'Resource not found.' });
        }

    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error putting');
    }
});
router.put('/product', async (req, res) => {
    const pool = req.app.get('pool');
    try {
        const { id, price } = req.query;

        const client = await pool.connect();
        const result = await client.query('UPDATE products SET price=$2 WHERE id=$1', [id, price]);

        client.release();
        if (result.rowCount === 1) {
            res.status(200).json({ message: 'Resource updated successfully.' });
        } else {
            res.status(404).json({ error: 'Resource not found.' });
        }

    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error putting');
    }
});
router.put('/product', async (req, res) => {
    const pool = req.app.get('pool');
    try {
        const { id, body } = req.query;

        const client = await pool.connect();
        const result = await client.query('UPDATE products SET body=$2 WHERE id=$1', [id, body]);

        client.release();
        if (result.rowCount === 1) {
            res.status(200).json({ message: 'Resource updated successfully.' });
        } else {
            res.status(404).json({ error: 'Resource not found.' });
        }

    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error putting');
    }
});
router.delete('/product', async (req, res) => {
    const pool = req.app.get('pool');
    try {
        const { product_id } = req.query;

        const client = await pool.connect();
        const result = await client.query('DELETE FROM products WHERE id = $1', [product_id]);

        client.release();
        if (result.rowCount === 1) {
            res.status(204).end();
            console.log('deleted')
        } else {
            res.status(404).json({ error: 'Resource not found.' });
        }

    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error deleting');
    }
});
router.post('/communication', async (req, res) => {
    const pool = req.app.get('pool');
    console.log(req.body);
    try {
        const { seller_id,customer_id,product_id } = req.query;

        const client = await pool.connect();
        const result = await client.query('INSERT INTO communications (seller_id,customer_id,product_id) VALUES ($1,$2,$3)', [seller_id, customer_id, product_id]);

        client.release();
        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error deleting');
    }
});
router.get('/category/all', async function (req, res, next) {
    const pool = req.app.get('pool');
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM categories');
        const users = result.rows;
        client.release();
        res.json(users);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error getting');
    }
});
router.get('/category', async function (req, res, next) {
    const pool = req.app.get('pool');
    console.log(req.body);
    try {
        const { id } = req.query;
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM products WHERE category_id=$1',[id]);
        const users = result.rows;
        client.release();
        res.json(users);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error getting');
    }
});
router.get('/user/products', async function (req, res, next) {
    const pool = req.app.get('pool');
    console.log(req.body);
    try {
        const { user_id } = req.query;
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM products WHERE user_id=($1)', [user_id]);
        const users = result.rows;
        client.release();
        res.json(users);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error getting');
    }
});
router.post('/registration', async (req, res) => {
    const pool = req.app.get('pool');
    console.log(req.body);
    try {
        const { email, password, displayname, vorname, lastname } = req.query;

        const client = await pool.connect();
        const result = await client.query('INSERT INTO users (email, password, displayname, vorname, lastname) VALUES ($1,$2,$3,$4,$5)', [email, password, displayname, vorname, lastname]);

        client.release();
        res.status(201).json(result.rows[0]);
        log('new posted')

    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error posting');
    }
});
router.put('/users', async (req, res) => {
    const pool = req.app.get('pool');
    try {
        const { id, password, new_password } = req.query;

        const client = await pool.connect();
        const result = await client.query('UPDATE users SET password = $3 WHERE id = $1 AND password=$2', [id, password, new_password]);

        client.release();
        if (result.rowCount === 1) {
            res.status(200).json({ message: 'Resource updated successfully.' });
        } else {
            res.status(404).json({ error: 'Resource not found.' });
        }

    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error putting');
    }
});
router.put('/users', async (req, res) => {
    const pool = req.app.get('pool');
    try {
        const { id, password, displayname } = req.query;

        const client = await pool.connect();
        const result = await client.query('UPDATE users SET displayname = $3 WHERE id = $1 AND password=$2', [id, password, displayname]);

        client.release();
        if (result.rowCount === 1) {
            res.status(200).json({ message: 'Resource updated successfully.' });
        } else {
            res.status(404).json({ error: 'Resource not found.' });
        }

    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error putting');
    }
});

router.get('/signup', async function (req, res, next) {
    const pool = req.app.get('pool');
    console.log(req.body);
    try {
        const { email,password } = req.query;
        const client = await pool.connect();
        const result = await client.query('SELECT id FROM users WHERE email=($1) AND password=($2)', [email,password]);
        const users = result.rows;
        client.release();
        res.json(users);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error getting');
    }
});
router.get('/notifications', async function (req, res, next) {
    const pool = req.app.get('pool');
    console.log(req.body);
    try {
        const { user_id,currentdate } = req.query;
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM messages JOIN communications ON messages.communication_id=communications.id WHERE (seller_id=$1 OR customer_id=$2) AND messages.creationdate>$3', [user_id,user_id,currentdate]);
        const users = result.rows;
        client.release();
        res.json(users);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Error getting');
    }
});

router.post('/picture', upload.single('picture'), async (req, res) => {
    const pool = req.app.get('pool');
    console.log(req.query);
    console.log(req.file);
    try {
        const pictureData = req.file.buffer;
        const { product_id } = req.query;

        const client = await pool.connect();
        const result = await client.query('INSERT INTO pictures(product_id, picture) VALUES ($1, $2)', [product_id, pictureData]);

        client.release();
        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error posting');
    }
});

router.get('/picture/:product_id', async function (req, res) {
    const pool = req.app.get('pool');
    try {

        const { product_id } = req.params;
        const client = await pool.connect();
        const result = await client.query('SELECT picture FROM pictures WHERE product_id = $1', [product_id]);

        const pictureData = result.rows[0].picture_data;
        res.set('Content-Type', 'image/jpg');
        res.send(pictureData);

    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Error getting');
    }
});

module.exports = router;