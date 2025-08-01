// backend/routes/dashboard.js
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Estatísticas do dashboard
router.get('/stats', async (req, res) => {
    try {
        // Buscar estatísticas básicas
        const [usersResult, coursesResult, certificatesResult] = await Promise.all([
            supabase.from('users').select('id', { count: 'exact', head: true }),
            supabase.from('courses').select('id', { count: 'exact', head: true }),
            supabase.from('certificates').select('id', { count: 'exact', head: true })
        ]);

        const stats = {
            totalUsers: usersResult.count || 0,
            totalCourses: coursesResult.count || 0,
            totalCertificates: certificatesResult.count || 0,
            completionRate: 85 // Mock por enquanto
        };

        // Dados para gráficos (mock inicial)
        const chartData = {
            coursePopularity: [
                { name: 'NR-35', enrollments: 45 },
                { name: 'NR-10', enrollments: 38 },
                { name: 'NR-06', enrollments: 32 },
                { name: 'NR-17', enrollments: 28 },
                { name: 'NR-12', enrollments: 25 }
            ],
            certificateStatus: [
                { name: 'Válidos', value: 120, color: '#4caf50' },
                { name: 'Vencidos', value: 15, color: '#ff9800' },
                { name: 'Revogados', value: 3, color: '#f44336' }
            ]
        };

        res.json({ stats, chartData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;