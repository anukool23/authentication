import resend from "../config/resend";
import { EMAIL_SENDER, NODE_ENV } from "../constants/env";

type Params = {
    to: string;
    subject: string;
    html: string;
    text: string;
}

const getFromEmail = () => {
    return NODE_ENV === "development" ? "onboarding@resend.dev" : EMAIL_SENDER;
}

const getToEmail = (to: string) => {
    return NODE_ENV === "development" ? "delivered@resend.dev" : to; 
}

type SendMailError = {
    name: string;
    message: string;
    stack?: string;
};

export const sendMail = async ({ to, subject, text, html }: Params) => {
    try {
        const data = await resend.emails.send({
            from: getFromEmail(),
            to: getToEmail(to),
            subject,
            text,
            html
        });
        return { data, error: null };
    } catch (error: any) {  // Ensure `error` has a proper type
        const sendMailError: SendMailError = {
            name: error?.name || "UnknownError",
            message: error?.message || "Something went wrong",
            stack: error?.stack
        };
        return { data: null, error: sendMailError };
    }
};

