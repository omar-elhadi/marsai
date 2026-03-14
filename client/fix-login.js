const fs = require('fs');
let content = fs.readFileSync('src/pages/LoginAdmin.tsx', 'utf8');

const targetStr = `    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL;
      if (!apiBaseUrl) throw new Error('Configuration VITE_API_URL manquante dans le .env');

      const data = response.data;
      if (response.status !== 200) throw new Error('Identifiants incorrects.');

      login(data.user);
      setSuccess('Connexion réussie.');
      setTimeout(() => navigate('/admin', { replace: true }), 800);
    } catch (err) {`;

const replStr = `    try {
      const response = await apiClient.post('/auth/login', { email, password });
      login(response.data.user || response.data);
      setSuccess('Connexion réussie.');
      setTimeout(() => navigate('/admin', { replace: true }), 800);
    } catch (err) {`;

content = content.replace(targetStr, replStr);
fs.writeFileSync('src/pages/LoginAdmin.tsx', content);
