import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { Company, prisma } from 'src/utils/prisma';
declare module 'hono' {
  interface ContextVariableMap {
    company: Company;
  }
}
//
export namespace middlewares {
  //
  export const verifyApiKey = createMiddleware(async (c, next) => {
    //  get the api key from header
    const API_KEY = c.req.header('x-api-key') ?? c.req.query('api_key');
    if (!API_KEY) {
      throw new HTTPException(401, { message: 'API Key is required' });
    }
    const company = await prisma.company.findFirst({
      where: {
        metadata: {
          path: ['apiKey'],
          equals: API_KEY,
        },
      },
    });
    if (!company) {
      throw new HTTPException(401, { message: 'Invalid API KEY' });
    }
    c.set('company', company);
    return await next();
  });
}
