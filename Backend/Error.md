Failed to load resource: net::ERR_CONNECTION_REFUSED
:5002/api/ai/github-bullets:1  Failed to load resource: the server responded with a status of 500 (Internal Server Error)

 POST /api/ai/github-bullets {"service":"kaizen-backend","timestamp":"2026-09-23T08:17:50.155Z"}
Generate GitHub project bullets Error: GoogleGenerativeAIError: [503 Service Unavailable] This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.
    at makeRequest (C:\Projects\Kaizen\Backend\node_modules\@google\generative-ai\dist\index.js:216:19)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)     
    at async generateContent (C:\Projects\Kaizen\Backend\node_modules\@google\generative-ai\dist\index.js:525:22)
    at async AIService._generateJSON (C:\Projects\Kaizen\Backend\src\services\aiService.js:85:22)
    at async generateGitHubBullets (C:\Projects\Kaizen\Backend\src\controllers\aiController.js:370:24)
GitHub bullets generation error: Error: Failed to generate github project bullets: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1/models/gemini-3.6-flash:generateContent: [503 Service Unavailable] This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.
    at AIService._generateJSON (C:\Projects\Kaizen\Backend\src\services\aiService.js:93:13)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)     
    at async generateGitHubBullets (C:\Projects\Kaizen\Backend\src\controllers\aiController.js:370:24) {
  [cause]: GoogleGenerativeAIError: [503 Service Unavailable] This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.
      at makeRequest (C:\Projects\Kaizen\Backend\node_modules\@google\generative-ai\dist\index.js:216:19)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)   
      at async generateContent (C:\Projects\Kaizen\Backend\node_modules\@google\generative-ai\dist\index.js:525:22)
      at async AIService._generateJSON (C:\Projects\Kaizen\Backend\src\services\aiService.js:85:22)
      at async generateGitHubBullets (C:\Projects\Kaizen\Backend\src\controllers\aiController.js:370:24)
}