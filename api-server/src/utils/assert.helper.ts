import { HTTPException } from 'hono/http-exception';

export namespace assertHelper {
  export function assertBadRequest(condition: unknown, message: string): asserts condition {
    if (!condition) {
      throw new HTTPException(400, { message });
    }
  }

  export function assertNotFound(condition: unknown, message: string): asserts condition {
    if (!condition) {
      throw new HTTPException(404, { message });
    }
  }

  export function assertDuplicated(condition: unknown, message: string): asserts condition {
    if (!condition) {
      throw new HTTPException(409, { message });
    }
  }

  export function assertUnauthorized(condition: unknown, message: string): asserts condition {
    if (!condition) {
      throw new HTTPException(401, { message });
    }
  }

  export function assertForbidden(condition: unknown, message: string): asserts condition {
    if (!condition) {
      throw new HTTPException(403, { message });
    }
  }

  export function assertServerError(condition: unknown, message: string): asserts condition {
    if (!condition) {
      throw new HTTPException(500, { message });
    }
  }

  export function assertPaymentRequired(condition: unknown, message: string): asserts condition {
    if (!condition) {
      throw new HTTPException(402, { message });
    }
  }

  export function assertTooManyRequests(condition: unknown, message: string): asserts condition {
    if (!condition) {
      throw new HTTPException(429, { message });
    }
  }
}
