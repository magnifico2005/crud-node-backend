const {z} = require('zod')

const loginSchema = z.object({
    email: z.string().email().max(180),
    password : z.string().min(6).max(12)
});

