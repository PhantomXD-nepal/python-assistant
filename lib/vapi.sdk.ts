import Vapi from '@vapi-ai/web'

console.log("Vapi initialized with API key:", process.env.NEXT_PUBLIC_VAPI_API);

export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API!)