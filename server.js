const express = require('express');
const multer = require('multer');
const app = express();

// Налаштування Multer для завантаження файлів у пам’ять
const upload = multer({ storage: multer.memoryStorage() });

// Парсинг form-data
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

        // Отримуємо дані з форми
        const { firstName, lastName, email, company, industry, description } = req.body || {};

        // Перевіряємо обов’язкові поля
        if (!firstName || !lastName) {
            console.log('Missing required fields');
            return res.status(400).json({ success: false, error: 'First Name and Last Name are required' });
        }

        // Обробка фото
        let photoUrl = '';
        if (req.file) {
            console.log('Processing uploaded photo');
            const photoBase64 = req.file.buffer.toString('base64');
            photoUrl = `data:image/${req.file.mimetype.split('/')[1]};base64,${photoBase64}`;
        }

        // Генеруємо ID і URL профілю
        const profileId = `${firstName}-${lastName}-${Date.now()}`;
        const profileUrl = `/profiles/${profileId}`;

        console.log('Sending response:', { success: true, url: profileUrl });
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
        const profileData = {
            firstName,
            lastName,
            email: 'example@email.com',
            company: 'Example Corp',
            industry: 'Tech',
            description: 'This is a test profile'
        };
        res.send(profileTemplate(profileData, ''));
    } catch (error) {
        console.error('Error in /profiles/:id:', error);
        res.status(500).send('Error generating profile');
    }
});

module.exports = app;