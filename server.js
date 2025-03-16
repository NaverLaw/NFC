const express = require('express');
const multer = require('multer');
const app = express();

// Налаштування для завантаження файлів у пам’ять
const upload = multer({ storage: multer.memoryStorage() });

// Дозволяємо JSON і urlencoded для POST-запитів
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Шаблон для сторінки профілю
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
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Company:</strong> ${data.company}</p>
    <p><strong>Industry:</strong> ${data.industry}</p>
    ${photoUrl ? `<img src="${photoUrl}" alt="Photo">` : ''}
    <p><strong>Description:</strong> ${data.description || 'No description'}</p>
</body>
</html>
`;

// Обробка форми
app.post('/api/save-profile', upload.single('photo'), (req, res) => {
    const { firstName, lastName, email, company, industry, description } = req.body;
    let photoUrl = '';

    if (req.file) {
        const photoBase64 = req.file.buffer.toString('base64');
        photoUrl = `data:image/${req.file.mimetype.split('/')[1]};base64,${photoBase64}`;
    }

    const profileId = `${firstName}-${lastName}-${Date.now()}`;
    const profileUrl = `/profiles/${profileId}`;

    res.json({ success: true, url: profileUrl });
});

// Обробка сторінки профілю
app.get('/profiles/:id', (req, res) => {
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
});

module.exports = app;