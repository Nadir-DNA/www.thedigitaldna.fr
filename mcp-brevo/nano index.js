#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { z } from "zod";

// CONFIGURATION
const API_KEY = process.env.BREVO_API_KEY || "eyJhcGlfa2V5IjoieGtleXNpYi02NTI5NGViNTFhZWViNmI4MzBiYzA2NzA4Njc1MDIwN2FjMGZmNWU5NmEyZmUxYTU3NmEyNDNhOTQwN2RjZmI4LXlIN3BTVUZHaUQyWDdqWHEifQ=="; // <-- METTEZ VOTRE CLÉ SI PAS DE .ENV

const server = new Server(
    {
        name: "brevo-sms-server",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// 1. DÉFINITION DE L'OUTIL
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "send_transactional_sms",
                description: "Envoie un SMS transactionnel via Brevo. Utile pour contacter un prospect.",
                inputSchema: {
                    type: "object",
                    properties: {
                        phoneNumber: {
                            type: "string",
                            description: "Numéro de téléphone au format international (ex: +33612345678).",
                        },
                        message: {
                            type: "string",
                            description: "Le contenu du message SMS (max 160 caractères recommandé).",
                        },
                        senderName: {
                            type: "string",
                            description: "Nom de l'expéditeur (max 11 caractères alphanumériques).",
                        },
                    },
                    required: ["phoneNumber", "message"],
                },
            },
        ],
    };
});

// 2. EXÉCUTION DE L'OUTIL
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "send_transactional_sms") {
        const { phoneNumber, message, senderName = "WebAgency" } = request.params.arguments;

        try {
            // Nettoyage basique du numéro si l'IA oublie le format
            let cleanPhone = phoneNumber.replace(/\s/g, '').replace(/\./g, '').replace(/-/g, '');
            if (cleanPhone.startsWith('0') && cleanPhone.length === 10) {
                cleanPhone = '+33' + cleanPhone.substring(1);
            }
            // Gestion spécifique de votre CSV (ex: 680800800 -> +33680800800)
            if (!cleanPhone.startsWith('+') && (cleanPhone.startsWith('6') || cleanPhone.startsWith('7'))) {
                cleanPhone = '+33' + cleanPhone;
            }

            const response = await axios.post(
                "https://api.brevo.com/v3/transactionalSMS/sms",
                {
                    sender: senderName,
                    recipient: cleanPhone,
                    content: message,
                    type: "transactional",
                },
                {
                    headers: {
                        "api-key": API_KEY,
                        "accept": "application/json",
                        "content-type": "application/json",
                    },
                }
            );

            return {
                content: [
                    {
                        type: "text",
                        text: `SMS envoyé avec succès à ${cleanPhone}. ID: ${response.data.messageId}`,
                    },
                ],
            };
        } catch (error) {
            const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
            return {
                content: [
                    {
                        type: "text",
                        text: `Erreur lors de l'envoi Brevo: ${errorMsg}`,
                    },
                ],
                isError: true,
            };
        }
    }
    throw new Error("Outil inconnu");
});

const transport = new StdioServerTransport();
await server.connect(transport);