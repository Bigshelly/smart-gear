import express from 'express'
import {
  initializePayment,
  verifyPayment,
  handleWebhook
} from '../controllers/paymentController.js'

const router = express.Router()

/**
 * @swagger
 * /api/payments/initialize:
 *   post:
 *     summary: Initialize payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - email
 *               - reference
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 100
 *                 description: Payment amount in kobo (Nigerian currency)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Customer email
 *               reference:
 *                 type: string
 *                 description: Unique payment reference
 *               callback_url:
 *                 type: string
 *                 description: Callback URL after payment
 *               metadata:
 *                 type: object
 *                 description: Additional payment metadata
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     authorization_url:
 *                       type: string
 *                       description: URL to redirect customer for payment
 *                     access_code:
 *                       type: string
 *                       description: Payment access code
 *                     reference:
 *                       type: string
 *                       description: Payment reference
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Payment initialization failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/initialize', initializePayment)

/**
 * @swagger
 * /api/payments/verify/{reference}:
 *   get:
 *     summary: Verify payment
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment reference
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Invalid reference
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Payment verification failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/verify/:reference', verifyPayment)

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Handle payment webhook
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 description: Webhook event type
 *               data:
 *                 type: object
 *                 description: Payment data
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Webhook processed
 *       400:
 *         description: Invalid webhook data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Webhook processing failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/webhook', handleWebhook)

export default router