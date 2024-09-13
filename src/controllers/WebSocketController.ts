import WebSocket from 'ws';

type UseCaseHandler = (ws: WebSocket, payload: any, broadcastToAll: OmitThisParameter<(message: any) => void>) => Promise<void>;
export interface WebSocketWithMeta extends WebSocket {
    metadata?: {
        name: string;
        [key: string]: any;
    };
}

const acknowledgeRequests: Set<string> = new Set();
const connections: Map<string, WebSocketWithMeta> = new Map();

export class WebSocketController {

    constructor(
        private wss: WebSocket.Server,
        private useCaseHandlers: { [key: string]: UseCaseHandler }
    ) {}

    async handleConnection(ws: WebSocketWithMeta, requestUrl: string) {
        const urlParams = new URLSearchParams(requestUrl.split('?')[1]);
        const name = urlParams.get('name');

        if (!name) {
            ws.send(JSON.stringify({ error: 'Missing name parameter' }));
            ws.close();
            return;
        }

        ws.metadata = { name };

        try {
            await this.useCaseHandlers['connect'](ws, { name }, this.broadcastToAll.bind(this));

            console.log(JSON.stringify({ payload: {}, player: name, type: 'player_connect' }));

            this.setupMessageHandler(ws);
            this.setupDisconnectionHandler(ws, name);

            connections.set(name, ws);
        } catch (error) {
            ws.send(JSON.stringify({ error: error.message }));
            ws.close();
        }
    }

    setupMessageHandler(ws: WebSocket) {
        ws.on('message', async (message) => {
            try {
                const parsedMessage = JSON.parse(message.toString());
                const nonce: string = parsedMessage.nonce;
                console.log("handling: " + message.toString())
                const handler = this.useCaseHandlers[parsedMessage.type];

                if (acknowledgeRequests.has(nonce)) {
                    ws.send(JSON.stringify({ error: `request seen before: ${nonce}` }));
                    return;
                }

                if (handler) {
                    await handler(ws, parsedMessage.payload, this.broadcastToAll.bind(this));
                    acknowledgeRequests.add(nonce);
                } else {
                    ws.send(JSON.stringify({ error: 'Unknown message type' }));
                }
            } catch (error) {
                ws.send(JSON.stringify({ error: error.message }));
            }
        });
    }

    setupDisconnectionHandler(ws: WebSocket, name: string) {
        ws.on('close', async () => {
            await this.useCaseHandlers['disconnect'](ws, { name }, this.broadcastToAll.bind(this));
        });

        ws.on('error', (error) => {
            console.log(error);
        });
    }

    broadcastToAll(message: any) {
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }
}
