import { AbortError } from "./Errors";
import { HttpClient, HttpRequest, HttpResponse } from "./HttpClient";
import { ILogger, LogLevel } from "./ILogger";
declare var uni: any;

export class UniHttpClient extends HttpClient {
    private readonly logger: ILogger;

    public constructor(logger: ILogger) {
        super();
        this.logger = logger;
    }

    /** @inheritDoc */
    public send(request: HttpRequest): Promise<HttpResponse> {
        // Check that abort was not signaled before calling send
        if (request.abortSignal && request.abortSignal.aborted) {
            return Promise.reject(new AbortError());
        }

        if (!request.method) {
            return Promise.reject(new Error("No method defined."));
        }
        if (!request.url) {
            return Promise.reject(new Error("No url defined."));
        }

        return new Promise<HttpResponse>((resolve, reject) => {
            uni.request({
                url: request.url,
                header: request.headers,
                method: request.method,
                success: (res: any) => {
                    resolve(
                        new HttpResponse(
                            res.statusCode,
                            res.errMsg,
                            JSON.stringify(res.data)
                        )
                    );
                },
                fail: (err: any) => {
                    this.logger.log(LogLevel.Warning, JSON.stringify(err));
                    reject(err);
                },
            });
        });
    }
}
