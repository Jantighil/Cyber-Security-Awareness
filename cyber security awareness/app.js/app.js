const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

// Initialize Supabase client
const supabaseUrl = 'https://your-project-ref.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'your-anon-key'; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user into Supabase
        const { data, error } = await supabase
            .from('users')
            .insert([
                { username: username, password: hashedPassword }
            ]);

        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
        }

        res.status(201).json({ message: 'User registered successfully', user: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
