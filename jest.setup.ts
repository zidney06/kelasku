// jest.setup.ts
import "@testing-library/jest-dom";

import { TextEncoder, TextDecoder } from "util";

// 1. Suntikkan TextEncoder & TextDecoder ke global
// Ini harus dilakukan sebelum import undici agar undici tidak error
Object.defineProperty(global, "TextEncoder", {
  value: TextEncoder,
});

Object.defineProperty(global, "TextDecoder", {
  value: TextDecoder,
});
// jest.setup.ts
import { Request, Response, Headers, fetch } from "undici";

Object.defineProperty(global, "Request", {
  value: Request,
  writable: true,
});

Object.defineProperty(global, "Response", {
  value: Response,
  writable: true,
});

Object.defineProperty(global, "Headers", {
  value: Headers,
  writable: true,
});

Object.defineProperty(global, "fetch", {
  value: fetch,
  writable: true,
});

// Next.js sering menggunakan NextResponse yang merupakan extend dari Response
// Kita bisa buat mock sederhana yang kompatibel
const mockNextResponse = {
  json: (data: unknown, init?: ResponseInit) => {
    return Response.json(data, init);
  },
};

Object.defineProperty(global, "NextResponse", {
  value: mockNextResponse,
  writable: true,
});
