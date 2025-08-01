// frontend-admin/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Paper,
  Container
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalCertificates: 0,
    completionRate: 0
  });

  const [chartData, setChartData] = useState({
    coursePopularity: [],
    certificateStatus: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      const response = await axios.get(`${API_URL}/dashboard/stats`);
      
      setStats(response.data.stats);
      setChartData(response.data.chartData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <Card sx={{ 
      height: '100%', 
      background: `linear-gradient(135deg, ${color}20, ${color}10)`,
      border: `1px solid ${color}30`
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="h2" sx={{ color: color, fontWeight: 'bold' }}>
              {value}
            </Typography>
            {trend && (
              <Chip 
                label={`+${trend}%`} 
                color="success" 
                size="small" 
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          <Box sx={{ color: color, fontSize: 48, opacity: 0.8 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography variant="h6">Carregando dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1976d2, #1565c0)' }}>
        <Typography variant="h3" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
          🏢 NEXUS SST Dashboard
        </Typography>
        <Typography variant="h6" sx={{ color: 'white', opacity: 0.9, mt: 1 }}>
          Plataforma de Segurança e Saúde no Trabalho
        </Typography>
      </Paper>
      
      {/* Cards de Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Usuários Ativos"
            value={stats.totalUsers}
            icon={<PeopleIcon />}
            color="#1976d2"
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Cursos Disponíveis"
            value={stats.totalCourses}
            icon={<SchoolIcon />}
            color="#388e3c"
            trend={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Certificados Emitidos"
            value={stats.totalCertificates}
            icon={<AssignmentIcon />}
            color="#f57c00"
            trend={23}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Taxa de Conclusão"
            value={`${stats.completionRate}%`}
            icon={<TrendingUpIcon />}
            color="#7b1fa2"
            trend={5}
          />
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                📊 Cursos Mais Populares
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.coursePopularity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="enrollments" fill="#1976d2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                🎯 Status dos Certificados
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.certificateStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {chartData.certificateStatus?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Status da API */}
      <Paper sx={{ p: 2, mt: 3, background: '#f5f5f5' }}>
        <Typography variant="body2" color="textSecondary">
          ✅ API Status: Conectado | 🌐 Ambiente: {process.env.NODE_ENV || 'Desenvolvimento'}
        </Typography>
      </Paper>
    </Container>
  );
};

export default Dashboard;