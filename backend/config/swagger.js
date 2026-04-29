const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'MBABAZI CLOSET API Documentation',
      version: '1.0.0',
      description: 'API documentation for the MBABAZI CLOSET e-commerce platform',
      contact: {
        name: 'MBABAZI Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // apis: ['./routes/*.js'], // Path to the API docs (Temporarily disabled for Windows compatibility)
  apis: [],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
