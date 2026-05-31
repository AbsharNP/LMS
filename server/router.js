import { Router } from 'express';

const router = Router();

const courses = [
  {
    title: 'React Fundamentals',
    instructor: 'Aarav Mehta',
    students: 124,
    progress: 72,
    status: 'Published',
  },
  {
    title: 'Database Design',
    instructor: 'Neha Kapoor',
    students: 86,
    progress: 54,
    status: 'Review',
  },
  {
    title: 'Node API Bootcamp',
    instructor: 'Riya Sharma',
    students: 98,
    progress: 81,
    status: 'Published',
  },
];

router.get('/', (req, res) => {
  res.send('Hello Express!');
});

router.get('/api/test', (req, res) => {
  res.json({ message: 'Backend Connected' });
});

router.get('/api/courses', (req, res) => {
  res.json({ courses });
});

export default router;
