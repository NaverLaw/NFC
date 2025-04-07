const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // Для генерації унікальних ідентифікаторів
const path = require('path');
const app = express();

// Налаштування Multer для обробки файлів (без збереження на диск)
const upload = multer({
    storage: multer.memoryStorage(),
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
app.use(express.static('public'));

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, 'dist')));

// Зберігання профілів у пам'яті
const profiles = {};

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
app.post('/save-profile', upload.single('photo'), (req, res) => {
    try {
        const { firstName, lastName, email, company, industry, description } = req.body || {};
        if (!firstName || !lastName) {
            return res.status(400).json({ success: false, error: 'First Name and Last Name are required' });
        }

        let photoBase64 = '';
        if (req.file) {
            photoBase64 = req.file.buffer.toString('base64'); // Конвертуємо файл у Base64
        }

        const profileId = uuidv4(); // Генеруємо унікальний ідентифікатор
        profiles[profileId] = { firstName, lastName, email, company, industry, description, photoBase64 };

        res.json({ success: true, url: `/profiles/${profileId}` });
    } catch (error) {
        console.error('Error in /save-profile:', error.message);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Обробка GET /profiles/:id
app.get('/profiles/:id', (req, res) => {
    try {
        const profileId = req.params.id;
        const profileData = profiles[profileId];

        if (!profileData) {
            return res.status(404).send('Profile not found');
        }

        res.send(profileTemplate(profileData, profileData.photoBase64));
    } catch (error) {
        console.error('Error in /profiles/:id:', error.message);
        res.status(500).send('Error generating profile');
    }
});

// Handle all other routes by serving the frontend's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Слухання порту
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});