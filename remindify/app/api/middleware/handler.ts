import { NextRequest, NextResponse } from "next/server";

export type NextFunction = () => void;
export type Middleware = (
    request: NextRequest,
    next: NextFunction
) => Promise<NextResponse | void>;
export type Controller = (
    request: NextRequest,
    params?: any
) => Promise<NextResponse>;

export const handler =
    (...args: [...Middleware[], Controller]) =>
    async (request: NextRequest, params?: any) => {
        const middleware = args.slice(0, -1) as Middleware[]; // Ensure it's an array
        const controller = args[args.length - 1] as Controller; // Ensure it's a Controller

        let result;

        for (let i = 0; i < middleware.length; i++) {
            let nextInvoked = false;

            const next = async () => {
                nextInvoked = true;
            };

            result = await middleware[i](request, next);

            if (!nextInvoked) {
                return (
                    result ||
                    new NextResponse("Middleware halted request", {
                        status: 500,
                    })
                );
            }
        }

        // Ensure the controller executes if middlewares allow
        result = await controller(request, params);
        if (result) return result;

        throw new Error(
            "Your handler or middleware must return a NextResponse!"
        );
    };
