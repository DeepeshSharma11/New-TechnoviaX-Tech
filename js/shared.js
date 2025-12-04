// js/shared.js

/**
 * XSS हमलों को रोकने के लिए HTML को एस्केप (Escape) करता है।
 * इसका उपयोग तब करें जब आप यूजर इनपुट को स्क्रीन पर दिखा रहे हों।
 */
export function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag]));
}

/**
 * सुरक्षित तरीके से इनपुट को वैलिडेट (Validate) करता है।
 */
export const Validators = {
    email: (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    },
    phone: (phone) => {
        // केवल 10-15 अंकों की अनुमति देता है
        const re = /^\d{10,15}$/; 
        return re.test(String(phone).replace(/[\s-]/g, '')); 
    },
    text: (text) => {
        // खाली नहीं होना चाहिए और खतरनाक कैरेक्टर नहीं होने चाहिए
        return text && text.trim().length > 0 && !/[<>]/.test(text);
    }
};