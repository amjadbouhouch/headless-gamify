export namespace config {
  export const ENV = {
    port: process.env['PORT'] ? Number(process.env['PORT']) : 3000,
    DATABASE_URL: process.env['DATABASE_URL'],
  };
}
