const loggerService = require('../services/loggerService');

/**
 * Middleware para loguear todas las peticiones HTTP en la base de datos
 */
const dbLogger = (req, res, next) => {
  const startTime = Date.now();

  // Interceptar el método end() de la respuesta
  const originalEnd = res.end;
  
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - startTime;
    
    // Loguear de forma asíncrona (no bloquea la respuesta)
    loggerService.http(req, res, responseTime).catch(err => {
      console.error('Error in dbLogger middleware:', err);
    });
    
    // Llamar al método original
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

module.exports = dbLogger;

