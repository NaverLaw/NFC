const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Перевірка та створення папки для завантажень
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
    console.log('Created uploads directory:', uploadPath);
}

// Налаштування Multer для збереження файлів на диску
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath); // Папка для збереження файлів
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + '-' + file.originalname); // Унікальне ім'я файлу
        },
    }),
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

// Додаємо статичний маршрут для обслуговування завантажених файлів
app.use('/uploads', express.static(uploadPath));

// Статичні файли
app.use(express.static('public'));

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
    ${photoUrl ? `<p><img src="${photoUrl}" alt="Profile Photo"></p>` : ''}
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

        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }

        const { firstName, lastName, email, company, industry, description } = req.body || {};
        if (!firstName || !lastName) {
            return res.status(400).json({ success: false, error: 'First Name and Last Name are required' });
        }

        let photoUrl = '';
        if (req.file) {
            photoUrl = `/uploads/${req.file.filename}`;
        }

        const profileId = `${firstName}-${lastName}-${Date.now()}`;
        const profileUrl = `/profiles/${profileId}?email=${encodeURIComponent(email || '')}&company=${encodeURIComponent(company || '')}&industry=${encodeURIComponent(industry || '')}&description=${encodeURIComponent(description || '')}&photo=${encodeURIComponent(photoUrl)}`;

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

        const photoUrl = photo ? decodeURIComponent(photo) : '';
        res.send(profileTemplate(profileData, photoUrl));
    } catch (error) {
        res.status(500).send('Error generating profile');
    }
});

// Слухання порту
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});