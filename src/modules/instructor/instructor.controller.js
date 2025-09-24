import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client';
import { asyncHandler} from '../../middleware/errorHandling.js';
import { formatInstructor } from '../../Utilities/reusable.helper.js';

const prisma = new PrismaClient();

export const createInstructor = asyncHandler(async (req, res, next) => {
  const { username, email, password, ...instructorFields } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return next(new Error('User already exists with this email', { cause: 400 }));
  }

  const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALTROUND) || 12);

  const user = await prisma.user.create({
    data: { username, email, password: hashedPassword, role: "INSTRUCTOR" }
  });

  const instructor = await prisma.instructor.create({
    data: { userId: user.id, ...instructorFields },
    include: { user: true }
  });

  res.status(201).json({
    success: true,
    data: instructor
  });
});





// GET instructors
export const getInstructors = asyncHandler(async (req, res, next) => {
  const instructors = await prisma.instructor.findMany({
    include: { user: true }
  });

  res.status(200).json({
    success: true,
    count: instructors.length,
    data: formatInstructor(instructors)
  });
});