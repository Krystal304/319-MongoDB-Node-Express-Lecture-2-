

import db from '../db/conn.mjs';
import { ObjectId } from 'mongodb';

// Get single grade entry by id
async function getSingleGrade(req, res) {
  try {
    let query = { _id: new ObjectId(req.params.id) };

    let collection = await db.collection('grades');

    let result = await collection.findOne(query);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
}

// Get grades by student id
async function getStudentGrades(req, res) {
  try {
    let query = { student_id: Number(req.params.id) };

    let collection = await db.collection('grades');

    let results = await collection.find(query).toArray();

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
}

// Get grades by classID
async function getClassGrades(req, res) {
  try {
    let query = { class_id: Number(req.params.id) };

    let collection = await db.collection('grades');

    let results = await collection.find(query).toArray();

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
}

// Create new grades in DB
async function studentClassesAvg(req, res) {
  try {
    // Assuming `db` is the database instance already connected.
    let collection = await db.collection('grades');

    // Using aggregate with an array of pipeline stages
    let result = await collection.aggregate([
      {
        $match: { student_id_id: Number(req.params.id) },
      },
      {
        $unwind: { path: "$scores" },
      },
      {
        $group: {
          _id: "$class_id",
          quiz: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "quiz"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
          exam: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "exam"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
          homework: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "homework"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          class_id: "$_id",
          avg: {
            $sum: [
              { $multiply: [{ $avg: "$exam" }, 0.5] },
              { $multiply: [{ $avg: "$quiz" }, 0.3] },
              { $multiply: [{ $avg: "$homework" }, 0.2] },
            ],
          },
        },
      },
    ]).toArray();  // Convert cursor to array if needed

    res.status(200).json(result);  // Send the result as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
}

//all class averages for one learner
async function studentClassesAvg(req, res) {
  try {
    let collection = await db.collection('grades');
  
    let results = await collection.aggregate([
      {
        $match: { student_id: Number(req.params.id) },
      },
      {
        $unwind: { path: "$scores" },
      },
      {
        $group: {
          _id: "$class_id",
          quiz: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "quiz"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
          exam: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "exam"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
          homework: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "homework"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          class_id: "$_id",
          avg: {
            $sum: [
              { $multiply: [{ $avg: "$exam" }, 0.5] },
              { $multiply: [{ $avg: "$quiz" }, 0.3] },
              { $multiply: [{ $avg: "$homework" }, 0.2] },
            ],
          },
        },
      },
    ]).toArray();  // Convert cursor to array if needed

    res.status(200).json(results);  // Send the result as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
}

  


 
export default { getSingleGrade, getClassGrades, getStudentGrades, createGrade, studentClassesAvg };