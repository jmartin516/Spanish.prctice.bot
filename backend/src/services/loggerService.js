const { Log } = require('../database/models');

class LoggerService {
  /**
   * Guarda un log en la base de datos
   * @param {Object} logData - Datos del log
   */
  async log(logData) {
    try {
      // No bloquear la respuesta si falla el logging
      await Log.create({
        level: logData.level || 'info',
        message: logData.message || '',
        method: logData.method,
        path: logData.path,
        statusCode: logData.statusCode,
        responseTime: logData.responseTime,
        ip: logData.ip,
        userAgent: logData.userAgent,
        userId: logData.userId,
        error: logData.error,
        stack: logData.stack,
        metadata: logData.metadata
      });
    } catch (error) {
      // Solo loguear en consola si falla el guardado en BD
      // No queremos que un error de logging rompa la aplicación
      console.error('Error saving log to database:', error.message);
    }
  }

  /**
   * Log de nivel INFO
   */
  async info(message, data = {}) {
    return this.log({
      level: 'info',
      message,
      ...data
    });
  }

  /**
   * Log de nivel ERROR
   */
  async error(message, error = null, data = {}) {
    return this.log({
      level: 'error',
      message,
      error: error?.message || error,
      stack: error?.stack,
      ...data
    });
  }

  /**
   * Log de nivel WARNING
   */
  async warning(message, data = {}) {
    return this.log({
      level: 'warning',
      message,
      ...data
    });
  }

  /**
   * Log de nivel DEBUG
   */
  async debug(message, data = {}) {
    if (process.env.NODE_ENV === 'development') {
      return this.log({
        level: 'debug',
        message,
        ...data
      });
    }
  }

  /**
   * Log de peticiones HTTP
   */
  async http(req, res, responseTime) {
    const userId = req.user?.id || null;
    
    return this.log({
      level: 'http',
      message: `${req.method} ${req.path} - ${res.statusCode}`,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      userId,
      metadata: {
        query: req.query,
        params: req.params,
        // No guardar passwords o datos sensibles
        body: this.sanitizeBody(req.body)
      }
    });
  }

  /**
   * Sanitiza el body para no guardar información sensible
   */
  sanitizeBody(body) {
    if (!body || typeof body !== 'object') return body;
    
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard'];
    const sanitized = { ...body };
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }
}

module.exports = new LoggerService();

