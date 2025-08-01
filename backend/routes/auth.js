// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Inicializar Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Registrar usuário
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, companyName } = req.body;

        // Validar dados
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 12);

        // Criar usuário no Supabase
        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    email,
                    password_hash: hashedPassword,
                    first_name: firstName,
                    last_name: lastName,
                    company_name: companyName || null,
                    role: 'user'
                }
            ])
            .select();

        if (error) {
            console.error(error);
            return res.status(400).json({ error: 'Erro ao criar usuário' });
        }

        res.status(201).json({ 
            message: 'Usuário criado com sucesso!',
            user: { 
                id: data[0].id,
                email: data[0].email,
                name: `${data[0].first_name} ${data[0].last_name}`
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuário
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .limit(1);

        if (error || !users || users.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const user = users[0];

        // Verificar senha
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Criar token JWT
        const token = jwt.sign(
            { 
                userId: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login realizado com sucesso!',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: `${user.first_name} ${user.last_name}`,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;