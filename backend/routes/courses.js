// backend/routes/courses.js
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Listar todos os cursos
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar cursos' });
        }

        res.json({ courses: data });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Buscar curso por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', id)
            .eq('status', 'active')
            .single();

        if (error || !data) {
            return res.status(404).json({ error: 'Curso não encontrado' });
        }

        res.json({ course: data });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;