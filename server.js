const express = require('express');
const multer = require('multer');
const app = express();

// Налаштування Multer
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Шаблон для профілю
const profileTemplate = (data) => `
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Profile of ${data.firstName} ${data.lastName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
    </style>
</head>
<body>
    <h1>${data.firstName} ${data.lastName}</h1>
    <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
    <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
    <p><strong>Industry:</strong> ${data.industry || 'N/A'}</p>
    <p><strong>Description:</strong> ${data.description || 'No description'}</p>
</body>
</html>
`;

// Обробка POST /api/save-profile
app.post('/api/save-profile', upload.single('photo'), (req, res) => {
    try {
        console.log('Received POST /api/save-profile');
        console.log('Request body:', req.body);

        const { firstName, lastName, email, company, industry, description } = req.body || {};
        if (!firstName || !lastName) {
            return res.status(400).json({ success: false, error: 'First Name and Last Name are required' });
        }

        const profileId = `${firstName}-${lastName}-${Date.now()}`;
        const profileUrl = `/profiles/${profileId}`;

        res.json({ success: true, url: profileUrl });
    } catch (error) {
        console.error('Error in /api/save-profile:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Обробка GET /profiles/:id
app.get('/profiles/:id', (req, res) => {
    try {
        console.log('Received GET /profiles/:id', req.params.id);
        const profileId = req.params.id;
        const [firstName, lastName] = profileId.split('-').slice(0, 2);

        // Тимчасові дані (без фото)
        const profileData = {
            firstName,
            lastName,
            email: req.query.email || 'N/A',
            company: req.query.company || 'N/A',
            industry: req.query.industry || 'N/A',
            description: req.query.description || 'No description'
        };

        res.send(profileTemplate(profileData));
    } catch (error) {
        console.error('Error in /profiles/:id:', error);
        res.status(500).send('Error generating profile');
    }
});

module.exports = app;