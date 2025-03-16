const express = require('express');
const multer = require('multer');
const app = express();

// Налаштування для завантаження файлів у пам’ять (не на диск)
const upload = multer({ storage: multer.memoryStorage() });

// Доступ до статичних файлів у папці public
app.use(express.static('public'));

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
app.post('/save-profile', upload.single('photo'), (req, res) => {
    const { firstName, lastName, email, company, industry, description } = req.body;
    let photoUrl = '';

    // Якщо є фото, конвертуємо його в base64 і додаємо як data URL
    if (req.file) {
        const photoBase64 = req.file.buffer.toString('base64');
        photoUrl = `data:image/${req.file.mimetype.split('/')[1]};base64,${photoBase64}`;
    }

    const profileId = `${firstName}-${lastName}-${Date.now()}`;
    const profileUrl = `/profiles/${profileId}`;

    // Повертаємо JSON із URL профілю
    res.json({ success: true, url: profileUrl });
});

// Обробка сторінки профілю
app.get('/profiles/:id', (req, res) => {
    // Отримуємо дані з URL-параметрів або сесії, але для простоти повертаємо приклад
    const profileId = req.params.id;
    const [firstName, lastName] = profileId.split('-').slice(0, 2); // Витягуємо ім’я та прізвище
    const profileData = {
        firstName,
        lastName,
        email: 'example@email.com', // Для прикладу, можна додати збереження
        company: 'Example Corp',
        industry: 'Tech',
        description: 'This is a test profile'
    };
    // Тут має бути логіка для фото, але поки фото втрачається
    res.send(profileTemplate(profileData, '')); // Без фото для простоти
});

module.exports = app;