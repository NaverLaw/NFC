const express = require('express');
const multer = require('multer');
const app = express();

// Налаштування Multer
const upload = multer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Статичні файли
app.use(express.static('public'));

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

// Обробка POST /save-profile
app.post('/save-profile', upload.none(), (req, res) => {
    try {
        console.log('Received POST /save-profile');
        console.log('Request body:', req.body);

        const { firstName, lastName, email, company, industry, description } = req.body || {};
        if (!firstName || !lastName) {
            console.log('Missing required fields:', { firstName, lastName });
            return res.status(400).json({ success: false, error: 'First Name and Last Name are required' });
        }

        const profileId = `${firstName}-${lastName}-${Date.now()}`;
        const profileUrl = `/profiles/${profileId}?email=${encodeURIComponent(email || '')}&company=${encodeURIComponent(company || '')}&industry=${encodeURIComponent(industry || '')}&description=${encodeURIComponent(description || '')}`;

        console.log('Sending response:', { success: true, url: profileUrl });
        res.json({ success: true, url: profileUrl });
    } catch (error) {
        console.error('Error in /save-profile:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Обробка GET /profiles/:id
app.get('/profiles/:id', (req, res) => {
    try {
        console.log('Received GET /profiles/:id', req.params.id);
        console.log('Query params:', req.query);
        const profileId = req.params.id;
        const [firstName, lastName] = profileId.split('-').slice(0, 2);

        const { email, company, industry, description } = req.query;
        const profileData = {
            firstName,
            lastName,
            email: decodeURIComponent(email) || 'N/A',
            company: decodeURIComponent(company) || 'N/A',
            industry: decodeURIComponent(industry) || 'N/A',
            description: decodeURIComponent(description) || 'No description'
        };

        res.send(profileTemplate(profileData));
    } catch (error) {
        console.error('Error in /profiles/:id:', error);
        res.status(500).send('Error generating profile');
    }
});

module.exports = app;