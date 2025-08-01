import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartGear API',
      version: '1.0.0',
      description: 'API documentation for SmartGear e-commerce platform',
      contact: {
        name: 'SmartGear Team',
        email: 'support@smartgear.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: process.env.API_URL || 'https://your-production-domain.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Product ID'
            },
            name: {
              type: 'string',
              description: 'Product name'
            },
            description: {
              type: 'string',
              description: 'Product description'
            },
            price: {
              type: 'number',
              description: 'Product price'
            },
            category: {
              type: 'string',
              description: 'Product category'
            },
            image: {
              type: 'string',
              description: 'Product image URL'
            },
            stock: {
              type: 'number',
              description: 'Available stock quantity'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        CartItem: {
          type: 'object',
          properties: {
            product: {
              $ref: '#/components/schemas/Product'
            },
            quantity: {
              type: 'number',
              description: 'Quantity of the product'
            },
            price: {
              type: 'number',
              description: 'Price per unit'
            }
          }
        },
        Cart: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Cart ID'
            },
            user: {
              type: 'string',
              description: 'User ID'
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CartItem'
              }
            },
            total: {
              type: 'number',
              description: 'Total cart value'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Order ID'
            },
            user: {
              type: 'string',
              description: 'User ID'
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CartItem'
              }
            },
            total: {
              type: 'number',
              description: 'Total order value'
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
              description: 'Order status'
            },
            paymentStatus: {
              type: 'string',
              enum: ['pending', 'paid', 'failed'],
              description: 'Payment status'
            },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Payment: {
          type: 'object',
          properties: {
            reference: {
              type: 'string',
              description: 'Payment reference'
            },
            amount: {
              type: 'number',
              description: 'Payment amount'
            },
            status: {
              type: 'string',
              enum: ['pending', 'success', 'failed'],
              description: 'Payment status'
            },
            gateway: {
              type: 'string',
              description: 'Payment gateway used'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            stack: {
              type: 'string',
              description: 'Error stack trace (development only)'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints'
      },
      {
        name: 'Products',
        description: 'Product management endpoints'
      },
      {
        name: 'Cart',
        description: 'Shopping cart endpoints'
      },
      {
        name: 'Orders',
        description: 'Order management endpoints'
      },
      {
        name: 'Payments',
        description: 'Payment processing endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
}

export const specs = swaggerJsdoc(options) 