const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

const profileTemplate = (data) => `
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
    ${data.photo ? `<img src="/uploads/${data.photo}" alt="Photo">` : ''}
    <p><strong>Description:</strong> ${data.description || 'No description'}</p>
</body>
</html>
`;

app.post('/save-profile', upload.single('photo'), (req, res) => {
    const { firstName, lastName, email, company, industry, description } = req.body;
    const photo = req.file ? req.file.filename : null;

    const profileId = `${firstName}-${lastName}-${Date.now()}`;
    const profilePath = path.join(__dirname, 'public', 'profiles', `${profileId}.html`);

    if (!fs.existsSync(path.join(__dirname, 'public', 'profiles'))) {
        fs.mkdirSync(path.join(__dirname, 'public', 'profiles'));
    }

    const profileData = { firstName, lastName, email, company, industry, description, photo };
    fs.writeFileSync(profilePath, profileTemplate(profileData));

    const profileUrl = `http://192.168.0.185:${port}/profiles/${profileId}.html`;
    res.json({ success: true, url: profileUrl });
});

app.use('/uploads', express.static('uploads'));
app.use('/profiles', express.static('public/profiles'));

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://192.168.0.185:${port}`);
});