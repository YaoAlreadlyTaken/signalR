declare var uni: any;
export class UniWebSocket {
    static readonly CLOSED: number = 3;
    static readonly CLOSING: number = 2;
    static readonly CONNECTING: number = 0;
    static readonly OPEN: number = 1;

    readyState: number = 3;

    onclose: ((ev?: any) => any) | null = null;
    onerror: ((ev?: any) => any) | null = null;
    onmessage: ((ev?: any) => any) | null = null;
    onopen: ((ev?: any) => any) | null = null;

    private socket: any;

    constructor(url: string, protocols?: string | string[], options?: any) {
        let headers = {};
        if (options) {
            headers = options.headers || {}
        }
        let socket = uni.connectSocket
            ({
                url: url,
                protocols: protocols,
                header: headers,
                fail: (err: any) => {
                    console.log(err);
                }
            });

        this.socket = socket;
        console.log(socket);

        this.readyState = UniWebSocket.CONNECTING;

        socket.onOpen(() => {
            console.log("webscoket open")
            this.readyState = UniWebSocket.OPEN;
            if (this.onopen) {
                this.onopen();
            }
        });

        socket.onMessage((data: any) => {
            console.log("", data)
            if (this.onmessage) {
                this.onmessage(data);
            }

        });

        socket.onError((err: any) => {
            console.log("webscoket error", err);
            this.readyState = UniWebSocket.CLOSED;
            if (this.onclose) {
                this.onclose();
            }

        });

    }

    close(code?: number, reason?: string): void {
        this.socket.close({
            code,
            reason,
            fail: (err: any) => {
                console.log(err);
            }
        })
    }
    /**
     * Transmits data using the WebSocket connection. data can be a string, a Blob, an ArrayBuffer, or an ArrayBufferView.
     */
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
        this.socket.send({
            data,
            fail: (err: any) => {
                console.log(err);
            }
        })
    }

}