import { HTTPException } from 'hono/http-exception';

export namespace assertHelper {
  export function assertExist(condition: unknown, message: string): asserts condition {
    if (!condition) {
      throw new HTTPException(404, { message });
    }
  }
  export function assertBadRequest(condition: unknown, message: string): asserts condition {
    if (!condition) {
      throw new HTTPException(400, { message });
    }
  }
}
