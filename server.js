const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Налаштування Multer для обробки файлів (без збереження на диск)
const upload = multer({
    storage: multer.memoryStorage(), // Зберігаємо файли в пам'яті
    limits: { fileSize: 5 * 1024 * 1024 }, // Обмеження: 5MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Статичні файли
app.use(express.static('public'));

// Шаблон для профілю
const profileTemplate = (data, photoBase64) => `
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
    ${photoBase64 ? `<p><img src="data:image/jpeg;base64,${photoBase64}" alt="Profile Photo"></p>` : ''}
    <p><strong>Description:</strong> ${data.description || 'No description'}</p>
</body>
</html>
`;

// Обробка POST /save-profile
app.post('/save-profile', upload.single('photo'), async (req, res) => {
    try {
        console.log('Received POST /save-profile');
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file); // Логування файлу

        const { firstName, lastName, email, company, industry, description } = req.body || {};
        if (!firstName || !lastName) {
            return res.status(400).json({ success: false, error: 'First Name and Last Name are required' });
        }

        let photoBase64 = '';
        if (req.file) {
            photoBase64 = req.file.buffer.toString('base64'); // Конвертуємо файл у Base64
        }

        const profileId = `${firstName}-${lastName}-${Date.now()}`;
        const profileUrl = `/profiles/${profileId}?email=${encodeURIComponent(email || '')}&company=${encodeURIComponent(company || '')}&industry=${encodeURIComponent(industry || '')}&description=${encodeURIComponent(description || '')}&photo=${encodeURIComponent(photoBase64)}`;

        res.json({ success: true, url: profileUrl });
    } catch (error) {
        console.error('Error in /save-profile:', error.message);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Обробка GET /profiles/:id
app.get('/profiles/:id', (req, res) => {
    try {
        const profileId = req.params.id;
        const [firstName, lastName] = profileId.split('-').slice(0, 2);

        const { email, company, industry, description, photo } = req.query;
        const profileData = {
            firstName,
            lastName,
            email: email ? decodeURIComponent(email) : 'N/A',
            company: company ? decodeURIComponent(company) : 'N/A',
            industry: industry ? decodeURIComponent(industry) : 'N/A',
            description: description ? decodeURIComponent(description) : 'No description',
        };

        const photoBase64 = photo ? decodeURIComponent(photo) : '';
        res.send(profileTemplate(profileData, photoBase64));
    } catch (error) {
        console.error('Error in /profiles/:id:', error.message);
        res.status(500).send('Error generating profile');
    }
});

// Слухання порту
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});