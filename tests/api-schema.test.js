const SwaggerParser = require('@apidevtools/swagger-parser');
const path = require('path');
const fs = require('fs');

describe('Kitsu OpenAPI Schema Validation', () => {
  const apiFilePath = path.join(__dirname, '../api/kitsu.yml');

  test('kitsu.yml debe existir', () => {
    expect(fs.existsSync(apiFilePath)).toBe(true);
  });

  test('El esquema OpenAPI debe ser válido', async () => {
    try {
      const api = await SwaggerParser.validate(apiFilePath);
      expect(api).toBeDefined();
      expect(api.openapi).toBeDefined();
      console.log('✅ API validada: %s, Version: %s', api.info.title, api.info.version);
    } catch (err) {
      fail(`Error al validar el esquema: ${err.message}`);
    }
  }, 30000); // Timeout de 30 segundos

  test('Todas las referencias $ref deben resolverse correctamente', async () => {
    try {
      const api = await SwaggerParser.dereference(apiFilePath);
      expect(api).toBeDefined();
      console.log('✅ Todas las referencias resueltas correctamente');
    } catch (err) {
      fail(`Error al resolver referencias: ${err.message}`);
    }
  }, 30000);

  test('El esquema debe tener información básica', async () => {
    try {
      const api = await SwaggerParser.parse(apiFilePath);
      expect(api.info).toBeDefined();
      expect(api.info.title).toBeDefined();
      expect(api.info.version).toBeDefined();
      expect(api.paths).toBeDefined();
      console.log('✅ Información básica del API encontrada');
    } catch (err) {
      fail(`Error al parsear el esquema: ${err.message}`);
    }
  });
});