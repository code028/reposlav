import multer from 'multer';
import path from 'path';
import fs from 'fs';
import express from 'express';
import {prisma} from '../../prisma/client';
import authGuard from '../auth/authGuard';

const router = express.Router();

// Konfiguracija skladišta za fajlove
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { year, universityId, facultyId, workId } = req.body;

    const uploadPath = path.join(__dirname, `/uploads/private/works/${year}/${universityId}/${facultyId}/${workId}/files/`);

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Konfiguracija Multer-a za upload
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.pptx', '.sql', '.mp3', '.mp4', '.zip', '.webp', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error('Nedozvoljeni tip fajla'));
    }
    cb(null, true);
  },
});

// Ruta za upload fajlova i povezivanje sa radovima
router.post('/upload/work', upload.array('files'), async (req, res) => {
  try {
    const { workId, studentIdFK } = req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'Nema fajlova za upload' });
    }

    // Provera da li rad (work) postoji
    const work = await prisma.work.findUnique({
      where: { id: parseInt(workId) },
    });

    if (!work) {
      return res.status(404).json({ message: 'Rad nije pronađen' });
    }

    // Provera da li student postoji
    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentIdFK) },
    });

    if (!student) {
      return res.status(404).json({ message: 'Student nije pronađen' });
    }

    // Mapiranje fajlova i njihovo čuvanje u bazi
    const fileData = files.map((file) => ({
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
      path: file.path,
      workId: parseInt(workId),
    }));

    // Sačuvaj fajlove u bazi
    await prisma.file.createMany({
      data: fileData,
    });

    res.status(200).json({ message: 'Fajlovi uspešno uploadovani', files: fileData });
  } catch (error: any) {
    res.status(500).json({ message: 'Greška prilikom upload-a', error: error.message });
  }
});


router.get('/files', authGuard, async (req, res) => {
  try {
    const filesWithWorkAndStudent = await prisma.file.findMany({
      include: {
        work: {
          include: {
            student: true, // Uključi podatke o studentu
          },
        },
      },
    });

    res.status(200).json(filesWithWorkAndStudent);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Error fetching files' });
  }
});

router.get('/download/:year/:universityId/:facultyId/:workId/:filename', (req, res) => {
  const { year, universityId, facultyId, workId, filename } = req.params;

  // Formiraj apsolutnu putanju do fajla na serveru
  const filePath = path.join(__dirname, '../multer/uploads/private/works', year, universityId, facultyId, workId, 'files', filename);
  console.log('Preuzimanje fajla sa putanje:', filePath);


  // console.log('Preuzimanje fajla sa putanje:', filePath);

  // Koristi `res.download` za preuzimanje fajla
  res.download(filePath, (err) => {
    if (err) {
      console.error('Greška prilikom preuzimanja fajla:', err);
      res.status(500).send({
        message: 'Error downloading the file.',
      });
    }
  });
});


export {router as MulterRouter}