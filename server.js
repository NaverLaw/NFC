const express = require('express');
const multer = require('multer');
const app = express();

// Налаштування Multer
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Шаблон для профілю
const profileTemplate = (data, photoUrl) => `
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Profile of ${data.firstName} ${data.lastName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        img { max-width: 200px; }
    </style>
</head>
<body>
    <h1>${data.firstName} ${data.lastName}</h1>
    <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
    <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
    <p><strong>Industry:</strong> ${data.industry || 'N/A'}</p>
    ${photoUrl ? `<img src="${photoUrl}" alt="Photo">` : ''}
    <p><strong>Description:</strong> ${data.description || 'No description'}</p>
</body>
</html>
`;

// Обробка POST /api/save-profile
app.post('/api/save-profile', upload.single('photo'), (req, res) => {
    try {
        console.log('Received POST /api/save-profile');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        const { firstName, lastName, email, company, industry, description } = req.body || {};
        if (!firstName || !lastName) {
            return res.status(400).json({ success: false, error: 'First Name and Last Name are required' });
        }

        let photoUrl = '';
        if (req.file) {
            const photoBase64 = req.file.buffer.toString('base64');
            photoUrl = `data:image/${req.file.mimetype.split('/')[1]};base64,${photoBase64}`;
        }

        // Генеруємо URL із закодованими даними
        const profileId = `${firstName}-${lastName}-${Date.now()}`;
        const profileUrl = `/profiles/${profileId}?email=${encodeURIComponent(email || '')}&company=${encodeURIComponent(company || '')}&industry=${encodeURIComponent(industry || '')}&description=${encodeURIComponent(description || '')}&photo=${encodeURIComponent(photoUrl)}`;

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

        // Отримуємо дані з query-параметрів
        const { email, company, industry, description, photo } = req.query;

        const profileData = {
            firstName,
            lastName,
            email: decodeURIComponent(email) || 'N/A',
            company: decodeURIComponent(company) || 'N/A',
            industry: decodeURIComponent(industry) || 'N/A',
            description: decodeURIComponent(description) || 'No description'
        };

        const photoUrl = decodeURIComponent(photo || '');

        res.send(profileTemplate(profileData, photoUrl));
    } catch (error) {
        console.error('Error in /profiles/:id:', error);
        res.status(500).send('Error generating profile');
    }
});

module.exports = app;