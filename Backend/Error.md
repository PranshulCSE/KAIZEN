Uncaught (in promise) AbortError: The play() request was interrupted by a call to pause(). https://goo.gl/LdLk22
MockInterview.jsx:147 Connected to AI Mock Interview server
[Violation] 'visibilitychange' handler took 902ms

threj@Pranshul MINGW64 /c/Projects/Kaizen/backend (main)
$ npm start

> KAIZEN Backend@1.0.0 start
> node server.js

MongoDB Connected: ac-sqzwh1y-shard-00-00.jmwbtrb.mongodb.net
✓ MongoDB connected

✓ Redis connected
✓ Socket.io Mock Interview Engine initialized
✓ Server running on port 5002
info: POST /api/auth/login {"service":"kaizen-backend","timestamp":"2026-09-23T16:03:11.443Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-23T16:03:13.087Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-23T16:03:15.383Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-23T16:03:29.633Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-23T16:03:31.288Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-23T16:03:38.389Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-23T16:03:38.903Z"}
info: GET /api/resumes/6aa57dc26bcd6bab5231753e {"service":"kaizen-backend","timestamp":"2026-09-23T16:03:40.140Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-23T16:04:58.271Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-23T16:04:59.103Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-23T16:05:02.841Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-23T16:05:03.661Z"}
info: Mock Interview Socket connected: j89N1ujxzGNg55sKAAAB {"service":"kaizen-backend","timestamp":"2026-09-23T16:05:18.417Z"}
Evaluate interview turn Error: GoogleGenerativeAIError: [503 Service Unavailable] This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.
    at makeRequest (C:\Projects\Kaizen\Backend\node_modules\@google\generative-ai\dist\index.js:216:19)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)     
    at async generateContent (C:\Projects\Kaizen\Backend\node_modules\@google\generative-ai\dist\index.js:525:22)
    at async AIService._generateJSON (C:\Projects\Kaizen\Backend\src\services\aiService.js:85:22)
    at async Socket.<anonymous> (C:\Projects\Kaizen\Backend\src\services\interviewSocket.js:60:28)
error: Socket submit_answer error: Failed to evaluate interview turn: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1/models/gemini-3.6-flash:generateContent: [503 Service Unavailable] This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later. {"cause":{},"service":"kaizen-backend","stack":"Error: Failed to evaluate interview turn: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1/models/gemini-3.6-flash:generateContent: [503 Service Unavailable] This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.\n    at AIService._generateJSON (C:\\Projects\\Kaizen\\Backend\\src\\services\\aiService.js:93:13)\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)\n    at async Socket.<anonymous> (C:\\Projects\\Kaizen\\Backend\\src\\services\\interviewSocket.js:60:28)","timestamp":"2026-09-23T16:05:52.071Z"}       
info: GET /api/jobs {"service":"kaizen-backend","timestamp":"2026-09-23T16:06:07.119Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-23T16:06:07.819Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-23T16:06:09.352Z"}
info: GET /api/jobs {"service":"kaizen-backend","timestamp":"2026-09-23T16:06:09.401Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-23T16:06:10.068Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-23T16:06:10.353Z"}
info: GET /api/jobs {"service":"kaizen-backend","timestamp":"2026-09-23T16:06:15.949Z"}
info: GET /api/jobs {"service":"kaizen-backend","timestamp":"2026-09-23T16:06:16.441Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-23T16:06:19.024Z"}
info: GET /api/jobs {"service":"kaizen-backend","timestamp":"2026-09-23T16:06:19.044Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-23T16:06:19.370Z"}
info: GET /api/jobs {"service":"kaizen-backend","timestamp":"2026-09-23T16:06:19.573Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-23T16:06:29.006Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-23T16:06:29.405Z"}
info: GET /api/resumes/6aa57dc26bcd6bab5231753e {"service":"kaizen-backend","timestamp":"2026-09-23T16:06:29.561Z"}
info: GET /api/resumes/6a9e6467c2c2baef47625c91 {"service":"kaizen-backend","timestamp":"2026-09-23T16:06:42.040Z"}
info: GET /api/resumes/6a86bc9ef486148de6113553 {"service":"kaizen-backend","timestamp":"2026-09-23T16:06:47.657Z"}
info: GET /api/resumes/6a86944139ec7cbf47152dd4 {"service":"kaizen-backend","timestamp":"2026-09-23T16:06:54.998Z"}
info: PUT /api/resumes/6a86944139ec7cbf47152dd4 {"service":"kaizen-backend","timestamp":"2026-09-23T16:07:37.014Z"}
info: POST /api/resumes/6a86944139ec7cbf47152dd4/download {"service":"kaizen-backend","timestamp":"2026-09-23T16:07:38.846Z"}
TypeError: Converting circular structure to JSON
    --> starting at object with constructor 'PDFDocument'
    |     property '_root' -> object with constructor 'PDFReference'
    --- property 'document' closes the circle
    at JSON.stringify (<anonymous>)
    at stringify (C:\Projects\Kaizen\Backend\node_modules\express\lib\response.js:1160:12)
    at ServerResponse.json (C:\Projects\Kaizen\Backend\node_modules\express\lib\response.js:271:14)
    at ServerResponse.send (C:\Projects\Kaizen\Backend\node_modules\express\lib\response.js:162:21)
    at downloadResume (C:\Projects\Kaizen\Backend\src\controllers\resumeController.js:349:13)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)     




Microsoft Windows [Version 10.0.26200.9457]
(c) Microsoft Corporation. All rights reserved.

C:\Users\threj>cd ..

C:\Users>cd ..

C:\>cd Projects\kaizen\Backend

C:\Projects\Kaizen\Backend>npm start

> KAIZEN Backend@1.0.0 start
> node server.js

MongoDB Connected: ac-sqzwh1y-shard-00-00.jmwbtrb.mongodb.net
✓ MongoDB connected

✓ Redis connected
✓ Socket.io Mock Interview Engine initialized
✓ Server running on port 5002
info: POST /api/auth/login {"service":"kaizen-backend","timestamp":"2026-09-24T03:57:58.747Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-24T03:58:00.170Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-24T03:58:01.097Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-24T03:58:26.026Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-24T03:58:27.038Z"}
info: GET /api/resumes/6aa57dc26bcd6bab5231753e {"service":"kaizen-backend","timestamp":"2026-09-24T03:58:27.221Z"}
info: PUT /api/resumes/6aa57dc26bcd6bab5231753e {"service":"kaizen-backend","timestamp":"2026-09-24T04:01:48.624Z"}
Redis Client Error Error: read ECONNRESET
    at TCP.onStreamRead (node:internal/stream_base_commons:216:20) {
  errno: -4077,
  code: 'ECONNRESET',
  syscall: 'read'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: connect ECONNREFUSED 54.87.40.20:17419
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16) {
  errno: -4078,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '54.87.40.20',
  port: 17419
}
Redis Client Error Error: connect ECONNREFUSED 54.87.40.20:17419
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16) {
  errno: -4078,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '54.87.40.20',
  port: 17419
}
Redis Client Error Error: connect ECONNREFUSED 54.87.40.20:17419
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16) {
  errno: -4078,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '54.87.40.20',
  port: 17419
}
Redis Client Error Error: connect ECONNREFUSED 54.87.40.20:17419
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16) {
  errno: -4078,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '54.87.40.20',
  port: 17419
}
Redis Client Error Error: connect ECONNREFUSED 54.87.40.20:17419
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16) {
  errno: -4078,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '54.87.40.20',
  port: 17419
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: connect ECONNREFUSED 54.87.40.20:17419
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16) {
  errno: -4078,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '54.87.40.20',
  port: 17419
}
Redis Client Error Error: connect ECONNREFUSED 54.87.40.20:17419
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16) {
  errno: -4078,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '54.87.40.20',
  port: 17419
}
Redis Client Error Error: connect ECONNREFUSED 54.87.40.20:17419
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1637:16) {
  errno: -4078,
  code: 'ECONNREFUSED',
  syscall: 'connect',
  address: '54.87.40.20',
  port: 17419
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)

info: GET /api/resumes/6aa57dc26bcd6bab5231753e {"service":"kaizen-backend","timestamp":"2026-09-24T05:19:56.457Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-24T05:20:13.524Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-24T05:20:14.022Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-24T05:20:18.069Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-24T05:20:18.897Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-24T05:20:23.441Z"}
info: GET /api/jobs {"service":"kaizen-backend","timestamp":"2026-09-24T05:20:23.507Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-24T05:20:24.254Z"}
info: GET /api/jobs {"service":"kaizen-backend","timestamp":"2026-09-24T05:20:25.335Z"}
info: GET /api/jobs {"service":"kaizen-backend","timestamp":"2026-09-24T05:20:29.767Z"}
info: GET /api/jobs {"service":"kaizen-backend","timestamp":"2026-09-24T05:20:30.089Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-24T05:20:32.285Z"}
info: GET /api/resumes {"service":"kaizen-backend","timestamp":"2026-09-24T05:20:32.621Z"}
info: POST /api/ai/github-repos {"service":"kaizen-backend","timestamp":"2026-09-24T05:20:45.543Z"}
info: POST /api/ai/github-bullets {"service":"kaizen-backend","timestamp":"2026-09-24T05:20:58.067Z"}
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
info: GET /api/admin/logs {"service":"kaizen-backend","timestamp":"2026-09-24T05:21:26.657Z"}
info: GET /api/admin/logs {"service":"kaizen-backend","timestamp":"2026-09-24T05:21:27.148Z"}
Redis Client Error Error: read ECONNRESET
    at TCP.onStreamRead (node:internal/stream_base_commons:216:20) {
  errno: -4077,
  code: 'ECONNRESET',
  syscall: 'read'
}

Redis Client Error Error: read ECONNRESET
    at TCP.onStreamRead (node:internal/stream_base_commons:216:20) {
  errno: -4077,
  code: 'ECONNRESET',
  syscall: 'read'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}

Redis Client Error Error: read ECONNRESET
    at TCP.onStreamRead (node:internal/stream_base_commons:216:20) {
  errno: -4077,
  code: 'ECONNRESET',
  syscall: 'read'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}

Redis Client Error Error: read ECONNRESET
    at TCP.onStreamRead (node:internal/stream_base_commons:216:20) {
  errno: -4077,
  code: 'ECONNRESET',
  syscall: 'read'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}

Redis Client Error Error: read ECONNRESET
    at TCP.onStreamRead (node:internal/stream_base_commons:216:20) {
  errno: -4077,
  code: 'ECONNRESET',
  syscall: 'read'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)

Redis Client Error Error: read ECONNRESET
    at TCP.onStreamRead (node:internal/stream_base_commons:216:20) {
  errno: -4077,
  code: 'ECONNRESET',
  syscall: 'read'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)

Redis Client Error Error: read ECONNRESET
    at TCP.onStreamRead (node:internal/stream_base_commons:216:20) {
  errno: -4077,
  code: 'ECONNRESET',
  syscall: 'read'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error ConnectionTimeoutError: Connection timeout
    at Socket.<anonymous> (C:\Projects\Kaizen\Backend\node_modules\@redis\client\dist\lib\client\socket.js:177:124)
    at Object.onceWrapper (node:events:622:28)
    at Socket.emit (node:events:508:28)
    at Socket._onTimeout (node:net:604:8)
    at listOnTimeout (node:internal/timers:608:17)
    at process.processTimers (node:internal/timers:543:7)
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}
Redis Client Error Error: getaddrinfo ENOTFOUND retrofine-limeish-rainstorm-85956.db.redis.io
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'retrofine-limeish-rainstorm-85956.db.redis.io'
}

Redis Client Error Error: read ECONNRESET
    at TCP.onStreamRead (node:internal/stream_base_commons:216:20) {
  errno: -4077,
  code: 'ECONNRESET',
  syscall: 'read'
}

Redis Client Error Error: read ECONNRESET
    at TCP.onStreamRead (node:internal/stream_base_commons:216:20) {
  errno: -4077,
  code: 'ECONNRESET',
  syscall: 'read'
}

Terminate batch job (Y/N)? y




