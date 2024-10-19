

// Imports
import express from 'express';
import gradesCTL from '../controllers/gradesController.mjs';


const router = express.Router();




// get grades by stats
router.get('/stats', gradesCTL.getStudentStats)

// Get grades by ID
router.route('/:id').get(gradesCTL.getSingleGrade);

// Get student grades by studentid
// router.get('/student/:id', gradesCTL.getStudentGrades)

// // get grades by stats
// router.get('/stats', gradesCTL.getStudentStats)

// Get Class grades by classID
router.get('/class/:id', gradesCTL.getClassGrades)

// Add new grade too
router.post('/', gradesCTL.createGrade)

//get weighted average fort learner 
router.get('/learner/:id/avg', gradesCTL.studentClassesAvg)

export default router;



