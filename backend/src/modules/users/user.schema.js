const { z } = require('zod');

const createUserSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180)
});

const updateUserSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  email: z.string().email().max(180).optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: 
'Pelo menos um campo deve ser fornecido.'
});

module.exports = { createUserSchema, updateUserSchema };
