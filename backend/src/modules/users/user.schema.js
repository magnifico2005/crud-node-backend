const { z } = require('zod');

const createUserSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  password: z.string().min(6).max(9)
});

const updateUserSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  email: z.string().email().max(180).optional(),
  password: z.string().min(6).max(9).optional(),
  role: z.string().min(1).max(50).optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: 
'Pelo menos um campo deve ser fornecido.'
});

module.exports = { createUserSchema, updateUserSchema };
